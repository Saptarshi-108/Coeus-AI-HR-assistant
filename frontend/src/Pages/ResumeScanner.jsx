import React, { useState } from "react";
import axios from "axios";
import JSZip from "jszip";

const ResumeScanner = () => {
  const [jdFile, setJdFile] = useState(null);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [criteria, setCriteria] = useState({});
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [biasSummary, setBiasSummary] = useState(null);
  const [biasStats, setBiasStats] = useState([]);
  const [rankedJsonFile, setRankedJsonFile] = useState(null);

  const RESUME_SCANNER_API_URL = import.meta.env.VITE_RESUME_SCANNER_API_URL;

  const handleJDChange = (e) => setJdFile(e.target.files[0]);
  const handleResumeChange = (e) => setResumeFiles(Array.from(e.target.files));

  const handleAddTopic = () => {
    const trimmed = newTopic.trim();
    if (!trimmed || topics.includes(trimmed) || topics.length >= 5) return;
    setTopics((prev) => [...prev, trimmed]);
    setCriteria((prev) => ({ ...prev, [trimmed]: 20 }));
    setNewTopic("");
  };

  const handleSliderChange = (topic, value) => {
    setCriteria((prev) => ({
      ...prev,
      [topic]: parseInt(value),
    }));
  };

  const handleRemoveTopic = (topic) => {
    setTopics((prev) => prev.filter((t) => t !== topic));
    setCriteria((prev) => {
      const updated = { ...prev };
      delete updated[topic];
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setBiasSummary(null);
    setBiasStats([]);
    setRankedJsonFile(null);

    if (!jdFile || resumeFiles.length === 0 || topics.length === 0) {
      setError(
        "Please upload JD, Resumes, and enter at least one evaluation topic."
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("jd_file", jdFile);
    resumeFiles.forEach((file) => formData.append("resumes", file));
    const criteriaBlob = new Blob([JSON.stringify(criteria)], {
      type: "application/json",
    });
    formData.append("criteria_file", criteriaBlob, "criteria.json");

    try {
      const response = await axios.post(
        `${RESUME_SCANNER_API_URL}/rank/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const zip = await JSZip.loadAsync(blob);
      const jsonFile = await zip.file("ranked_resumes.json").async("string");
      setRankedJsonFile(jsonFile); // Save for bias analyzer

      // Trigger ZIP download
      const zipUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = "ranked_output.zip";
      a.click();
      window.URL.revokeObjectURL(zipUrl);

      setMessage("Ranking complete! ZIP downloaded.");
    } catch (err) {
      console.error("Error ranking resumes:", err);
      try {
        const errorText = await err.response.data.text();
        const parsed = JSON.parse(errorText);
        setError(`Error: ${parsed.error || parsed.detail || "Unknown error"}`);
      } catch {
        setError(
          "Failed to rank resumes. Server might be down or unreachable."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const runBiasAnalyzer = async () => {
    if (!rankedJsonFile) {
      setError("Please run resume ranking first.");
      return;
    }

    try {
      const blob = new Blob([rankedJsonFile], {
        type: "application/json",
      });
      const formData = new FormData();
      formData.append("json_file", blob, "ranked_resumes.json");

      const res = await axios.post(`${RESUME_SCANNER_API_URL}/bias/`, formData);

      setBiasSummary(res.data.bias_summary || null);
      setBiasStats(res.data.grouped_stats || []);
      setMessage("Bias analysis completed.");
    } catch (err) {
      console.error("Bias analysis error:", err);
      setError("Failed to analyze bias.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white pb-10">
      <div className="container mx-auto p-8 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
          Coeus Resume Scanner
        </h1>
        <p className="text-center text-lg mb-8 text-gray-700 dark:text-gray-300">
          Upload a Job Description, multiple resumes, and set your own custom
          evaluation criteria.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6"
        >
          {/* JD Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Job Description (PDF/TXT)
            </label>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleJDChange}
              className="block w-full text-sm text-gray-500 file:mr-5 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-800 file:cursor-pointer transition-all duration-200 ease-in-out dark:file:bg-blue-500 dark:hover:file:bg-blue-700"
            />
          </div>

          {/* Resume Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Resume Files (PDF/TXT/ZIP)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.txt,.zip"
              onChange={handleResumeChange}
              className="block w-full text-sm text-gray-500 file:mr-5 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-800 file:cursor-pointer transition-all duration-200 ease-in-out dark:file:bg-blue-500 dark:hover:file:bg-blue-700"
            />
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Evaluation Criteria (Max 5 Topics)
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="flex-grow border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Enter topic name (e.g., Communication)"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={!newTopic.trim() || topics.length >= 5}
              >
                Add
              </button>
            </div>

            {topics.map((topic) => (
              <div key={topic} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="capitalize font-medium">
                    {topic}: {criteria[topic]}%
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(topic)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criteria[topic]}
                  onChange={(e) => handleSliderChange(topic, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            {loading ? "Processing..." : "Rank Resumes"}
          </button>

          {/* Bias Analyzer Button */}
          {rankedJsonFile && (
            <button
              type="button"
              onClick={runBiasAnalyzer}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              Run Bias Analyzer
            </button>
          )}

          {message && <div className="mt-4 text-green-600">{message}</div>}
          {error && <div className="mt-4 text-red-600">{error}</div>}
        </form>

        {/* Bias Report Output */}
        {biasSummary && (
          <div className="max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">
              Bias Summary
            </h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200">
              {biasSummary.replace(/\*/g, "")}
            </pre>
            <h3 className="text-lg font-medium mt-6 mb-2 text-purple-600">
              Grouped Stats
            </h3>
            <div className="overflow-x-auto text-sm">
              <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    {Object.keys(biasStats[0] || {}).map((col) => (
                      <th key={col} className="border px-3 py-2">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {biasStats.map((row, idx) => (
                    <tr key={idx} className="border-t">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="border px-3 py-2">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeScanner;
