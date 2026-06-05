import "./ProfileNotifications.css";
import Sidebar from "./Sidebar";
import ProfileCard from "./ProfileCard";
import NotificationPanel from "./NotificationPanel";

function ProfileNotifications() {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <header className="topbar">
          <div className="nav-links">
            <span>Dashboard</span>
            <span>Forms</span>
            <span>Analytics</span>
            <span>Users</span>
          </div>

          <div className="top-avatar">AD</div>
        </header>

        <div className="content-grid">
          <ProfileCard />
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
}

export default ProfileNotifications;