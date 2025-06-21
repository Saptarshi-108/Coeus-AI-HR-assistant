// src/Pages/PolicyBotOnly.jsx
import React from "react";
import ChatPage from "./ChatPage";
import { useSearchParams, useNavigate } from "react-router-dom";

const PolicyBotOnly = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
        <p className="text-gray-300 mb-6">
          No valid token provided. Please contact the company for a valid access token.
        </p>
        <button
          onClick={() => navigate("/candidate")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Back to Token Entry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full max-w-4xl p-4">
        <ChatPage />
      </div>
    </div>
  );
};

export default PolicyBotOnly;