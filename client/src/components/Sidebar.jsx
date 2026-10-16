export default function Sidebar({ me, users, online, active, unread, onSelect, onLogout }) {
  return (
    <aside className="sidebar">
      <header>
        <div>
          <strong>{me.username}</strong>
          <small>{me.email}</small>
        </div>
        <button className="link light" onClick={onLogout}>Log out</button>
      </header>
      <ul>
        {users.length === 0 && <li className="empty">No one else has joined yet. Register a second account to start chatting.</li>}
        {users.map((u) => (
          <li key={u._id}>
            <button className={active?._id === u._id ? 'contact active' : 'contact'} onClick={() => onSelect(u)}>
              <span className={online.has(u._id) ? 'dot on' : 'dot'} aria-label={online.has(u._id) ? 'Online' : 'Offline'} />
              <span className="name">{u.username}</span>
              {unread[u._id] > 0 && <span className="badge">{unread[u._id]}</span>}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
