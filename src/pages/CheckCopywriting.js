import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const API_BASE_URL = 'https://genai-backend-2gji.onrender.com';

const CheckCopywriting = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id, version } = useParams();

    // Wrap formatContentWithHashtags with useCallback to ensure stable reference
    const formatContentWithHashtags = useCallback((content, hashtags) => {
        if (!content) return '';
        // Make sure hashtags is an array and has content, then add it after the content
        const hashtagsString = Array.isArray(hashtags) && hashtags.length > 0
            ? ` ${hashtags.join(' ')}`// Add a space in front
            : '';
        return `${content.trim()}${hashtagsString}`; // content.trim() prevents the content from having extra spaces
    }, []); 

    const initialPosts = useMemo(() => {
        return location.state?.generatedPosts || [];
    }, [location.state?.generatedPosts]); //Recompute only if location.state.generatedPosts changes

    const [posts, setPosts] = useState(() => {
        if (initialPosts.length > 0) {
            return initialPosts.map(post => {
                // The original content and hashtag are retained separately
                const fullContent = formatContentWithHashtags(post.content, post.hashtag);
                return {
                    ...post,
                    originalContent: fullContent, // Original display (content and labels merged)
                    editedContent: fullContent,   // Edit
                    originalHashtags: post.hashtag || [], // New: Save original hashtag array
                    isEditing: false
                };
            });
        }
        return []; // Otherwise, initialize to an empty array and wait for fetchPosts to fill it
    });

    const fetchPosts = useCallback(async () => {
        
        const token = localStorage.getItem("token");
        if (!id) {
            alert("The event ID is missing and the document cannot be obtained.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/events/${id}/social-posts/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });
            if (response.ok) {
                    const data = await response.json();
                    // console.log("Fetched posts:", data); //Confirm whether each transaction has an ID
                    setPosts(data.map(post => ({
                        ...post,
                        originalContent: post.content || '',
                        editedContent: post.content || '',
                        isEditing: false
                    })));
                } else {
                    const errorData = await response.json();
                    alert(`Failed to obtain text: ${errorData.detail || errorData.message || "Server error"}`);
                    console.error("Failed to fetch posts:", errorData);
                }
            } 
            catch (error) {
                alert("Network error, please make sure the server is started.");
                console.error("Fetch error:", error);
                }
            }, [id]);

        useEffect(() => {
            fetchPosts();
        }, [id, fetchPosts]);

        const handleToggleEdit = (postId) => {
            setPosts(posts.map(post => {
                if (post.id === postId) {
                    if (post.isEditing) {
                        // If the modification is cancelled, reset to the original content
                        return { ...post, isEditing: false, editedContent: post.originalContent };
                    } else {
                        return { ...post, isEditing: true };
                    }
                }
                return post;
            }));
        };

    const handleContentChange = (postId, newContent) => {
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, editedContent: newContent } : post
        ));
    };

    const handleSave = async (postId) => {

        if (!postId || typeof postId !== 'number') {
            alert("Unable to save: Unable to find the correct post ID. Please make sure the post has been successfully saved in the backend.");
            return;
        }

        const postToSave = posts.find(post => post.id === postId);
        if (!postToSave) return;

        const token = localStorage.getItem("token");

        // handle the separation of content and hashtag
        let contentToSave = postToSave.editedContent.trim();
        let updatedHashtags = [];

// Use regular expressions to match one or more # tags at the end of the text
// Matching rules: start with a space, followed by #, then non-space characters until the end of the string
// (\s*#[\w一-龠]+) matches a tag, (?: ... )* matches zero or more such tag strings
        const hashtagRegex = /(\s*#[\w一-龠]+(?: #[\w一-龠]+)*)$/;

        const match = contentToSave.match(hashtagRegex);

        if (match) {
            const hashtagsString = match[0].trim(); // Matched tag string, such as "#tag1 #tag2"
           
            contentToSave = contentToSave.substring(0, contentToSave.length - hashtagsString.length).trim();
            // Extract tags and clean up the format (make sure they start with # to remove duplicates)
            updatedHashtags = hashtagsString
                .split(/\s+/) // Split by one or more spaces
                .filter(tag => tag.startsWith('#') && tag.length > 1) // Filter out empty strings or those that do not start with #
                .filter((value, index, self) => self.indexOf(value) === index); 
        } else {
            updatedHashtags = postToSave.originalHashtags || [];
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/social-posts/${postId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    platform: postToSave.platform,
                    content: postToSave.editedContent.trim(),
                    tone: postToSave.tone,
                    language: postToSave.language,
                }),
            });

            if (response.ok) {
                alert("Social media post was saved successfully!");
                const updated = await response.json();
                const formattedContent = formatContentWithHashtags(updated.content, []);

                // 更新 posts 状态，确保 originalContent 和 originalHashtags 也被更新
                setPosts(posts.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            originalContent: postToSave.editedContent.trim(),
                            editedContent: postToSave.editedContent.trim(),
                            isEditing: false,
                            ...updated // 更新其它後端可能改動的欄位
                        }
                    : post
                ));
            } else {
                const errorData = await response.json();
                alert(`Fail to save: ${errorData.detail || errorData.message || "Server error"}`);
                console.error("Failed to save post:", errorData);
            }
        } catch (error) {
            alert("Server error!!!!");
            console.error("Network error saving post:", error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoToEventPage = () => {
        if (id) {
            navigate(`/event/${id}`);
        } else {
            navigate('/upcoming-events');
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-3xl w-full space-y-6 border border-white/10">
                <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow text-center">📄 Check and Modify</h2>

                {posts.length === 0 ? (
                    <p className="text-center text-gray-400">There is no post to display.</p>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post, index) => (
                            <div key={post.id} className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-md">
                                <h3 className="text-lg font-semibold text-cyan-200 mb-2">Post {index + 1}</h3>
                                {post.isEditing ? (
                                    <textarea
                                        className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-y min-h-[100px] max-h-[200px] overflow-y-auto custom-scrollbar-content"
                                        value={post.editedContent}
                                        onChange={(e) => handleContentChange(post.id, e.target.value)}
                                    />
                                ) : (
                                    <p
                                        className="text-gray-200 whitespace-pre-wrap break-word w-full overflow-x-hidden max-h-[200px] overflow-y-auto custom-scrollbar-content"
                                        style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                                    >
                                        {post.originalContent}
                                    </p>
                                )}
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleEdit(post.id)}
                                        className="px-4 py-2 rounded-md font-semibold transition duration-200 ease-in-out
                                            bg-gray-600 hover:bg-gray-700 text-white"
                                    >
                                        {post.isEditing ? 'Cancel modification' : 'Modify'}
                                    </button>
                                    {post.isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => handleSave(post.id)}
                                            className="px-4 py-2 rounded-md font-semibold transition duration-200 ease-in-out
                                                bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 flex justify-between">
                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition duration-200 ease-in-out"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleGoToEventPage}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition duration-200 ease-in-out"
                    >
                        Back to Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckCopywriting;