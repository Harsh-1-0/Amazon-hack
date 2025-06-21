"use client";
import {auth, provider, signInWithPopup} from "../component/firebase";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
export default function Home() {
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const chatServerUrl = process.env.NEXT_PUBLIC_CHAT_SERVER;
      if (!chatServerUrl) {
        throw new Error("Chat server URL is not defined");
      }
      const idToken1 = await result.user.getIdToken();
      const response =await axios.post(`${chatServerUrl}/user`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken1}`,
          },
        }
      );
      localStorage.setItem("jwt_token", response.data.token);
      console.log("User signed in:", response);
      if(response.data.message === "Not a new user"){
        //
      }
      else{
        // 
      }
    } catch (error) {
      alert("Google sign-in failed");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
      <button
        onClick={handleGoogleSignIn}
        style={{
          padding: "12px 24px",
          background: "#000000",
          color: "white",
          border: "none",
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >
        <Image
          src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
          alt="Google Icon"
          width={24}
          height={24}
          />
        Sign in with Google
      </button>
      {/* {user && (
        <div style={{ marginTop: 24, fontSize: 18 }}>
          Welcome, {user.displayName || user.email}!
        </div>
      )} */}
    </div>
  );
}
