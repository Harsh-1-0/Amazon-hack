"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";

import bg0 from "../../images/fluxBg/bg0.png";
import bg1 from "../../images/fluxBg/bg1.png";
import bg2 from "../../images/fluxBg/bg2.png";
import bg3 from "../../images/fluxBg/bg3.png";
import bg4 from "../../images/fluxBg/bg4.png";

import flux from "../../images/flux.png";
import axios from "axios";
import { get } from "http";

export default function FluxPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [transitionDone, setTransitionDone] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Good Evening!!");
  const [dayList, setDayList] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CHAT_SERVER}/user`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUser(response.data);
        // const audioBlob = localStorage.getItem("audio_mood_blob");
        // let formData = new FormData();
        // if (audioBlob) {
        //   // Convert base64 or blob URL to Blob if needed
        //   let blob;
        //   if (audioBlob.startsWith("data:")) {
        //     // base64 data URL
        //     const arr = audioBlob.split(",");
        //     const mime = arr[0].match(/:(.*?);/)[1];
        //     const bstr = atob(arr[1]);
        //     let n = bstr.length;
        //     const u8arr = new Uint8Array(n);
        //     while (n--) {
        //       u8arr[n] = bstr.charCodeAt(n);
        //     }
        //     blob = new Blob([u8arr], { type: mime });
        //   } else {
        //     // If already a blob URL, fetch it
        //     blob = await fetch(audioBlob).then((r) => r.blob());
        //   }
        //   const file = new File([blob], "audio_mood.wav", { type: blob.type });
        //   formData.append("audio", file);
        // }
        // formData.append("user_id", response.data.user_id);;
        
        // // Jahnvi Your API endpoint and call and i am storing the response in dayList state variable
        // const response2 = await axios.post("URL_TO_GET_DAY_LIST", formData);
        // if (response2.data && response2.data.length > 0) {
        //   setDayList(response2.data);
        //   console.log("Day list data fetched:", response2.data);
        // } else {
        //   console.log("No day list data found");
        // }
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };
    getUser();
  });

  
  const getCurrentBackground = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 4) {
      return bg4; // Early morning
    } else if (currentHour >= 4 && currentHour < 12) {
      setMessage("Good Morning!!");
      return bg0; // Morning
    } else if (currentHour >= 12 && currentHour < 17) {
      setMessage("Good Afternoon!!");
      return bg1; // Afternoon
    } else if (currentHour >= 17 && currentHour < 21) {
      return bg2; // Evening
    } else return bg3;
    // Night
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-sans">
      {/* Background fade-in */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getCurrentBackground()}
          alt="bg"
          fill
          style={{
            objectFit: "cover",
            opacity: 0.6,
            filter: "blur(2px) brightness(0.8)",
          }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      {/* Centered Flux image and Welcome message */}
      <div
        className={`absolute left-1/2 top-1/2 z-10 flex flex-col items-center justify-center transition-all duration-700 ${
          transitionDone
            ? "-translate-x-1/2 scale-50 top-10 left-1/2"
            : "-translate-x-1/2 -translate-y-1/2 scale-100"
        }`}
        style={{
          pointerEvents: "none",
          transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className=" p-4 ">
          <Image
            src={flux}
            alt="Flux Logo"
            width={transitionDone ? 180 : 260}
            height={transitionDone ? 180 : 260}
            className="transition-all duration-700 drop-shadow-2xl"
            style={{
              transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
        <div
          className={`mt-8 text-4xl font-extrabold text-white text-center tracking-tight transition-opacity duration-700 ${
            showWelcome ? "opacity-100" : "opacity-0"
          } ${transitionDone ? "text-5xl mt-4" : ""}`}
          style={{
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            transition:
              "opacity 0.7s cubic-bezier(0.4,0,0.2,1), font-size 0.7s cubic-bezier(0.4,0,0.2,1), margin-top 0.7s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {transitionDone ? (
            <span className=" ">Made for you by you</span>
          ) : (
            "Welcome to Flux"
          )}
        </div>
      </div>
      {/* Panel uncovering from bottom */}
      <div
        className={`absolute left-0 bottom-0 w-full bg-white/90 backdrop-blur-xl rounded-t-3xl shadow-2xl z-20 transition-transform duration-700 ${
          transitionDone ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ minHeight: "60vh" }}
      >
        <div className="px-8 py-10">
          <div className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span role="img" aria-label="wave">
              👋
            </span>
            {message}
            {user && user.name ? (
              <span className="ml-2 font-bold text-blue-600">{user.name}</span>
            ) : (
              ""
            )}
          </div>
          <div className="text-lg text-gray-600 mb-6">
            This is what <span className="font-bold text-purple-500">Flux</span>{" "}
            suggests for you based on your{" "}
            <span className="font-semibold text-blue-500">archetype</span>,{" "}
            <span className="font-semibold text-yellow-500">
              time of the day
            </span>{" "}
            and your{" "}
            <span className="font-semibold text-pink-500">emotion</span>.
          </div>
          {/* You can put your main content here after transition */}
          <div className="mt-8">
            {/* Placeholder for main content */}
            <div className="h-32 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-xl shadow-inner flex items-center justify-center text-gray-400 text-xl">
              Your personalized recommendations will appear here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
