import React, { useState } from 'react';
import axios from 'axios';

const ChatBot = ({ company, token }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hi! Ask anything about ${company}'s policy.` },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/ask-policy`, {
        question: input,
        company,
        token,
      });
      setMessages((prev) => [...prev, { from: 'bot', text: res.data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { from: 'bot', text: "Error. Please try again." }]);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>{company} Policy Chat</h2>
      <div style={{ height: 300, overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left' }}>
            <p><strong>{msg.from === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Ask your question..."
        style={{ width: '80%', padding: 10 }}
      />
      <button onClick={sendMessage} style={{ padding: 10 }}>Send</button>
    </div>
  );
};

export default ChatBot;
