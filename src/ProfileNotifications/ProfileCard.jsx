import { useState } from "react";

function ProfileCard() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    password: "",
    twoFA: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProfile({
      ...profile,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    console.log(profile);
  };

  return (
    <div className="card profile-card">
      <div className="avatar">AD</div>

      <h2>Admin User</h2>

      <p className="email">
        admin@feedbackpro.com
      </p>

      <span className="badge">ADMIN</span>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={profile.fullName}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={profile.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={profile.phone}
        onChange={handleChange}
      />

      <input
        type="text"
        name="department"
        placeholder="Department"
        value={profile.department}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={profile.password}
        onChange={handleChange}
      />

      
         <input
             type="text"
             placeholder="2FA Authentication"
         />
    

      <button
        className="save-btn"
        onClick={handleSave}
      >
        SAVE CHANGES
      </button>
    </div>
  );
}

export default ProfileCard;