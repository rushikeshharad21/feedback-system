function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo"><h5>FeedbackPro</h5></div>

      <ul>
        <li>Dashboard</li>
        <li>Forms</li>
        <li>Responses</li>
        <li>Analytics</li>
        <li>Users</li>
        <li className="active">Notifications</li>
        <li>Settings</li>
      </ul>
    </aside>
  );
}

export default Sidebar;