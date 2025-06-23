"use client";
import { useState } from "react";
import axios from "axios";
import { Search, User, Users, Film, Music, Sparkles } from "lucide-react";
export default function UserSearch() {
    const [username, setUsername] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [blendResult, setBlendResult] = useState(null);
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
            console.log("User Response:", result.picture);
            const blendUrl = process.env.NEXT_PUBLIC_ARCHTYPE_API;
            const blendResponse = await axios.get(`${blendUrl}/blend/${response.data.user_id}/${result.user_id}`)
            setBlendResult(blendResponse.data);
            console.log("Blend Response:", blendResponse.data);
        }catch (error) {
            console.log("Error during click action:", error);
        }
    }
 const getCurrentBackground = () => {
        const currentHour = new Date().getHours();
        if (currentHour >= 0 && currentHour < 4) {
            return "from-indigo-900 via-purple-900 to-pink-900"; // Early morning
        } else if (currentHour >= 4 && currentHour < 12) {
            return "from-orange-400 via-pink-400 to-red-400"; // Morning
        } else if (currentHour >= 12 && currentHour < 17) {
            return "from-blue-400 via-cyan-400 to-teal-400"; // Afternoon
        } else if (currentHour >= 17 && currentHour < 21) {
            return "from-purple-500 via-pink-500 to-red-500"; // Evening
        } else {
            return "from-gray-800 via-gray-900 to-black"; // Night
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute inset-0 bg-gradient-to-br ${getCurrentBackground()} opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-lg mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
                        Find Your Mix
                    </h1>
                    <p className="text-white/80 text-lg">
                        Discover shared tastes and get personalized recommendations
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                    Searching...
                                </div>
                            ) : (
                                "Search"
                            )}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-xl p-4 mb-6">
                        <div className="flex items-center text-red-100">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                            {error}
                        </div>
                    </div>
                )}

                {/* User Result */}
                {result && (
                    <button 
                        className="w-full bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl group"
                        onClick={handleClick}
                    >
                        <div className="flex flex-col items-center text-center">
                            {result.picture && (
                                <div className="relative mb-4">
                                    <img
                                        src={result.picture}
                                        alt="User"
                                        className="w-20 h-20 rounded-full object-cover border-4 border-white/20 group-hover:border-white/40 transition-all duration-300"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <User className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                            )}
                            <div className="font-semibold text-xl mb-1 text-white">
                                {result.name || 'No Name'}
                            </div>
                            <div className="text-white/70 text-base">
                                {result.email || 'No Email'}
                            </div>
                            <div className="mt-3 text-white/60 text-sm">
                                Tap to create your mix
                            </div>
                        </div>
                    </button>
                )}

                {/* Blend Result */}
                {blendResult && (
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-800">
                                Mix: {user?user.name:'User Name Loading...'} × {result? result.name : 'User Name Loading...'}
                            </h2>
                        </div>

                        {/* Shared Genres */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Music className="w-5 h-5 text-indigo-600" />
                                <div className="font-semibold text-gray-800">Shared Genres:</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {blendResult.shared_genres.map((genre, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200 hover:bg-indigo-200 transition-colors duration-200"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Shared Archetypes */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-5 h-5 text-purple-600" />
                                <div className="font-semibold text-gray-800">Shared Archetypes:</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {blendResult.shared_archetypes.map((arch, idx) => (
                                    <span 
                                        key={arch.id} 
                                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200 hover:bg-purple-200 transition-colors duration-200 cursor-help" 
                                        title={arch.description}
                                    >
                                        {arch.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Shared Media Sources */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <div className="font-semibold text-gray-800">Shared Media Sources:</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {blendResult.shared_media_sources.map((src, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200 hover:bg-emerald-200 transition-colors duration-200"
                                    >
                                        {src}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recommended Movies */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Film className="w-5 h-5 text-indigo-600" />
                                <div className="font-semibold text-gray-800">Recommended for You:</div>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {blendResult.recommended_movies.map((movie, idx) => (
                                    <div 
                                        key={idx} 
                                        className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-indigo-100"
                                    >
                                        <div className="font-bold text-indigo-800 text-lg mb-1">
                                            {movie.media_source}
                                        </div>
                                        <div className="text-sm text-gray-600 flex items-center gap-2">
                                            <span className="px-2 py-1 bg-white/70 rounded-md text-xs font-medium">
                                                {movie.genre}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="px-2 py-1 bg-white/70 rounded-md text-xs font-medium">
                                                {movie.media_type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
