"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "./grid";
import Buttons from "./buttons";
import Otts from "./otts";

function Popup({ message, onClose }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl bg-blur-xl p-6 max-w-sm w-full text-center space-y-4">
        <p className="text-slate-800">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function Landing() {
  const [user, setUser] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");

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
        console.log(
          "User data fetched:",
          response.data.archetypes[response.data.archetypes.length - 1].name
        );
        setUser(response.data);
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };
    getUser();
  }, []);

  const currentGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning!!";
    else if (hours < 18) return "Good Afternoon!!";
    return "Good Evening!!";
  };

  return (
    <div className="h-screen w-screen bg-cover background-image flex flex-col justify-between items-center">
      <div className="h-1/3 w-full flex justify-end px-5">
        <div>
          <div className="flex flex-col items-end space-y-3 rounded-xl shadow-lg p-6 backdrop-blur-sm">
            {/* Greeting */}
            <div className="text-2xl font-bold text-slate-800 tracking-wide">
              {currentGreeting()}
            </div>

            {/* User Name */}
            <div className="text-xl font-semibold text-slate-700 flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>{user ? user.name : "Guest"}</span>
            </div>

            {/* Archetype */}
            <div className="text-base text-slate-600 flex items-center space-x-2">
              <span className="text-sm text-slate-500">You are a</span>
              <span
                className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full font-medium text-sm border border-indigo-200 cursor-pointer"
                onClick={() => {
                  if (user && user.archetypes && user.archetypes.length > 0) {
                    setPopupMessage(
                      user.archetypes[user.archetypes.length - 1].description
                    );
                  } else {
                    setPopupMessage("Explorer");
                  }
                }}
                title="Click to see description"
              >
                {user
                  ? user.archetypes[user.archetypes.length - 1].name
                  : "Explorer"}
              </span>
            </div>

            {/* Decorative elements */}
            <div className="flex space-x-1 mt-2">
              <div className="w-1 h-1 bg-indigo-300 rounded-full opacity-60"></div>
              <div className="w-1 h-1 bg-purple-300 rounded-full opacity-40"></div>
              <div className="w-1 h-1 bg-emerald-300 rounded-full opacity-80"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-2/3 w-full backdrop-blur-lg items-center justify-center px-5">
        <div className="p-3 flex justify-between items-center w-full">
          <Buttons url={user ? user.picture : ""} />
          <Otts />
        </div>
        <Grid />
      </div>

      {/* Popup Component */}
      {popupMessage && (
        <Popup  message={popupMessage} onClose={() => setPopupMessage("")} />
      )}
    </div>
  );
}
