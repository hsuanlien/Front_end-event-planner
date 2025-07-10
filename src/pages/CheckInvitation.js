import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CheckInvitation = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the id and version from the URL
  const token = localStorage.getItem("token");

  const [recipientEmail, setRecipientEmail] = useState("");
  const [invitations, setInvitations] = useState([]);
  // const [letters, setLetters] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentInvitation, setCurrentInvitation] = useState(null);
  const [draft, setDraft] = useState({ subject: "", body: "", recipient_email: "", recipient_name: "" });
  const [showSendModal, setShowSendModal] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  useEffect(() => {
    fetch(`https://genai-backend-2gji.onrender.com/api/events/${id}/invitation/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Permission denied or not found.");
        return res.json();
      })
      .then(data => {
        console.log("Invitations from backend:", data);
        setInvitations(data);
        if (data.length > 0) {
          const latest = data[data.length - 1];
          // setCurrentInvitation(data[0]);
          // setRecipientEmail(data[0].recipient_email);
          // localStorage.setItem("latestInvitation", JSON.stringify(data[0])); // ← 這裡新增
          setCurrentInvitation(latest);
          setRecipientEmail(latest.recipient_email);
          localStorage.setItem("latestInvitation", JSON.stringify(latest));
        }
      })
      .catch(err => alert("無法取得邀請函: " + err.message));
  }, [id, token]);

  //  Important: Return loading status early here to avoid errors
  if (!currentInvitation) {
    return (
      <div className="text-white p-8">
        ⏳ Loading ...
      </div>
    );
  }
  const handleEdit = () => {
    setDraft({
      subject: currentInvitation.subject,
      body: currentInvitation.body,
      recipient_email: currentInvitation.recipient_email,
      recipient_name: currentInvitation.recipient_name || "",
    });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://genai-backend-2gji.onrender.com/api/invitation/${currentInvitation.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          ...draft,
          sent_at: null,
          status: null,
        }),
      });
      console.log("Response status after sending :", response.status);
      if (!response.ok) throw new Error(await response.text());

      const updated = await response.json();
      console.log("Data returned by the backend:", updated);

      setCurrentInvitation(updated);
      setInvitations(prev =>
        prev.map(inv => (inv.id === updated.id ? updated : inv))
      );
      setEditMode(false);
      alert("Successfully save!!");
    } catch (err) {
      console.error(err);
      alert("Fail:" + err.message);
    }
  };

  const handleSend = async () => {
    try {
      const res = await fetch(`https://genai-backend-2gji.onrender.com/api/email/${id}/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setShowSendModal(true);
      setHasSent(true);
      
    } catch (err) {
      console.error(err);
      alert("Fail to send:" + err.message);
    }
  };
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">🎯 Check Invitation Letter</h1>

        {/* <div className="min-w-[700px] mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6"> */}
        <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6">
{/* <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6 min-h-[500px]">
 */}
          {/* Subject */}
          <div>
            <h2 className="text-2xl font-bold text-cyan-300 mb-2">Subject</h2>
            {editMode ? (
              <input
                type="text"
                //className="w-full min-h-[50px] p-3 text-black rounded-lg shadow bg-white"
                className="w-full h-[60px] p-3 text-black rounded-lg shadow bg-white"
                value={draft.subject}
                onChange={(e) => setDraft(prev => ({ ...prev, subject: e.target.value }))}
              />
            ) : (
              // <div className="w-full min-h-[50px] p-3 bg-white text-black rounded-lg shadow">
              <div className="w-full h-[60px] p-3 text-black rounded-lg shadow bg-white"> 

                {currentInvitation.subject}
              </div>
            )}
          </div>

          {/* Body */}
          <div>
            <h2 className="text-2xl font-bold text-cyan-300 mb-2">Body</h2>
            {editMode ? (
              // <textarea
              //   // className="w-full min-h-[300px] p-3 text-black rounded-lg shadow bg-white resize-none"
              //   className="w-full h-[300px] p-3 text-black rounded-lg shadow bg-white resize-none"
              //   value={draft.body}
              //   onChange={(e) => setDraft(prev => ({ ...prev, body: e.target.value }))}
              // />
              <textarea
                  className="w-full min-h-[300px] p-3 text-black rounded-lg shadow bg-white resize-y"
                  style={{ height: "300px" }}
                  value={draft.body}
                  onChange={(e) => setDraft(prev => ({ ...prev, body: e.target.value }))}
                />

            ) : (
              // <div className="w-full min-h-[50px] p-3 text-black rounded-lg shadow bg-white">
              <div className="w-full h-[300px] p-3 text-black rounded-lg shadow bg-white whitespace-pre-wrap">
                {currentInvitation.body}
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-8 flex justify-between items-center">
        {/* <div className="fixed bottom-8 right-8 flex gap-4 z-50"> */}
          <button
            onClick={() => {
              if (hasSent) {
                navigate(`/event/${id}`);
              } else {
                alert("Please send the invitation before going back.");
              }
            }}
             className={`px-4 py-2 rounded-lg shadow ${
                  showSendModal
                    ? "bg-gray-600 hover:bg-gray-700 text-white cursor-pointer"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
          >
            ← Back to event
          </button>
          <div className="fixed bottom-8 right-8 flex gap-4 z-50">
          {/* <div className="flex gap-4"> */}
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-cyan-500  hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleSend}
              className="bg-cyan-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
            >
              Send
            </button>
          </div>
        </div>

     {showSendModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowSendModal(false)}
        >
          <div
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full text-white text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">The invitation has been sent successfully!</h3>
            <p className="text-lg text-cyan-300 mb-6">
              Successfully delivered to:<br />
              <span className="font-mono break-all">{recipientEmail}</span>
            </p>
            <button
              onClick={() => setShowSendModal(false)}
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-md font-semibold transition"
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}

      </main>
    </div>
  );
};
export default CheckInvitation;