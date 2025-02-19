import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://your-vercel-backend-url.com");

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("https://your-vercel-backend-url.com/messages")
      .then(res => res.json())
      .then(data => setMessages(data));

    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [message, ...prevMessages]);
    });

    return () => socket.off("newMessage");
  }, []);

  return (
    <div>
      <h1>SMS & Notification Tracker</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.sender || "Notification"}</strong>: {msg.body || msg.details}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
