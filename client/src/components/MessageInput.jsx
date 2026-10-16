import { useRef, useState } from 'react';

export default function MessageInput({ onSend, onTyping, onStopTyping }) {
  const [text, setText] = useState('');
  const timer = useRef(null);

  function change(e) {
    setText(e.target.value);
    onTyping();
    clearTimeout(timer.current);
    timer.current = setTimeout(onStopTyping, 1200);
  }

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    clearTimeout(timer.current);
    onStopTyping();
    onSend(text.trim());
    setText('');
  }

  return (
    <form className="composer" onSubmit={submit}>
      <input value={text} onChange={change} placeholder="Write a message" maxLength={2000} autoFocus />
      <button className="primary" disabled={!text.trim()}>Send</button>
    </form>
  );
}
