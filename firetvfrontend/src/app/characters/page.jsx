"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Characters() {
    const [allCharacters, setAllCharacters] = useState({});
    const [selectedMovie, setSelectedMovie] = useState("");
    const [search, setSearch] = useState("");
    const [selectedCharacters, setSelectedCharacters] = useState([]);

    useEffect(() => {
        const getAllCharacters = async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_ARCHTYPE_API;
                const response = await axios.get(`${backendUrl}/media/characters_grouped`);
                if (response.status === 200) {
                    setAllCharacters(response.data);
                }
            } catch (error) {
                console.log("Error fetching characters:", error);
            }
        };
        getAllCharacters();
    }, []);

    // Get movie names for dropdown
    const movieNames = Object.keys(allCharacters);

    // Filtered characters for selected movie and search
    const filteredCharacters = selectedMovie && allCharacters[selectedMovie]
        ? allCharacters[selectedMovie].characters.filter(char =>
            char.character_name.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    // Add character (max 5)
    const addCharacter = (char) => {
        if (selectedCharacters.length >= 5) return;
        if (!selectedCharacters.some(c => c.character_name === char.character_name && c.movie === selectedMovie)) {
            setSelectedCharacters([...selectedCharacters, { ...char, movie: selectedMovie }]);
        }
    };

    // Remove character
    const removeCharacter = (char) => {
        setSelectedCharacters(selectedCharacters.filter(c =>
            !(c.character_name === char.character_name && c.movie === char.movie)
        ));
    };

    const handleCharacters = async () => {
        try {
            if (selectedCharacters.length === 0) {
                console.log("No characters selected.");
                alert("Please select at least one character before submitting.");
                return;
            }
            const backendUrl = process.env.NEXT_PUBLIC_ARCHTYPE_API;
            console.log("Submitting characters:", selectedCharacters);
            const arr = selectedCharacters.map(char => char.character_name);
            const media_sources = selectedCharacters.map(char => char.media_type);
            const genre = selectedCharacters.map(char => char.genre);
            const response = await axios.post(`${backendUrl}/user/archetype`, {
                character_names: arr,

            })
            console.log(response.data);
            const today = new Date();
            const formatted = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
            console.log(formatted);
            const archetype = {
                id:Math.floor(Math.random() * 1000), 
                name: response.data.archetype_name,
                description: response.data.description,
                date: formatted,
            }
            const token = localStorage.getItem("jwt_token");
            const userResponse = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_SERVER}/user/updateDetails_newUser`, {
                character_names: arr,
                archetypes : archetype,
                media_sources: media_sources,
                genres: genre
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (userResponse.status === 200) {
                console.log("User details updated successfully:", userResponse.data);
                
                setSelectedCharacters([]); // Clear selected characters after submission
            } else {
                console.error("Error updating user details:", userResponse.data);
                alert("Failed to update user details. Please try again.");
            }
        } catch (error) {
            console.log("Error submitting characters:", error);
        }
    }
    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Character Selector</h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full"></div>
                </div>

                {/* Movie Selection */}
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50 shadow-2xl">
                    <label className="block text-white font-semibold mb-4 text-lg">Select Movie</label>
                    <select
                        value={selectedMovie}
                        onChange={e => setSelectedMovie(e.target.value)}
                        className="w-full bg-slate-700/80 text-white border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    >
                        <option value="">-- Choose a movie --</option>
                        {movieNames.map(movie => (
                            <option key={movie} value={movie} className="bg-slate-700">{movie}</option>
                        ))}
                    </select>
                </div>

                {/* Search */}
                {selectedMovie && (
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50 shadow-2xl">
                        <label className="block text-white font-semibold mb-4 text-lg">Search Characters</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search character..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-slate-700/80 text-white border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 pr-10"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                                🔍
                            </div>
                        </div>
                    </div>
                )}

                {/* Character List */}
                {selectedMovie && (
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6">Characters in {selectedMovie}</h3>
                        <div className="space-y-4">
                            {filteredCharacters.map(char => (
                                <div key={char.character_name} className="bg-slate-700/50 rounded-xl p-6 hover:bg-slate-700/70 transition-all duration-200 border border-slate-600/30">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-white mb-2">{char.character_name}</h4>
                                            <div className="flex gap-3 mb-3">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                    {char.genre}
                                                </span>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                                    {char.media_type}
                                                </span>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">{char.description}</p>
                                        </div>
                                        <button
                                            onClick={() => addCharacter(char)}
                                            disabled={selectedCharacters.length >= 5 || selectedCharacters.some(c => c.character_name === char.character_name && c.movie === selectedMovie)}
                                            className="ml-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredCharacters.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-slate-400 text-lg">No characters found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Selected Characters */}
                {selectedCharacters.length > 0 && (
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Selected Characters</h3>
                            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                {selectedCharacters.length}/5
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedCharacters.map((char, idx) => (
                                <div key={char.character_name + char.movie + idx} className="bg-gradient-to-br from-slate-700/80 to-slate-600/80 rounded-xl p-6 relative border border-slate-600/50 hover:shadow-lg transition-all duration-200">
                                    <button
                                        onClick={() => removeCharacter(char)}
                                        className="absolute top-3 right-3 w-8 h-8 bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 rounded-full flex items-center justify-center transition-all duration-200 border border-red-500/30"
                                        title="Remove"
                                    >
                                        ×
                                    </button>
                                    <h4 className="text-lg font-bold text-white mb-2 pr-8">{char.character_name}</h4>
                                    <p className="text-slate-400 text-sm mb-3">from {char.movie}</p>
                                    <div className="flex gap-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300">
                                            {char.genre}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-cyan-500/20 text-cyan-300">
                                            {char.media_type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        onClick={handleCharacters}
                        disabled={selectedCharacters.length === 0}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-12 rounded-2xl text-lg transition-all duration-200 disabled:cursor-not-allowed shadow-2xl hover:shadow-cyan-500/25 disabled:shadow-none transform hover:scale-105 disabled:transform-none"
                    >
                        {selectedCharacters.length === 0 ? 'Select Characters First' : 'Submit Selected Characters'}
                    </button>
                </div>
            </div>
        </div>
    );
}