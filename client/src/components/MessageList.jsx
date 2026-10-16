import { useEffect, useRef } from 'react';

const time = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function MessageList({ messages, meId, typing }) {
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  return (
    <div className="messages">
      {messages.length === 0 && <p className="empty">No messages yet. Say hello.</p>}
      {messages.map((m) => (
        <div key={m._id} className={m.sender === meId ? 'bubble mine' : 'bubble theirs'}>
          <p>{m.text}</p>
          <time>{time(m.createdAt)}</time>
        </div>
      ))}
      {typing && <p className="typing">typing…</p>}
      <div ref={end} />
    </div>
  );
}
