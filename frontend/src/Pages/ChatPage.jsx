import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { askPolicyQuestion } from "../api/poliybot";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const newChat = [...chat, { from: "user", text: question.trim() }];
    setChat(newChat);
    setLoading(true);
    setQuestion("");

    const res = await askPolicyQuestion(question.trim(), token);
    setChat([...newChat, { from: "bot", text: res.answer }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 flex flex-col justify-between min-h-[70vh]">
        <h2 className="text-2xl font-bold text-center mb-4">Policy Assistant 🤖</h2>

        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-black ${
                  msg.from === "user" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-black px-4 py-2 rounded-lg text-sm animate-pulse">
                Typing...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none"
            placeholder="Ask a policy-related question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
          />
          <button
            onClick={sendQuestion}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
