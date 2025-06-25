import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CheckRegistration = () => {
    const navigate = useNavigate();
    const { id: eventId } = useParams();

    // State for the full object fetched from json-server, including its ID and nested registration-list
    const [registrationContainerData, setRegistrationContainerData] = useState(null);
    // State for the actual editable form content (event_intro, form_title, form_fields from inside registration-list)
    const [editedFormData, setEditedFormData] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    // UI states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showModal, setShowModal] = useState(false);
    const [googleFormUrl, setGoogleFormUrl] = useState('');

    const API_BASE_URL = 'http://localhost:3001';

    const showMessage = useCallback((text, type = 'success', duration = 3000) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), duration);
    }, []);

    const fetchRegistrationForm = useCallback(async () => {
        console.log("DEBUG: Attempting to fetch registration form...");
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_BASE_URL}/registrationForms`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`DEBUG: Fetch failed with status ${response.status}: ${errorBody}`);
                throw new Error(`Server responded with status ${response.status}: ${errorBody}`);
            }

            const data = await response.json();
            const container = data.find(item => item.id === "1"); // Assuming ID is string "1" based on latest info

            if (container && container["registration-list"] && container["registration-list"].length > 0) {
                setRegistrationContainerData(container);
                const formContent = container["registration-list"][0];
                setEditedFormData({ ...formContent });
                console.log("DEBUG: Registration form fetched successfully.", container);
            } else {
                showMessage("Registration form with ID '1' not found or malformed. Please check db.json.", 'error');
                console.error("DEBUG: Registration form data not found or malformed:", container);
            }
        } catch (error) {
            console.error("DEBUG: Network error during fetch:", error);
            console.trace("DEBUG: Fetch error stack trace:");
            showMessage("Network error. Could not fetch registration form. Please ensure json-server is running and accessible.", 'error');
        } finally {
            setLoading(false);
        }
    }, [showMessage]);

    useEffect(() => {
        fetchRegistrationForm();
    }, [fetchRegistrationForm]);

    // Handle toggling edit mode OR saving changes based on current state
    const handleChangeOrSave = async () => {
        if (isEditing) {
            console.log("DEBUG: Change/Save button clicked: isEditing is TRUE. Calling handleSave.");
            await handleSave(); // Call the save function
        } else {
            console.log("DEBUG: Change/Save button clicked: isEditing is FALSE. Setting isEditing to TRUE.");
            // When entering edit mode, ensure editedFormData is a deep copy to prevent direct modification
            // Also, ensure form_fields is always an array
            const currentFormData = registrationContainerData?.["registration-list"]?.[0];
            setEditedFormData({
                ...currentFormData,
                form_fields: Array.isArray(currentFormData?.form_fields)
                    ? currentFormData.form_fields.map(field => ({ ...field })) // Deep copy each field object
                    : [] // Initialize as empty array if null/undefined
            });
            setIsEditing(true);
        }
    };

    // Handle input changes for editable fields (event_intro, form_title)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle changes for individual form fields
    const handleFormFieldChange = (index, fieldName, value) => {
        setEditedFormData(prev => {
            const newFormFields = [...(prev?.form_fields || [])]; // Create a copy of the array
            if (newFormFields[index]) {
                newFormFields[index] = {
                    ...newFormFields[index],
                    [fieldName]: value
                };
            }
            return {
                ...prev,
                form_fields: newFormFields
            };
        });
    };

    // Handle adding a new form field
    const handleAddField = () => {
        setEditedFormData(prev => ({
            ...prev,
            form_fields: [...(prev?.form_fields || []), { registration_name: '', description: '' }] // Add new empty field
        }));
    };

    // Handle removing a form field
    const handleRemoveField = (indexToRemove) => {
        setEditedFormData(prev => ({
            ...prev,
            form_fields: (prev?.form_fields || []).filter((_, index) => index !== indexToRemove) // Filter out the field at index
        }));
    };

    // Handle saving modified data to json-server
    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");

        if (!editedFormData || !registrationContainerData || !registrationContainerData.id) {
            showMessage("No data to save or form ID is missing.", 'error');
            setSaving(false);
            return;
        }

        try {
            const updatedContainer = { ...registrationContainerData };
            // Ensure registration-list is an array and update its first element
            updatedContainer["registration-list"] = [{ ...editedFormData }];

            console.log("DEBUG: Attempting to save. Sending payload to:", `${API_BASE_URL}/registrationForms/${updatedContainer.id}`);
            console.log("DEBUG: Payload:", JSON.stringify(updatedContainer, null, 2));

            const response = await fetch(`${API_BASE_URL}/registrationForms/${updatedContainer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(updatedContainer),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`DEBUG: Save failed with status ${response.status}: ${errorBody}`);
                throw new Error(`Server responded with status ${response.status}: ${errorBody}`);
            }

            const data = await response.json();
            console.log("DEBUG: Save successful. Received response:", data);
            setRegistrationContainerData(data);
            setEditedFormData({ ...data["registration-list"][0] });
            setIsEditing(false);
            showMessage("Registration form saved successfully!", 'success');
        } catch (error) {
            console.error("DEBUG: Network error during save operation:", error);
            console.trace("DEBUG: Save error stack trace:");
            showMessage("Network error. Could not save registration form. Please ensure json-server is running and accessible.", 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSendInvitation = async () => {
        console.log("DEBUG: Send button clicked. isEditing:", isEditing);
        setSending(true);
        try {
            if (isEditing) {
                showMessage("Please save your changes first before sending the invitation.", 'error');
                setSending(false);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockGoogleFormUrl = `https://docs.google.com/forms/d/1aoFJBg_OwYDJuohztXgfYjfSZoYfkrq0E45-jClEXa4/viewform?event_id=${eventId || 'mock_event'}`;

            setGoogleFormUrl(mockGoogleFormUrl);
            setShowModal(true);
            showMessage("Successfully created Registration form link!", 'success');

        } catch (error) {
            console.error("DEBUG: Error generating Google Form link:", error);
            showMessage("Failed to generate Google Form link.", 'error');
        } finally {
            setSending(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-3xl w-full space-y-6 border border-white/10 relative">
                <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow text-center">📝 Event Registration Form</h2>

                {loading ? (
                    <p className="text-center text-gray-400 text-lg py-10">
                        Loading registration form, please wait... <span className="animate-pulse">⏳</span>
                    </p>
                ) : !registrationContainerData ? (
                    <p className="text-center text-gray-400 text-lg py-10">
                        Could not load registration form data. Please check your db.json file and json-server.
                    </p>
                ) : (
                    // This div contains all the main content panels (intro, title, fields)
                    <div className="space-y-6">
                        {/* Event Introduction Pane */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-md">
                            <h3 className="text-lg font-semibold text-cyan-200 mb-2">Event Introduction</h3>
                            {isEditing ? (
                                <textarea
                                    name="event_intro"
                                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-y min-h-[100px]"
                                    value={editedFormData?.event_intro || ''}
                                    onChange={handleInputChange}
                                    disabled={saving || sending}
                                />
                            ) : (
                                <p className="text-gray-200 whitespace-pre-wrap">{editedFormData?.event_intro}</p>
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
                                    value={editedFormData?.form_title || ''}
                                    onChange={handleInputChange}
                                    disabled={saving || sending}
                                />
                            ) : (
                                <p className="text-gray-200">{editedFormData?.form_title}</p>
                            )}
                        </div>

                        {/* Form Fields Pane (Now Editable with Placeholders) */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-md">
                            <h3 className="text-lg font-semibold text-cyan-200 mb-2">Form Fields</h3>
                            <div className="space-y-3">
                                {Array.isArray(editedFormData?.form_fields) && editedFormData.form_fields.length > 0 ? (
                                    editedFormData.form_fields.map((field, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-2 bg-white/5 rounded-md border border-white/10">
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        placeholder="Description (e.g., First Name)"
                                                        className="w-full sm:w-1/2 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                                        value={field.description || ''}
                                                        onChange={(e) => handleFormFieldChange(index, 'description', e.target.value)}
                                                        disabled={saving || sending}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Registration Name (e.g., first_name)"
                                                        className="w-full sm:w-1/2 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                                        value={field.registration_name || ''}
                                                        onChange={(e) => handleFormFieldChange(index, 'registration_name', e.target.value)}
                                                        disabled={saving || sending}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveField(index)}
                                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md font-semibold text-sm transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={saving || sending}
                                                    >
                                                        Remove
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex items-center space-x-2 text-gray-300 w-full">
                                                    <span className="font-medium">{field.description}:</span>
                                                    <span className="text-sm text-gray-400">({field.registration_name})</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm">No form fields defined.</p>
                                )}
                            </div>
                            {isEditing && (
                                <div className="mt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={handleAddField}
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-semibold shadow-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={saving || sending}
                                    >
                                        Add Field
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Message display area - Now positioned within the normal flow, centered above buttons */}
                {message.text && (
                    <div className={`mt-4 mb-4 mx-auto px-4 py-2 rounded-lg shadow-md z-10 max-w-sm text-center
                                    ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {message.text}
                    </div>
                )}

                {/* Bottom Buttons */}
                <div className="mt-8 flex justify-between items-center pt-4 border-t border-white/10">
                    {/* Left: Back button */}
                    <div className="flex">
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-5 rounded-lg font-semibold shadow-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || saving || sending}
                        >
                            Back
                        </button>
                    </div>

                    {/* Right: Change/Save and Send buttons */}
                    <div className="flex" style={{ gap: '1.5rem' }}>
                        {/* Change / Save combined button */}
                        <button
                            type="button"
                            onClick={handleChangeOrSave}
                            className={`px-5 py-2 rounded-md font-semibold transition duration-200 ease-in-out
                                ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                            disabled={loading || saving || sending}
                        >
                            {isEditing ? (saving ? 'Saving...' : 'Save') : 'Change'}
                        </button>

                        {/* Send Invitation button */}
                        <button
                            type="button"
                            onClick={handleSendInvitation}
                            className="px-5 py-2 rounded-md font-semibold transition duration-200 ease-in-out
                                bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || saving || sending || isEditing}
                        >
                            {sending ? 'Sending...' : 'Send Invitation'}
                        </button>
                    </div>
                </div>

                {/* Google Form Link Modal - This is designed to pop out */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full text-center space-y-4 border border-gray-600">
                            <h3 className="text-xl font-bold text-green-400">Successfully created Registration form!</h3>
                            <p className="text-gray-200">This is the link:</p>
                            <a
                                href={googleFormUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition truncate"
                            >
                                {googleFormUrl}
                            </a>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(googleFormUrl)
                                        .then(() => {
                                            showMessage('Link copied to clipboard!', 'success');
                                            setShowModal(false);
                                        })
                                        .catch(err => {
                                            console.error('Failed to copy text: ', err);
                                            showMessage('Failed to copy link.', 'error');
                                        });
                                }}
                                className="mt-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
                            >
                                Copy Link
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckRegistration;