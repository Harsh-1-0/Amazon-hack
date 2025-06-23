"use client";
import { use, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { io } from "socket.io-client";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  useEffect(() => {
    console.log("Connecting to room:", roomId);
    if (!roomId) return;
    const movie_name = localStorage.getItem("movie_name") || "mai hoon na";
    socketRef.current = io("http://localhost:5500", {
      query: { roomId, movie_name },
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to socket server");
      socket.emit("join-room", roomId);
    });

    socket.on("message", (msg) => {
      const text = typeof msg === "string" ? msg : msg?.text || msg?.message;
      if (text) {
        setMessages((prev) => [...prev, { text, self: false }]);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [roomId]);
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socketRef.current.emit("message", {
      roomId,
      data: {
        movie_name: localStorage.getItem("movie_name") || "",
        message: input,
      },
    });
    setMessages((prev) => [...prev, { text: input, self: true }]);
    setInput("");
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 16 }}>
      <h3 style={{ marginBottom: 16 }}>Room: {roomId}</h3>

      <div
        style={{
          maxHeight: 300,
          overflowY: "auto",
          marginBottom: 12,
          border: "1px solid #ccc",
          padding: 8,
          borderRadius: 6,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{ textAlign: msg.self ? "right" : "left", margin: "4px 0" }}
          >
            <span
              style={{
                background: msg.self ? "#2d72d9" : "#eee",
                color: msg.self ? "#fff" : "#000",
                padding: "6px 12px",
                borderRadius: 16,
                display: "inline-block",
                maxWidth: "80%",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#2d72d9",
            color: "#fff",
            border: "none",
            borderRadius: 6,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
