function NotificationPanel() {
  const notifications = [
    {
      id: 1,
      title: "New response received",
      time: "2 min ago",
      highlight: true,
    },
    {
      id: 2,
      title: "Form published successfully",
      time: "1 hr ago",
      highlight: true,
    },
    {
      id: 3,
      title: "Weekly report ready",
      time: "3 hrs ago",
      highlight: true,
    },
    {
      id: 4,
      title: "User Bob left 1★ rating",
      time: "Yesterday",
    },
    {
      id: 5,
      title: "System backup complete",
      time: "Yesterday",
    },
    {
      id: 6,
      title: "New user registered",
      time: "2 days ago",
    },
  ];

  return (
    <div className="card notification-card">
      <div className="notification-header">
        <h2>Notifications</h2>
        <div className="count">5</div>
      </div>

      {notifications.map((item) => (
        <div
          key={item.id}
          className={`notification-item ${
            item.highlight ? "highlight" : ""
          }`}
        >
          <h4>{item.title}</h4>
          <p>{item.time}</p>
        </div>
      ))}

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