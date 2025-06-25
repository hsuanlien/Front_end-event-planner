import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const CheckCopywriting = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id, version } = useParams();

    // 将 formatContentWithHashtags 用 useCallback 包裹，确保引用稳定
    const formatContentWithHashtags = useCallback((content, hashtags) => {
        if (!content) return '';
        // 确保 hashtags 是数组且有内容，然后添加到内容后面
        const hashtagsString = Array.isArray(hashtags) && hashtags.length > 0
            ? ` ${hashtags.join(' ')}` // 前面加个空格
            : '';
        return `${content.trim()}${hashtagsString}`; // content.trim() 防止内容自身有多余空格
    }, []); // 依赖项为空数组，因为此函数是纯函数，不依赖组件作用域内的任何变量

    // 将 initialPosts 的定义用 useMemo 包裹，确保引用稳定
    const initialPosts = useMemo(() => {
        return location.state?.generatedPosts || [];
    }, [location.state?.generatedPosts]); // 仅当 location.state.generatedPosts 改变时才重新计算

    // 修改 useState 的初始化，确保它只在组件初次渲染时执行
    // 并且我们现在需要保留原始的 hashtag 数组，以便保存时可以发送
    const [posts, setPosts] = useState(() => {
        if (initialPosts.length > 0) {
            return initialPosts.map(post => {
                // 原始的 content 和 hashtag 分别保留
                const fullContent = formatContentWithHashtags(post.content, post.hashtag);
                return {
                    ...post,
                    originalContent: fullContent, // 原始显示用（合并了内容和标签）
                    editedContent: fullContent,   // 编辑用
                    originalHashtags: post.hashtag || [], // 新增：保存原始 hashtag 数组
                    isEditing: false
                };
            });
        }
        return []; // 否则，初始化为空数组，等待 fetchPosts 填充
    });

    const API_BASE_URL = 'http://localhost:3001';

    // fetchPosts 的依赖项需要包含 formatContentWithHashtags，因为在内部使用了它
    const fetchPosts = useCallback(async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_BASE_URL}/generated_posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(data.map(post => {
                    const fullContent = formatContentWithHashtags(post.content, post.hashtag);
                    return {
                        ...post,
                        originalContent: fullContent,
                        editedContent: fullContent,
                        originalHashtags: post.hashtag || [], // 新增：保存原始 hashtag 数组
                        isEditing: false
                    };
                }));
            } else {
                const errorData = await response.json();
                alert(`获取文案失败: ${errorData.detail || errorData.message || "服务器错误"}`);
                console.error("Failed to fetch posts:", errorData);
            }
        } catch (error) {
            alert("网络错误，无法获取文案。请确保 json-server 正在运行。");
            console.error("Network error fetching posts:", error);
        }
    }, [formatContentWithHashtags]);

    useEffect(() => {
        // 只有当 initialPosts 为空且当前 posts 状态也为空时，才执行 fetchPosts
        // 这避免了在通过 location.state 传入数据时，仍然去发起 API 请求
        if (initialPosts.length === 0 && posts.length === 0) {
            fetchPosts();
        }
    }, [id, version, initialPosts, fetchPosts, posts.length]); // 依赖项保持完整和稳定

    const handleToggleEdit = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                if (post.isEditing) {
                    // 如果取消修改，重置为原始内容
                    // post.originalContent 已经是格式化好的（包含标签的）完整内容
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
        const postToSave = posts.find(post => post.id === postId);
        if (!postToSave) return;

        const token = localStorage.getItem("token");

        // ----------- 核心修改：处理 content 和 hashtag 的分离 -----------
        let contentToSave = postToSave.editedContent.trim();
        let updatedHashtags = [];

        // 使用正则表达式匹配文本末尾的一个或多个 #标签
        // 匹配规则：以空格开始，后跟 #，然后是非空格字符，直到字符串结束
        // (\s*#[\w一-龠]+) 匹配一个标签，(?: ... )* 匹配零个或多个这样的标签串
        const hashtagRegex = /(\s*#[\w一-龠]+(?: #[\w一-龠]+)*)$/;

        const match = contentToSave.match(hashtagRegex);

        if (match) {
            const hashtagsString = match[0].trim(); // 匹配到的标签字符串，例如 " #tag1 #tag2"
            // 从内容中移除匹配到的标签字符串
            contentToSave = contentToSave.substring(0, contentToSave.length - hashtagsString.length).trim();

            // 提取标签，并清理格式 (确保以 # 开头，去重)
            updatedHashtags = hashtagsString
                .split(/\s+/) // 按一个或多个空格分割
                .filter(tag => tag.startsWith('#') && tag.length > 1) // 过滤掉空字符串或不是以 # 开头的
                .filter((value, index, self) => self.indexOf(value) === index); // 去重
        } else {
            // 如果没有匹配到末尾的 #标签，则沿用原始标签
            updatedHashtags = postToSave.originalHashtags || [];
        }

        try {
            const response = await fetch(`${API_BASE_URL}/generated_posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    content: contentToSave, // 发送分离后的内容
                    hashtag: updatedHashtags, // 发送分离后的标签
                }),
            });

            if (response.ok) {
                alert("文案保存成功！");
                // 更新 posts 状态，确保 originalContent 和 originalHashtags 也被更新
                setPosts(posts.map(post =>
                    post.id === postId ? {
                        ...post,
                        originalContent: formatContentWithHashtags(contentToSave, updatedHashtags),
                        editedContent: formatContentWithHashtags(contentToSave, updatedHashtags),
                        originalHashtags: updatedHashtags,
                        isEditing: false
                    } : post
                ));
            } else {
                const errorData = await response.json();
                alert(`保存失败: ${errorData.detail || errorData.message || "服务器错误"}`);
                console.error("Failed to save post:", errorData);
            }
        } catch (error) {
            alert("网络错误，无法保存文案。请确保 json-server 正在运行。");
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
                <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow text-center">📄 检查与修改文案</h2>

                {posts.length === 0 ? (
                    <p className="text-center text-gray-400">没有文案可供显示。请先在生成页面创建文案。</p>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post, index) => (
                            <div key={post.id} className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-md">
                                <h3 className="text-lg font-semibold text-cyan-200 mb-2">文案 {index + 1}</h3>
                                {post.isEditing ? (
                                    <textarea
                                        className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-y min-h-[100px] max-h-[200px] overflow-y-auto custom-scrollbar-content"
                                        value={post.editedContent}
                                        onChange={(e) => handleContentChange(post.id, e.target.value)}
                                    />
                                ) : (
                                    // 针对水平滚动条和第一行过长问题，尝试更强硬的 CSS 规则
                                    <p
                                        className="text-gray-200 whitespace-pre-wrap break-word w-full overflow-x-hidden max-h-[200px] overflow-y-auto custom-scrollbar-content"
                                        style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }} // 再次强调 word-wrap 和 white-space
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
                                        {post.isEditing ? '取消修改' : '修改文案'}
                                    </button>
                                    {post.isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => handleSave(post.id)}
                                            className="px-4 py-2 rounded-md font-semibold transition duration-200 ease-in-out
                                                bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            保存修改
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
                        返回
                    </button>
                    <button
                        type="button"
                        onClick={handleGoToEventPage}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition duration-200 ease-in-out"
                    >
                        前往事件页面
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckCopywriting;