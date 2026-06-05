function NotificationPanel() {
  const notifications = [];

  return (
    <div className="card notification-card">
      <div className="notification-header">
        <h2>Notifications</h2>
        <div className="count">{notifications.length}</div>
      </div>

    {notifications.length === 0 ? (
      <div className="empty-notification">
        No notifications available
      </div>
    ) : (
      notifications.map((item) => (
      <div
        key={item.id}
        className={`notification-item ${
         item.highlight ? "highlight" : ""
        }`}
      >
        <h4>{item.title}</h4>
        <p>{item.time}</p>
       </div>
     ))
    )}

      <div className="notification-settings">
        <div className="toggle-row">
          <span>Email Notifications</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-row">
          <span>Push Notifications</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default NotificationPanel;