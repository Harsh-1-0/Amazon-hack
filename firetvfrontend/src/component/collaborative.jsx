"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function Collaborative() {
    const [localStream, setLocalStream] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [roomId, setRoomId] = useState("");
    const [hasJoinedRoom, setHasJoinedRoom] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const shareVideoRef = useRef(null);

    const socketRef = useRef(null);
    const peerConnection = useRef(null);

    // Store original camera stream for switching back
    const originalCameraStream = useRef(null);
    const currentScreenStream = useRef(null);

    // @ts-ignore
    const MediaStreamGlobal = typeof window !== "undefined" && window.MediaStream ? window.MediaStream : class {};

    // Separate remote streams
    const remoteCamStream = useRef(new MediaStreamGlobal());
    const remoteScreenStream = useRef(new MediaStreamGlobal());

    useEffect(() => {
        socketRef.current = io(process.env.NEXT_PUBLIC_CHAT_SERVER);

        socketRef.current.on("connect", () => {
            console.log("Connected to server:", socketRef.current.id);
            setIsConnected(true);
        });

        return () => {
            socketRef.current?.disconnect();
            // Clean up streams
            if (originalCameraStream.current) {
                originalCameraStream.current.getTracks().forEach(track => track.stop());
            }
            if (currentScreenStream.current) {
                currentScreenStream.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        const getMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setLocalStream(stream);
                originalCameraStream.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing local media:", err);
            }
        };
        getMedia();
    }, []);

    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = isAudioEnabled);
            localStream.getVideoTracks().forEach(track => track.enabled = isVideoEnabled);
        }
    }, [isAudioEnabled, isVideoEnabled, localStream]);

    const joinRoom = () => {
        if (!roomId || !socketRef.current || !localStream) return;

        socketRef.current.emit("join-room", roomId);
        setHasJoinedRoom(true);

        peerConnection.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        localStream.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, localStream);
        });

        peerConnection.current.onicecandidate = (e) => {
            if (e.candidate) {
                socketRef.current.emit("ice-candidate", { roomId, candidate: e.candidate });
            }
        };

        // Improved remote stream handling
        peerConnection.current.ontrack = (event) => {
            console.log("Track received:", event.track.kind, event.track.label);
            
            const [remoteStream] = event.streams;
            if (!remoteStream) return;

            // Check if this is a screen share stream
            const isScreenShare = remoteStream.getTracks().some(track => 
                track.label && (
                    track.label.toLowerCase().includes('screen') || 
                    track.label.toLowerCase().includes('display') ||
                    track.label.toLowerCase().includes('monitor')
                )
            );

            if (isScreenShare) {
                console.log("📺 Screen share stream received");
                if (shareVideoRef.current) {
                    shareVideoRef.current.srcObject = remoteStream;
                }
            } else {
                console.log("📷 Camera stream received");
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                }
            }
        };

        socketRef.current.on("offer", async (offer) => {
            try {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                socketRef.current.emit("answer", { roomId, answer });
            } catch (error) {
                console.error("Error handling offer:", error);
            }
        });

        socketRef.current.on("answer", async (answer) => {
            try {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error("Error handling answer:", error);
            }
        });

        socketRef.current.on("ice-candidate", async ({ candidate }) => {
            try {
                if (candidate && peerConnection.current) {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (error) {
                console.error("Error adding ICE candidate:", error);
            }
        });

        socketRef.current.on("ready", async () => {
            try {
                const offer = await peerConnection.current.createOffer();
                await peerConnection.current.setLocalDescription(offer);
                socketRef.current.emit("offer", { roomId, offer });
            } catch (error) {
                console.error("Error creating offer:", error);
            }
        });
    };

    const handleScreenShare = async () => {
        try {
            if (isScreenSharing) {
                // Stop screen sharing and return to camera
                await stopScreenShare();
                return;
            }

            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            currentScreenStream.current = screenStream;
            setIsScreenSharing(true);

            // Display local screen share
            if (shareVideoRef.current) {
                shareVideoRef.current.srcObject = screenStream;
            }

            // Replace video track in peer connection
            if (peerConnection.current) {
                const videoSender = peerConnection.current.getSenders().find(sender => 
                    sender.track && sender.track.kind === 'video'
                );

                if (videoSender) {
                    const screenVideoTrack = screenStream.getVideoTracks()[0];
                    await videoSender.replaceTrack(screenVideoTrack);
                    
                    // Renegotiate
                    const offer = await peerConnection.current.createOffer();
                    await peerConnection.current.setLocalDescription(offer);
                    socketRef.current.emit("offer", { roomId, offer });
                }
            }

            // Handle screen share end
            screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                stopScreenShare();
            });

        } catch (err) {
            console.error("Screen share error:", err);
            setIsScreenSharing(false);
        }
    };

    const stopScreenShare = async () => {
        if (currentScreenStream.current) {
            currentScreenStream.current.getTracks().forEach(track => track.stop());
            currentScreenStream.current = null;
        }

        setIsScreenSharing(false);

        // Clear local screen share display
        if (shareVideoRef.current) {
            shareVideoRef.current.srcObject = null;
        }

        // Return to camera stream
        if (peerConnection.current && originalCameraStream.current) {
            const videoSender = peerConnection.current.getSenders().find(sender => 
                sender.track && sender.track.kind === 'video'
            );

            if (videoSender) {
                const cameraVideoTrack = originalCameraStream.current.getVideoTracks()[0];
                if (cameraVideoTrack) {
                    await videoSender.replaceTrack(cameraVideoTrack);
                    
                    // Renegotiate
                    const offer = await peerConnection.current.createOffer();
                    await peerConnection.current.setLocalDescription(offer);
                    socketRef.current.emit("offer", { roomId, offer });
                }
            }
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>🎥 Collaborative Streaming</h2>

            {/* Connection Status */}
            <div style={{ marginBottom: "10px", color: isConnected ? "green" : "red" }}>
                Status: {isConnected ? "Connected" : "Disconnected"}
            </div>

            {/* Room Join */}
            <div style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    style={{ padding: "6px", marginRight: "10px" }}
                />
                <button onClick={joinRoom} disabled={hasJoinedRoom || !isConnected}>
                    {hasJoinedRoom ? "Joined" : "Join Room"}
                </button>
            </div>

            {/* Controls */}
            <div style={{ marginBottom: "20px" }}>
                {/* Push-To-Talk */}
                <button
                    onMouseDown={() => setIsAudioEnabled(true)}
                    onMouseUp={() => setIsAudioEnabled(false)}
                    onTouchStart={() => setIsAudioEnabled(true)}
                    onTouchEnd={() => setIsAudioEnabled(false)}
                    style={{
                        marginRight: "10px",
                        padding: "10px",
                        background: isAudioEnabled ? "#28a745" : "#2d72d9",
                        color: "white",
                        border: "none",
                        borderRadius: "4px"
                    }}
                >
                    🎙️ {isAudioEnabled ? "Talking..." : "Hold to Talk"}
                </button>

                {/* Video Toggle */}
                <button 
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    style={{
                        marginRight: "10px",
                        padding: "10px",
                        background: isVideoEnabled ? "#28a745" : "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px"
                    }}
                >
                    📹 {isVideoEnabled ? "Video On" : "Video Off"}
                </button>

                {/* Screen Share */}
                <button 
                    onClick={handleScreenShare}
                    disabled={!hasJoinedRoom}
                    style={{
                        padding: "10px",
                        background: isScreenSharing ? "#ffc107" : "#17a2b8",
                        color: isScreenSharing ? "black" : "white",
                        border: "none",
                        borderRadius: "4px"
                    }}
                >
                    🖥️ {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                </button>
            </div>

            {/* Videos */}
            <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
                <div>
                    <h4>Local Video (You)</h4>
                    <video 
                        ref={localVideoRef} 
                        autoPlay 
                        muted 
                        playsInline 
                        style={{ 
                            width: "300px", 
                            height: "200px",
                            borderRadius: "8px",
                            border: "2px solid #ddd",
                            backgroundColor: "#000"
                        }} 
                    />
                </div>
                
                <div>
                    <h4>Remote Video (Peer)</h4>
                    <video 
                        ref={remoteVideoRef} 
                        autoPlay 
                        playsInline 
                        style={{ 
                            width: "300px", 
                            height: "200px",
                            borderRadius: "8px",
                            border: "2px solid #ddd",
                            backgroundColor: "#000"
                        }} 
                    />
                </div>
                
                <div>
                    <h4>Screen Share</h4>
                    <video 
                        ref={shareVideoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        style={{ 
                            width: "300px", 
                            height: "200px",
                            borderRadius: "8px",
                            border: "2px solid #ddd",
                            backgroundColor: "#000"
                        }} 
                    />
                </div>
            </div>
        </div>
    );
}