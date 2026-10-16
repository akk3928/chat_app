import { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

export default function Chat() {
  const { user, token, logout } = useAuth();
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const [online, setOnline] = useState(new Set());
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState({});
  const [typingFrom, setTypingFrom] = useState(null);
  const activeRef = useRef(null);
  activeRef.current = active;

  useEffect(() => {
    api('/api/users', { token }).then(setUsers).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    const onOnline = (ids) => setOnline(new Set(ids));
    const onMessage = (msg) => {
      const other = msg.sender === user._id ? msg.receiver : msg.sender;
      if (activeRef.current?._id === other) {
        setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
      } else if (msg.sender !== user._id) {
        setUnread((u) => ({ ...u, [other]: (u[other] || 0) + 1 }));
      }
    };
    const onTyping = ({ from }) => setTypingFrom(from);
    const onStop = ({ from }) => setTypingFrom((cur) => (cur === from ? null : cur));

    socket.on('online_users', onOnline);
    socket.on('receive_message', onMessage);
    socket.on('typing', onTyping);
    socket.on('stop_typing', onStop);
    return () => {
      socket.off('online_users', onOnline);
      socket.off('receive_message', onMessage);
      socket.off('typing', onTyping);
      socket.off('stop_typing', onStop);
    };
  }, [socket, user._id]);

  async function select(u) {
    setActive(u);
    setMessages([]);
    setTypingFrom(null);
    setUnread((x) => ({ ...x, [u._id]: 0 }));
    try {
      setMessages(await api(`/api/messages/${u._id}`, { token }));
    } catch {}
  }

  const send = (text) => socket?.emit('send_message', { to: active._id, text });

  return (
    <div className="shell">
      <Sidebar me={user} users={users} online={online} active={active} unread={unread} onSelect={select} onLogout={logout} />
      <section className="pane">
        {active ? (
          <>
            <header className="pane-head">
              <strong>{active.username}</strong>
              <small>{online.has(active._id) ? 'Online' : 'Offline'}</small>
            </header>
            <MessageList messages={messages} meId={user._id} typing={typingFrom === active._id} />
            <MessageInput
              onSend={send}
              onTyping={() => socket?.emit('typing', { to: active._id })}
              onStopTyping={() => socket?.emit('stop_typing', { to: active._id })}
            />
          </>
        ) : (
          <p className="empty center">Pick someone from the list to start a conversation.</p>
        )}
      </section>
    </div>
  );
}
