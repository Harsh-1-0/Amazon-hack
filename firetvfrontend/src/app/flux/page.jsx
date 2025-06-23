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

const BACKEND_URL = process.env.NEXT_PUBLIC_DAYLIST_API || "http://localhost:8000";

export default function FluxPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [transitionDone, setTransitionDone] = useState(false);
  const [message, setMessage] = useState("Hello!");
  const [userIdInput, setUserIdInput] = useState("");
  
  const { connect, disconnect, status, messages, error: humeError } = useVoice();
  const [uiStatus, setUiStatus] = useState("Ready");
  const [dayList, setDayList] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const welcomeTimer = setTimeout(() => setShowWelcome(true), 500);
    const transitionTimer = setTimeout(() => setTransitionDone(true), 2500);
    const currentHour = new Date().getHours();
    if (currentHour >= 4 && currentHour < 12) setMessage("Hello!");
    else if (currentHour >= 12 && currentHour < 17) setMessage("Hello!");
    return () => { clearTimeout(welcomeTimer); clearTimeout(transitionTimer); };
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
    if (!userIdInput) {
      setError("Please enter a User ID first.");
      return;
    }
    setError(null);
    setDayList(null);
    setUiStatus("Connecting...");
    
    // The connect() function is now simpler. It automatically uses the
    // auth and config provided by the <VoiceProvider> in your layout.
    connect().catch((err) => {
        console.error("Hume Connection Error:", err);
        setError("A connection error occurred with the voice interface.");
        setUiStatus("Error");
    });
  }, [connect, userIdInput]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.type === 'user_message' && lastMessage.models.prosody) {
      const scores = lastMessage.models.prosody.scores;
      const topEmotion = Object.entries(scores).reduce(
        (top, [emotion, score]) => (score > top.score ? { emotion, score } : top),
        { emotion: "neutral", score: 0 }
      );

      disconnect();
      fetchDaylist(userIdInput, topEmotion.emotion);
    }
  }, [messages, disconnect, fetchDaylist, userIdInput]);
  
  useEffect(() => {
    if (humeError) {
      setError("An error occurred with the Hume Voice SDK. Please check credentials and server connection.");
      setUiStatus("Error");
      console.error("Hume SDK Error:", humeError);
    } else if (status.value === 'disconnected' && uiStatus === 'Listening...') {
      setUiStatus("Ready");
    }
  }, [humeError, status, uiStatus]);


  const getCurrentBackground = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 4) return bg4;
    if (currentHour >= 4 && currentHour < 12) return bg0;
    if (currentHour >= 12 && currentHour < 17) return bg1;
    if (currentHour >= 17 && currentHour < 21) return bg2;
    return bg3;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <Image src={getCurrentBackground()} alt="bg" fill style={{ objectFit: "cover", opacity: 0.6, filter: "blur(2px) brightness(0.8)" }} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      <div className={`absolute left-1/2 top-1/2 z-10 flex flex-col items-center justify-center transition-all duration-700 ${transitionDone ? "-translate-x-1/2 scale-50 top-10 left-1/2" : "-translate-x-1/2 -translate-y-1/2 scale-100"}`} style={{ pointerEvents: "none", transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)" }}>
        <div className="p-4 "><Image src={flux} alt="Flux Logo" width={transitionDone ? 180 : 260} height={transitionDone ? 180 : 260} className="transition-all duration-700 drop-shadow-2xl" style={{ transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)" }} /></div>
        <div className={`mt-8 text-4xl font-extrabold text-white text-center tracking-tight transition-opacity duration-700 ${showWelcome ? "opacity-100" : "opacity-0"} ${transitionDone ? "text-5xl mt-4" : ""}`} style={{ textShadow: "0 4px 24px rgba(0,0,0,0.5)", transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), font-size 0.7s cubic-bezier(0.4,0,0.2,1), margin-top 0.7s cubic-bezier(0.4,0,0.2,1)" }}>
          {transitionDone ? <span className=" ">Made for you by you</span> : "Welcome to Flux"}
        </div>
      </div>
      
      <div className={`absolute left-0 bottom-0 w-full bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl z-20 transition-transform duration-700 ${transitionDone ? "translate-y-0" : "translate-y-full"}`} style={{ minHeight: "60vh" }}>
        <div className="px-8 py-10">
          <div className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            {message}
          </div>
          <div className="text-lg text-gray-600 mb-6">
            This is what <span className="font-bold text-purple-500">Flux</span> suggests for you based on your <span className="font-semibold text-blue-500">archetype</span>, <span className="font-semibold text-yellow-500">time of the day</span> and your <span className="font-semibold text-pink-500">emotion</span>.
          </div>
          
          <div className="mt-8 mb-6">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">Enter Your User ID</label>
            <input
              type="text"
              id="userId"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="e.g., user123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleStartConversation}
              disabled={status.value !== "disconnected" || !userIdInput}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-400 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg"
            >
              {status.value === "disconnected" ? "🎙️ Start My Daylist" : "Listening..."}
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