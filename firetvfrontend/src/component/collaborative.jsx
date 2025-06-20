"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Collaborative Streaming Component with Room Support and Push-to-Talk
export default function Collaborative() {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [shareStream, setShareStream] = useState(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false); // Start muted
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [roomId, setRoomId] = useState("");
    const [hasJoinedRoom, setHasJoinedRoom] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const shareVideoRef = useRef(null);
    const socketRef = useRef(null);
    const peerConnection = useRef(null);

    // Connect to socket server
    useEffect(() => {
        socketRef.current = io(process.env.NEXT_PUBLIC_CHAT_SERVER);

        socketRef.current.on("connect", () => {
            console.log("Connected to server:", socketRef.current.id);
            setIsConnected(true);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    // Get local media stream
    useEffect(() => {
        const getMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing local media:", err);
            }
        };
        getMedia();
    }, []);

    // Apply audio/video toggle
    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = isAudioEnabled);
            localStream.getVideoTracks().forEach(track => track.enabled = isVideoEnabled);
        }
    }, [isAudioEnabled, isVideoEnabled, localStream]);

    // Join room and setup peer logic
    const joinRoom = () => {
        if (!roomId || !socketRef.current || !localStream) return;
        console.log("Joining room:", roomId);
        socketRef.current.emit("join-room", roomId);
        setHasJoinedRoom(true);

        peerConnection.current = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }, // Free public STUN server
            ],
        });

        // Add tracks
        localStream.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, localStream);
        });

        peerConnection.current.onicecandidate = (e) => {
            if (e.candidate) {
                socketRef.current.emit("ice-candidate", { roomId, candidate: e.candidate });
            }
        };

        peerConnection.current.ontrack = (e) => {
            const [stream] = e.streams;
            setRemoteStream(stream);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
        };

        // Signaling events
        socketRef.current.on("offer", async (offer) => {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socketRef.current.emit("answer", { roomId, answer });
        });

        socketRef.current.on("answer", async (answer) => {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socketRef.current.on("ice-candidate", async ({ candidate }) => {
            if (candidate) {
                try {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error("Failed to add ICE candidate:", err);
                }
            }
        });

        // Initiate offer if first to join
        socketRef.current.on("ready", async () => {
            console.log("Ready to create offer");
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            socketRef.current.emit("offer", { roomId, offer });
        });
    };

    // Screen Sharing
    const handleScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });
            setShareStream(screenStream);
            setIsScreenSharing(true);
            if (shareVideoRef.current) {
                shareVideoRef.current.srcObject = screenStream;
            }
            screenStream.getTracks().forEach(track => {
                peerConnection.current?.addTrack(track, screenStream);
            });
        } catch (err) {
            console.error("Screen share error:", err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Collaborative Streaming</h2>

            {/* Room Join Controls */}
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

            {/* Push-To-Talk */}
            <button
                onMouseDown={() => setIsAudioEnabled(true)}
                onMouseUp={() => setIsAudioEnabled(false)}
                onTouchStart={() => setIsAudioEnabled(true)}
                onTouchEnd={() => setIsAudioEnabled(false)}
                style={{ marginRight: "10px", padding: "10px", background: "#2d72d9", color: "white", border: "none" }}
            >
                🎙️ Hold to Talk
            </button>

            {/* Screen Share */}
            <button onClick={handleScreenShare}>
                {isScreenSharing ? "Sharing Screen..." : "Share Screen"}
            </button>

            {/* Videos */}
            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                <div>
                    <h4>Local Video</h4>
                    <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "300px" }} />
                </div>
                <div>
                    <h4>Remote Video</h4>
                    <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "300px" }} />
                </div>
                {isScreenSharing && (
                    <div>
                        <h4>Screen Share</h4>
                        <video ref={shareVideoRef} autoPlay muted playsInline style={{ width: "300px" }} />
                    </div>
                )}
            </div>
        </div>
    );
}
