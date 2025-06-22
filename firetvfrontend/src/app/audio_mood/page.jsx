"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import bg0 from "../../images/fluxBg/bg0.png";
import bg1 from "../../images/fluxBg/bg1.png";
import bg2 from "../../images/fluxBg/bg2.png";
import bg3 from "../../images/fluxBg/bg3.png";
import bg4 from "../../images/fluxBg/bg4.png";

const fluxImages = [bg0, bg1, bg2, bg3, bg4];

export default function AudioMoodPage() {
    const [recording, setRecording] = useState(false);
    const [error, setError] = useState("");
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const router = useRouter();

    const checkTimeFromImage = ()=>{
        const currentHour = new Date().getHours();
        if(currentHour >= 0 && currentHour < 4) {
            return fluxImages[4]; // Early morning
        }else if(currentHour >= 4 && currentHour < 12) {
            return fluxImages[0]; // Morning
        }else if(currentHour >= 12 && currentHour < 17) {
            return fluxImages[1]; // Afternoon
        }
        else if(currentHour >= 17 && currentHour < 21) {
            return fluxImages[2]; // Evening
        }else return fluxImages[3]; // Night
    }
    const startRecording = async () => {
        setError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const reader = new FileReader();
                reader.onloadend = () => {
                    localStorage.setItem("audio_mood_blob", reader.result);
                    router.push("/flux");
                };
                reader.readAsDataURL(audioBlob);
            };

            mediaRecorderRef.current.start();
            setRecording(true);

            // Stop recording after 10 seconds
            setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                    mediaRecorderRef.current.stop();
                    setRecording(false);
                }
            }, 10000);
        } catch (err) {
            setError("🎤 Microphone access denied or not available.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
            {/* Background image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src={checkTimeFromImage()}
                    alt="Background"
                    fill
                    style={{ objectFit: 'cover', opacity: 0.5 }}
                    priority
                />
            </div>
            <div className="max-w-xl w-full p-8 bg-white/80 shadow-xl rounded-2xl text-center space-y-6 backdrop-blur-md">
                <h1 className="text-3xl font-bold text-gray-800">
                    Record Your Mood
                </h1>
                <p className="text-gray-600">
                    We'll analyze your voice and generate a personalized daylist based on your mood.
                </p>

                {error && <div className="text-red-500 font-medium">{error}</div>}

                <button
                    onClick={recording ? stopRecording : startRecording}
                    className={`w-full py-3 text-lg rounded-xl font-semibold transition-all duration-300 shadow-md ${
                        recording
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                >
                    {recording ? "⏹ Stop Recording" : "🎙 Start Recording"}
                </button>

                {recording && (
                    <div className="flex items-center justify-center gap-2 text-indigo-700 font-medium animate-pulse">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                        Recording...
                    </div>
                )}
            </div>
        </div>
    );
}
