import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [originalPassword, setOriginalPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");

  const [isEditable, setIsEditable] = useState(false); // Control whether it can be edited

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://genai-backend-2gji.onrender.com/accounts/", {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => {
        setUsername(data.username || "");
        setEmail(data.email || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setAddress(data.address || "");
        setOriginalPassword(data.password || "");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("https://genai-backend-2gji.onrender.com/accounts/account-update/", {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password: password || originalPassword,
          email,
          first_name: firstName,
          last_name: lastName,
          address,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Data updated successfully");
        setPassword("");
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        setOriginalPassword(result.user.password);
        setIsEditable(false); // Lock the slot after successful saving
      } else {
        alert("Update failed, please check your information or log in again");
        console.error("Update failed:", result);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Fail");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">User Profile</h2>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-xl mx-auto space-y-4 border border-white/10">
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="text"
          placeholder="Username"
          value={username}
          disabled 
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditable} // isEditable control
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="password"
          placeholder="Change Password (leave blank to keep current)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isEditable}
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={!isEditable}
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={!isEditable}
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!isEditable}
        />

        {/* Edit and save buttons side by side */}
        <div className="flex justify-end space-x-4 pt-2">
          <button
            onClick={() => setIsEditable(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold"
            disabled={isEditable} // Avoid repeated clicks
          >
            Edit
          </button>
          <button
            onClick={handleSave}
            className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg font-semibold"
            disabled={!isEditable} // Cannot save when not editable
          >
            Save
          </button>
        </div>
      </div>

      {/* Back button in the lower left corner */}
      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-4 left-4 h-12 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400 z-50"
      >
        ← Back
      </button>
    </div>
  );
};

export default UserProfile;