import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_URL);

function App() {
  const [roomId, setRoomId] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
    return () => socket.off("receive_message");
  }, []);

  const joinRoom = () => {
    if (roomId !== '') {
      socket.emit("join_room", roomId);
      setInRoom(true);
    }
  };

  const sendMessage = () => {
    if (message !== '') {
      socket.emit("send_message", { roomId, message });
      setMessage('');
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!inRoom ? (
        <>
          <h2>Join a Chat Room</h2>
          <input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join</button>
        </>
      ) : (
        <>
          <h2>Room: {roomId}</h2>
          <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "auto", padding: "10px", marginBottom: "10px" }}>
            {chat.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
          <input
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
    </div>
  );
}

export default App;
