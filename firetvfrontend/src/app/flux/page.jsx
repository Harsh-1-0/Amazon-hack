"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { useVoice } from "@humeai/voice-react";

import bg0 from "../../images/fluxBg/bg0.png";
import bg1 from "../../images/fluxBg/bg1.png";
import bg2 from "../../images/fluxBg/bg2.png";
import bg3 from "../../images/fluxBg/bg3.png";
import bg4 from "../../images/fluxBg/bg4.png";
import flux from "../../images/flux.png";

const BACKEND_URL = process.env.NEXT_PUBLIC_ARCHTYPE_API || "http://localhost:8000";

export default function FluxPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [transitionDone, setTransitionDone] = useState(false);
  const [message, setMessage] = useState("Hello!");
  const [userId, setUserId] = useState(null);
  const { connect, disconnect, status, messages, error: humeError } = useVoice();
  const [uiStatus, setUiStatus] = useState("Ready");
  const [dayList, setDayList] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) setMessage("Good Morning!");
    else if (hour >= 12 && hour < 17) setMessage("Good Afternoon!");
    else if (hour >= 17 && hour < 21) setMessage("Good Evening!");
    else setMessage("Good Night!");

    const welcomeTimer = setTimeout(() => setShowWelcome(true), 500);
    const transitionTimer = setTimeout(() => setTransitionDone(true), 2500);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_SERVER}/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });
        setUserId(response.data.user_id || null);
      } catch (err) {
        console.error("Error fetching user ID:", err);
        setError("Could not retrieve user information.");
      }
    };
    getUser();
  }, []);

  const fetchDaylist = useCallback(async (userId, mood) => {
    setUiStatus(`Mood detected as "${mood}". Generating your daylist...`);
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("mood", mood);
    try {
      const response = await axios.post(`${BACKEND_URL}/daylist`, formData);
      setDayList(response.data);
      setUiStatus("Done");
    } catch (err) {
      console.error("Error fetching daylist:", err);
      setError(err.response?.data?.detail || "Failed to generate daylist.");
      setUiStatus("Error");
    }
  }, []);

  const handleStartConversation = useCallback(() => {
    if (!userId) {
      setError("User ID not available. Please try again later.");
      return;
    }
    setError(null);
    setDayList(null);
    setUiStatus("Connecting...");

    connect()
      .then(() => {
        console.log("✅ Connected to Hume Voice");
        setUiStatus("Listening...");
      })
      .catch((err) => {
        console.error("❌ Hume Connection Error:", err);
        setError("A connection error occurred with the voice interface.");
        setUiStatus("Error");
      });
  }, [connect, userId]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === "user_message" && lastMessage.models.prosody) {
      const scores = lastMessage.models.prosody.scores;
      const topEmotion = Object.entries(scores).reduce(
        (top, [emotion, score]) => (score > top.score ? { emotion, score } : top),
        { emotion: "neutral", score: 0 }
      );
      console.log(" Detected emotion:", topEmotion.emotion);
      disconnect();
      fetchDaylist(userId, topEmotion.emotion);
    }
  }, [messages, disconnect, fetchDaylist, userId]);

  useEffect(() => {
    if (humeError) {
      setError("Hume Voice SDK error. Please check your API key and internet.");
      console.error("Hume SDK Error:", humeError);
      setUiStatus("Error");
    }
  }, [humeError]);

  const getCurrentBackground = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 4) return bg4;
    if (hour >= 4 && hour < 12) return bg0;
    if (hour >= 12 && hour < 17) return bg1;
    if (hour >= 17 && hour < 21) return bg2;
    return bg3;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black font-sans">
      <div className="absolute inset-0 z-0">
        <Image src={getCurrentBackground()} alt="bg" fill style={{ objectFit: "cover", opacity: 0.6, filter: "blur(2px) brightness(0.8)" }} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      <div className={`absolute left-1/2 top-1/2 z-10 flex flex-col items-center justify-center transition-all duration-700 ${transitionDone ? "-translate-x-1/2 scale-50 top-10" : "-translate-x-1/2 -translate-y-1/2 scale-100"}`} style={{ pointerEvents: "none" }}>
        <div className="p-4">
          <Image src={flux} alt="Flux Logo" width={transitionDone ? 180 : 260} height={transitionDone ? 180 : 260} className="transition-all duration-700 drop-shadow-2xl" />
        </div>
        <div className={`mt-8 text-4xl font-extrabold text-white text-center tracking-tight transition-opacity duration-700 ${showWelcome ? "opacity-100" : "opacity-0"} ${transitionDone ? "text-5xl mt-4" : ""}`}>
          {transitionDone ? "Made for you by you" : "Welcome to Flux"}
        </div>
      </div>

      <div className={`absolute left-0 bottom-0 w-full bg-white/90 backdrop-blur-xl rounded-t-3xl shadow-2xl z-20 transition-transform duration-700 ${transitionDone ? "translate-y-0" : "translate-y-full"}`} style={{ minHeight: "60vh" }}>
        <div className="px-8 py-10">
          <div className="text-2xl font-semibold text-gray-800 mb-2">👋 {message}</div>
          <div className="text-lg text-gray-600 mb-6">
            This is what <span className="font-bold text-purple-500">Flux</span> suggests for you based on your <span className="font-semibold text-blue-500">archetype</span>, <span className="font-semibold text-yellow-500">time of the day</span> and <span className="font-semibold text-pink-500">emotion</span>.
          </div>

          <div className="text-center">
            <button
              onClick={handleStartConversation}
              disabled={status.value !== "disconnected" || !userId}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-400 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg"
            >
              {status.value === "disconnected" ? "🎙 Start My Daylist" : "Listening..."}
            </button>
            <p className="text-slate-500 text-sm mt-4 min-h-[20px]">
              {status.value !== "disconnected" ? uiStatus : `Status: ${status.value}`}
            </p>
          </div>

          <div className="mt-8">
            {error && <p className="text-red-500 text-center font-semibold">Error: {error}</p>}

            {dayList ? (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{dayList.title}</h2>
                <ul className="space-y-3">
                  {dayList.shows.map((show, index) => (
                    <li key={index} className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 rounded-lg shadow-sm">
                      <h3 className="font-bold text-lg text-gray-900">{show.character_name} from {show.media_source}</h3>
                      <p className="text-gray-600 text-sm">{show.scenario}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              uiStatus !== "Error" && <div className="text-center text-gray-400 pt-8">Your personalized recommendations will appear here.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}