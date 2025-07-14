
import { fetchWithAuth } from "../utils/auth";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CheckRegistration = () => {
  const { id } = useParams(); // eventId
  const token = localStorage.getItem("access_token");

  const [registrationForm, setRegistrationForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ content: null, type: "" });
  const [showModal, setShowModal] = useState(false);
  const [googleFormUrl, setGoogleFormUrl] = useState("");

  // Use POST to obtain the registration form data (replace the original GET)
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetchWithAuth(`https://genai-backend-2gji.onrender.com/ai/generate-forms/${id}/`, {
      method: "POST",
      headers: {
       // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      //API does not require a body.
    })
      .then((res) => {
        //console.log("Response Status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch registration form");
        return res.json();
      })
      .then((data) => {
        //return structure is { "registration-list": [...] }
        console.log("Data:", data);
        if (data["registration-list"] && data["registration-list"].length > 0) {
          setRegistrationForm(data["registration-list"][0]);
          console.log("First registration form object:", data["registration-list"][0]);
        } else {
          throw new Error("No registration form data found");
        }
      })
      .catch((err) => {
        console.error("[Fetch Error]", err);
        setMessage({ text: err.message, type: "error" });
        setRegistrationForm(null);
      })
        .finally(() => {
        setLoading(false);
      });
    }, [id, token]);

  useEffect(() => {
    if (message.content && message.type === "error") {
      const timer = setTimeout(() => setMessage({ content: null, type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  //Form field change handler
  const handleFieldChange = (index, field, value) => {
    setRegistrationForm((prev) => {
      if (!prev) return prev;
        const newFields = [...prev.form_fields];
        newFields[index] = { ...newFields[index], [field]: value };
        return { ...prev, form_fields: newFields };
    });
  };

  // Add new fields
  const handleAddField = () => {
    setRegistrationForm((prev) => {
      if (!prev) return prev;
      const newFields = prev.form_fields ? [...prev.form_fields] : [];
      newFields.push({ description: "" , registration_name: ""});
      console.log("New Fields After Add :", newFields);
      return { ...prev, form_fields: newFields };
    });
  };
  // Remove fields
  const handleRemoveField = (index) => {
    console.log(`Remove Field index: ${index}`);
    setRegistrationForm((prev) => {
      if (!prev) return prev;
      const newFields = [...prev.form_fields];
      newFields.splice(index, 1);
      console.log("New Fields After Remove", newFields);
      return { ...prev, form_fields: newFields };
    });
  };

  // Text field changes (title, description)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input Change name: ${name}, value:`, value);
    setRegistrationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Change button: PUT updates backend data
  const handleChangeOrSave = () => {
    if (!isEditing) {
      // Enter Edit Mode
      setIsEditing(true);
      setMessage({ text: "", type: "" });
      return;
    }

    // PUT Update data
    if (!registrationForm) return;

    console.log("PUT Request - Updating registration form with data:", {
      registration_url: registrationForm.registration_url || "",
      form_title: registrationForm.form_title,
      event_intro: registrationForm.event_intro,
      form_fields: registrationForm.form_fields.map(({  description, registration_name }) => ({
        description, registration_name, 
      })),
    });
    console.log(registrationForm.id);
    setSaving(true);
    fetch(`https://genai-backend-2gji.onrender.com/api/registration/${registrationForm.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        registration_url: registrationForm.registration_url || "",
        form_title: registrationForm.form_title,
        event_intro: registrationForm.event_intro,
        form_fields: registrationForm.form_fields.map(({description, registration_name}) => ({
          description,
          registration_name,
        })),
      }),
    })
      .then((res) => {
        console.log("PUT Response Status", res.status);
        if (!res.ok) throw new Error("Failed to update registration form");
        return res.json();
      })
      .then((data) => {
        console.log("PUT Response Data", data);
        setRegistrationForm(data);
        setIsEditing(false);
        setMessage({ text: "Successfully updated registration form!", type: "success" });
      })
      .catch((err) => {
        setMessage({ text: err.message, type: "error" });
      })
      .finally(() => setSaving(false));
  };


  // Send button: Generates Google Form API and displays a popup link
  // Send Invitation button
  // Generates Google Form and displays Modal
  const handleSendInvitation = () => {
    if (!id) return setMessage({ text: "No event ID!", type: "error" });
    
    console.log("Sending request to generate Google Form");
    setSending(true);
    fetch(`https://genai-backend-2gji.onrender.com/api/events/${id}/generate-google-form/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("Send Invitation Response Status:", res.status);
        if (!res.ok) throw new Error("Failed to generate Google form");
        return res.json();
      })
      .then((data) => {
        console.log("Send Invitation Data :", data);
        const formUrl = data.registration_url;

        // Use alert to display the link
        alert(`Google Registration Form created:\n\n${formUrl}`);

        // Record this URL or pass it to subsequent components
        setGoogleFormUrl(formUrl);
        // setShowModal(true);
        setRegistrationForm((prev) => ({
          ...prev,
          registration_url: formUrl,
        }));        
        setMessage({
        content: (
          <>
            <span>Successfully created Registration form! </span>
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300 hover:text-blue-500 ml-2"
            >
              {formUrl}
            </a>
          </>
        ),
        type: "success",
      });

      })
      .catch((err) => {
        console.error("Send Invitation Error:", err);
        setMessage({ text: err.message, type: "error" });
      })
      .finally(() => setSending(false));
  };


  // Back Button 
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-3xl w-full space-y-6 border border-white/10 relative">
        <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow text-center">📝 Event Registration Form</h2>

        {loading ? (
          <p className="text-center text-gray-400 text-lg py-10">
            Loading registration form, please wait... <span className="animate-pulse">⏳</span>
          </p>
        ) : !registrationForm ? (
          <p className="text-center text-gray-400 text-lg py-10">
            Could not load registration form data. Please check your backend and token.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Event Introduction Pane */}
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-md">
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">Event Introduction</h3>
              {isEditing ? (
                <textarea
                  name="event_intro"
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-y min-h-[100px]"
                  value={registrationForm.event_intro || ""}
                  onChange={handleInputChange}
                  disabled={saving || sending}
                />
              ) : (
                <p className="text-gray-200 whitespace-pre-wrap">{registrationForm.event_intro}</p>
              )}
            </div>

            {/* Form Title Pane */}
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-md">
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">Form Title</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="form_title"
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  value={registrationForm.form_title || ""}
                  onChange={handleInputChange}
                  disabled={saving || sending}
                />
              ) : (
                <p className="text-gray-200">{registrationForm.form_title}</p>
              )}
            </div>

            {/* Form Fields Pane */}
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-md">
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">Form Fields</h3>
              <div className="space-y-3">
                {Array.isArray(registrationForm.form_fields) && registrationForm.form_fields.length > 0 ? (
                  registrationForm.form_fields.map((field, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            placeholder="Description"
                            className="flex-1 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            value={field.description}
                            onChange={(e) =>
                              handleFieldChange(index, "description", e.target.value)
                            }
                            disabled={saving || sending}
                          />
                          <input
                            type="text"
                            placeholder="Registration Name"
                            className="flex-1 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            value={field.registration_name}
                            onChange={(e) =>
                              handleFieldChange(index, "registration_name", e.target.value)
                            }
                            disabled={saving || sending}
                          />
                          <button
                            onClick={() => handleRemoveField(index)}
                            disabled={saving || sending}
                            className="text-red-400 hover:text-red-600 font-semibold transition"
                            title="Remove field"
                            type="button"
                          >
                            ✖
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1 text-gray-200">{field.description || "—"}</div>
                          <div className="flex-1 text-gray-300">{field.registration_name || "—"}</div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No form fields available.</p>
                )}

                {/* Add new column button */}
                {isEditing && (
                  <button
                    onClick={handleAddField}
                    disabled={saving || sending}
                    className="mt-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white font-semibold transition w-full md:w-auto"
                    type="button"
                  >
                    + Add Field
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
              <button
                onClick={handleChangeOrSave}
                disabled={saving || sending || loading}
                className="bg-cyan-600 hover:bg-cyan-700 rounded-md px-6 py-3 font-bold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? (saving ? "Saving..." : "Save") : "Edit"}
              </button>

              <button
                onClick={handleSendInvitation}
                disabled={sending || saving || loading}
                className="bg-green-600 hover:bg-green-700 rounded-md px-6 py-3 font-bold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Create..." : "Create"}
              </button>

              <button
                onClick={handleGoBack}
                className="bg-gray-600 hover:bg-gray-700 rounded-md px-6 py-3 font-bold text-white transition"
              >
                Back
              </button>
            </div>

            {/* Message display */}
            {message.content && (
              <div className={`p-4 rounded-md ${message.type === "error" ? "bg-red-500" : "bg-green-600"} text-white flex justify-between items-center`}>
                  <div>{message.content}</div>
                  <button
                    onClick={() => setMessage({ content: null, type: "" })}
                    className="ml-4 px-2 py-1 bg-white/20 hover:bg-white/30 rounded"
                  >
                    ✕
                  </button>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckRegistration;