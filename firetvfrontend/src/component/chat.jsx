"use client";
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Virtual Keyboard Component
const VirtualKeyboard = ({ onKeyPress, onBackspace, onSpace, onEnter, isVisible }) => {
  const keys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  const [isShift, setIsShift] = useState(false);

  const handleKeyPress = (key) => {
    const finalKey = isShift ? key.toUpperCase() : key;
    onKeyPress(finalKey);
  };

  const handleShift = () => {
    setIsShift(!isShift);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t-2 border-gray-600 z-50 animate-slide-up">
      <div className="max-w-2xl mx-auto">
        {/* Number row */}
        <div className="flex justify-center mb-2 gap-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
            <button
              key={num}
              onClick={() => onKeyPress(num)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Letter rows */}
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-2 gap-1">
            {rowIndex === 2 && (
              <button
                onClick={handleShift}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors mr-1 ${
                  isShift 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                ⇧
              </button>
            )}
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
              >
                {isShift ? key.toUpperCase() : key}
              </button>
            ))}
            {rowIndex === 2 && (
              <button
                onClick={onBackspace}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors ml-1"
              >
                ⌫
              </button>
            )}
          </div>
        ))}

        {/* Bottom row with space and enter */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onKeyPress(',')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            ,
          </button>
          <button
            onClick={onSpace}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-2 rounded text-sm font-medium transition-colors"
          >
            Space
          </button>
          <button
            onClick={() => onKeyPress('.')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            .
          </button>
          <button
            onClick={onEnter}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const socketRef = useRef();
  const [movie, setMovie] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    // Using in-memory storage instead of localStorage
    setMovie(window.movieName || '');
    console.log("Connecting to chat server at", process.env.NEXT_PUBLIC_CHAT_SERVER);
    socketRef.current = io(process.env.NEXT_PUBLIC_CHAT_SERVER);
    console.log("Connected to chat server", socketRef.current.id);
    
    socketRef.current.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      socketRef.current.emit('message', { "movie_name": movie, "message": input });
      setInput('');
    }
  };

  const handleInputFocus = () => {
    setIsKeyboardVisible(true);
  };

  const handleInputBlur = () => {
    // Delay hiding keyboard to allow button clicks
    setTimeout(() => {
      setIsKeyboardVisible(false);
    }, 150);
  };

  const handleVirtualKeyPress = (key) => {
    setInput(prev => prev + key);
    inputRef.current?.focus();
  };

  const handleVirtualBackspace = () => {
    setInput(prev => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const handleVirtualSpace = () => {
    setInput(prev => prev + ' ');
    inputRef.current?.focus();
  };

  const handleVirtualEnter = () => {
    if (input.trim()) {
      socketRef.current.emit('message', { "movie_name": movie, "message": input });
      setInput('');
    }
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Real-time Chat</h1>
          {movie && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm inline-block">
              🎬 {movie}
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className={`max-w-4xl mx-auto p-4 transition-all duration-300 ${isKeyboardVisible ? 'pb-80' : 'pb-24'}`}>
        <div className="bg-white rounded-lg shadow-sm border min-h-96 max-h-96 overflow-y-auto p-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-gray-800">{msg.message}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input Form */}
        <form onSubmit={sendMessage} className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Send
            </button>
          </div>
          
          {/* Virtual Keyboard Toggle */}
          <div className="mt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setIsKeyboardVisible(!isKeyboardVisible)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              ⌨️ {isKeyboardVisible ? 'Hide' : 'Show'} Virtual Keyboard
            </button>
            <span className="text-xs text-gray-500">
              {input.length} characters
            </span>
          </div>
        </form>
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        isVisible={isKeyboardVisible}
        onKeyPress={handleVirtualKeyPress}
        onBackspace={handleVirtualBackspace}
        onSpace={handleVirtualSpace}
        onEnter={handleVirtualEnter}
      />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}