// src/pages/HrUploadPage.jsx
import React, { useState } from "react";
import { uploadPolicy } from "../api/poliybot";

const HrUploadPage = () => {
  const [companyName, setCompanyName] = useState("");
  const [file, setFile] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file || !companyName.trim()) {
      setError("Please enter company name and upload a PDF file.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await uploadPolicy(companyName.trim(), file);
      setToken(result.token);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Upload HR Policy
        </h2>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Enter Company Name"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <label
            htmlFor="pdf-upload"
            className={`cursor-pointer block w-full border-2 border-dashed border-blue-400 rounded-lg py-8 text-center text-gray-500 hover:bg-blue-50 transition ${
              file ? "border-solid border-green-500 bg-green-50" : ""
            }`}
          >
            {file ? (
              <div>
                <p className="text-green-700 font-medium">📄 {file.name}</p>
                <p className="text-sm text-gray-500 mt-1">Click to change</p>
              </div>
            ) : (
              <div>
                <p className="text-2xl">📎</p>
                <p className="mt-2">Click to select your PDF</p>
              </div>
            )}
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
          >
            {loading ? "Uploading..." : "Upload PDF"}
          </button>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
        </div>

        {token && (
          <div className="mt-8 bg-green-100 border border-green-500 p-5 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-1">
              ✅ Upload Successful!
            </h3>
            <p className="text-sm text-gray-700">Candidate Token:</p>
            <div className="mt-2 font-mono text-lg bg-white p-2 border rounded shadow inline-block">
              {token}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Share this token with your candidates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HrUploadPage;
