// src/app/providers.jsx

"use client"; // This is a Client Component

import { VoiceProvider } from "@humeai/voice-react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_DAYLIST_API || "http://localhost:8000";

const fetchHumeConfig = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/hume-config`);
    // The SDK's auth function expects a return object with an 'accessToken'
    // We will use the clientSecret from your backend as this token.
    return {
      accessToken: res.data.clientSecret,
      apiKey: res.data.apiKey,
      configId: res.data.configId,
    };
  } catch (error) {
    console.error("Error fetching Hume config:", error);
    throw new Error("Could not retrieve Hume configuration from your server.");
  }
};

export function HumeProviders({ children }) {
  return (
    <VoiceProvider auth={{ type: "custom", getClientToken: fetchHumeConfig }}>
      {children}
    </VoiceProvider>
  );
}