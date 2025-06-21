// src/pages/CandidateAccessPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../api/poliybot";

const CandidateAccessPage = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleValidate = async () => {
    if (!token.trim()) return setError("Please enter a token.");

    setLoading(true);
    try {
      const res = await validateToken(token.trim());
      if (res.valid) navigate(`/chat?token=${token}`);
      else setError("❌ Invalid token. Please check and try again.");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full p-6 bg-gray-100 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Access Company Policy</h2>
        <input
          type="text"
          placeholder="Enter Access Token"
          className="w-full border p-2 rounded mb-3"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setError("");
          }}
        />
        <button
          onClick={handleValidate}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Enter Chat"}
        </button>
        {error && <p className="text-red-600 mt-3 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
};

export default CandidateAccessPage;
