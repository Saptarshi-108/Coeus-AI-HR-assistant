import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios"; // Ensure axios is installed

const InterviewScheduler = () => {
  const [intervieweeId, setIntervieweeId] = useState("");
  const [interviewerEmail, setInterviewerEmail] = useState("");
  const [summary, setSummary] = useState("Interview Scheduled");
  const [description, setDescription] = useState(
    "This is your scheduled interview."
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const INTERVIEW_SCHEDULER_API_URL = import.meta.env
    .VITE_INTERVIEW_SCHEDULER_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!intervieweeId.trim() || !interviewerEmail.trim()) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${INTERVIEW_SCHEDULER_API_URL}/schedule_interview/`,
        {
          interviewee_id: intervieweeId,
          interviewer_email: interviewerEmail,
          summary,
          description,
        }
      );
      setMessage(
        `Success: ${response.data.message}. Interview scheduled for ${new Date(
          response.data.start_time
        ).toLocaleString()}. Google Meet Link: ${
          response.data.google_meet_link
        }`
      );
      setIntervieweeId(""); // Clear form
      setInterviewerEmail("");
    } catch (err) {
      console.error(
        "Error scheduling interview:",
        err.response?.data || err.message
      );
      setError(
        `Error: ${
          err.response?.data?.detail ||
          "Failed to schedule interview. Ensure all backend services are running and configured."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white pb-10">
      <div className="container mx-auto p-8 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
          Automated Interview Scheduler
        </h1>
        <p className="text-center text-lg mb-8 text-gray-700 dark:text-gray-300">
          Effortlessly schedule interviews by providing interviewee and
          interviewer details. The system will find an available slot, create a
          Google Meet link, and send email invitations.
        </p>

        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="intervieweeId"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Interviewee ID
              </label>
              <input
                type="text"
                id="intervieweeId"
                value={intervieweeId}
                onChange={(e) => setIntervieweeId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., candidate123 (must exist in your MongoDB 'interviewees' collection)"
                required
              />
            </div>
            <div>
              <label
                htmlFor="interviewerEmail"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Interviewer Email
              </label>
              <input
                type="email"
                id="interviewerEmail"
                value={interviewerEmail}
                onChange={(e) => setInterviewerEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., interviewer@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="summary"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Event Summary (Optional)
              </label>
              <input
                type="text"
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Senior Software Engineer Interview"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Event Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Discussion on technical skills and previous projects."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              disabled={loading}
            >
              {loading ? "Scheduling Interview..." : "Schedule Interview"}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;
