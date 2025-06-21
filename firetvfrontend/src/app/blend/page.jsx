"use client";
import { useState } from "react";
import axios from "axios";

export default function UserSearch() {
    const [username, setUsername] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);
        try {
            // Replace with your actual API endpoint
            const backendUrl = process.env.NEXT_PUBLIC_CHAT_SERVER;
            const token = localStorage.getItem("jwt_token");
            const response = await axios.get(`${backendUrl}/user/search?username=${encodeURIComponent(username.trim())}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setResult(response.data);
        } catch (err) {
            setError("User not found or API error.");
        } finally {
            setLoading(false);
        }
    };

    const handleClick = async (e) => {
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_SERVER}/user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setUser(response.data);
            const blendUrl = process.env.NEXT_PUBLIC_ARCHTYPE_API;
            const blendResponse = await axios.get(`${blendUrl}/blend/${response.data.user_id}/${result.user_id}`)
            console.log("Blend Response:", blendResponse.data);
            

        }catch (error) {
            console.log("Error during click action:", error);
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: "40px auto", padding: 24 }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username"
                    style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '8px 16px', background: '#2d72d9', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            {result && (
                <button className="flex justify-center items-center w-full shadow-md bg-[#f0f4fa] hover:bg-[#666666] transition-all duration-500 " onClick={handleClick}>
                <div className=" rounded-lg p-4 flex flex-col items-center text-center">
                    {result.picture && (
                        <img
                            src={result.picture}
                            alt="User"
                            className="w-20 h-20 rounded-full object-cover mb-3"
                        />
                    )}
                    <div className="font-semibold text-xl mb-1">
                        {result.name || 'No Name'}
                    </div>
                    <div className="text-gray-600 text-base">
                        {result.email || 'No Email'}
                    </div>
                </div>
                </button>   
            )}

        </div>
    );
}
