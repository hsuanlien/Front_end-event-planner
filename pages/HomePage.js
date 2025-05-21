import React, { useState } from 'react';

function HomePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
    }
  };

  return (
    <div>
      <h2>Welcome to Event Planner Chat</h2>
      <div style={{ border: '1px solid gray', padding: '10px', height: '200px', overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.sender}:</strong> {msg.text}</div>
        ))}
      </div>
      <input
        placeholder="Type a message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default HomePage;
