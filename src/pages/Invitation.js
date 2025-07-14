import { fetchWithAuth } from "../utils/auth";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const getAuthToken = () => localStorage.getItem("access_token");

const saveInvitationToBackend = async (eventId, invitation) => {
 // const token = getAuthToken();
  const res = await fetchWithAuth(`https://genai-backend-2gji.onrender.com/ai/generate-invitation/${eventId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
     // Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invitation),
  });

  if (!res.ok) {
    throw new Error("Failed to save invitation");
  }
  return res.json(); // return invitation_list array
};

const Invitation = () => {
  const { id, version } = useParams();// id 是 event_id
  const navigate = useNavigate();

  const [invitationData, setInvitationData] = useState({
    receiver_name: "",
    recipient_email: "",
    words_limit: "150",
    tone: "",
    language: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvitationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { receiver_name, recipient_email, words_limit, tone, language } =
      invitationData;

    if (!receiver_name || !recipient_email || !words_limit || !tone || !language) {
      alert("Please fill out all fields");
      return;
    }
    try {
      // Call backend API to store
      const response = await saveInvitationToBackend(id, invitationData);

      // Check if you have an invitation
      if (response?.invitation_list?.length > 0) {
        // Save invitation ID as needed / display success message
        localStorage.setItem("latestInvitation", JSON.stringify(response.invitation_list[0]));
        navigate(`/event/${id}/check-invitation`);
      } else {
        throw new Error("No invitation returned");
      }
    } catch (error) {
      console.error("Save failed: ", error);
      alert("Save failed. Please try again later.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-cyan-300">
          🎨 Event {id} Invitation Letter Info
        </h2>

        {/* Form Fields */}
        {[
          {
            label: "Please input the receiver's name:",
            name: "receiver_name",
            type: "text",
            placeholder: "Receiver's name",
          },
          {
            label: "Please input the receiver's email:",
            name: "recipient_email",
            type: "email",
            placeholder: "Receiver's email",
          },
          {
            label: "Please set the word limit of the invitation:",
            name: "words_limit",
            type: "number",
            placeholder: "Words Limit",
            step: 50,
          },
        ].map(({ label, name, type, placeholder, step }) => (
          <div key={name}>
            <label className="block mb-1 text-sm text-gray-300">{label}</label>
            <input
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              type={type}
              name={name}
              placeholder={placeholder}
              step={step}
              value={invitationData[name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/** Tone */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Choose the tone:</label>
          <select
            name="tone"
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={invitationData.tone}
            onChange={handleChange}
            required
          >
            <option value="" disabled> Select tone </option>
            <option value="Formal">Formal</option>
            <option value="Semi-formal / Professional">Semi-formal / Professional</option>
            <option value="Friendly / Warm">Friendly / Warm</option>
            <option value="Casual / Informal">Casual / Informal</option>
            <option value="Persuasive / Promotional">Persuasive / Promotional</option>
          </select>
        </div>

        {/** Language */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Choose language:</label>
          <select
            name="language"
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={invitationData.language}
            onChange={handleChange}
            required
          >
            <option value="" disabled> Select language </option>
            {[
              "English", "German", "Traditional Chinese", "Simplified Chinese", "Spanish", "French", "Japanese", "Korean", "Russian", "Arabic", "Vietnamese", "Indonesian", "Thai", "Turkish", "Italian"
            ].map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/** button */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
        >
          ← Return
        </button>

        <button
          onClick={handleSave}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Invitation;