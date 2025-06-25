import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Copywriting = () => {
    const navigate = useNavigate();
    const { id, version } = useParams(); // 获取 URL 中的 id 和 version

    const [platform, setPlatform] = useState('');
    const [wordsLimit, setWordsLimit] = useState('100');
    const [tone, setTone] = useState('');
    const [hookType, setHookType] = useState('');
    const [includeEmoji, setIncludeEmoji] = useState('true');
    const [emojiLevel, setEmojiLevel] = useState('');
    const [powerWords, setPowerWords] = useState('');

    const [hashtagSeeds, setHashtagSeeds] = useState([]);
    const [currentHashtagInput, setCurrentHashtagInput] = useState('');

    const [language, setLanguage] = useState('english');

    const platformOptions = ['facebook', 'instagram', 'x', 'threads'];
    const toneOptions = [
        'Friendly / Conversational', 'Professional / Informative', 'Playful / Humorous',
        'Inspirational / Uplifting', 'Urgent / Promotional', 'Authoritative / Thought Leader',
        'Community-focused / Supportive',
    ];
    const hookTypeOptions = [
        'Question Hook', 'Bold Statement / Shock Hook', 'Statistic / Data Hook',
        '“Did You Know?” Hook', 'Story Hook', 'Problem Hook', 'How-to Hook',
        'Curiosity / Teaser Hook', '“List” Hook', 'Call-to-Action Hook',
    ];
    const emojiLevelOptions = ['high', 'mid', 'low'];

    const languageOptions = [
        'english', 'chinese', 'german', 'spanish', 'french', 'italian',
        'japanese', 'korean', 'russian', 'arabic', 'portuguese', 'dutch',
        'swedish', 'norwegian', 'danish', 'finnish', 'turkish', 'hindi',
        'indonesian', 'vietnamese', 'thai', 'polish', 'czech', 'greek'
    ];

    const powerWordCategories = [
        {
            category: 'Urgency & Scarcity',
            words: ['Limited', 'Hurry', 'Last chance', 'Deadline', 'Today only', 'Now', 'Don’t miss out', 'Ending soon', 'Expires', 'Instant']
        },
        {
            category: 'Excitement & Energy',
            words: ['Unbelievable', 'Game-changer', 'Breakthrough', 'Jaw-dropping', 'Epic', 'Explosive', 'Hot', 'Revealed', 'Shocking', 'Surprising']
        },
        {
            category: 'Value & Benefit',
            words: ['Free', 'Exclusive', 'Proven', 'Premium', 'Guaranteed', 'Effortless', 'Valuable', 'Best-selling', 'Secret', 'All-in-one']
        },
        {
            category: 'Curiosity & Intrigue',
            words: ['Insider', 'What happened next', 'Hidden', 'Bizarre', 'Strange', 'Little-known', 'Confessions', 'You’ll never guess', 'Behind the scenes', 'Uncovered']
        },
        {
            category: 'Trust & Safety',
            words: ['Certified', 'Backed', 'Secure', 'Reliable', 'Safe', 'Official', 'Verified', 'Expert', 'Research-based', 'No risk']
        },
        {
            category: 'Emotional Triggers',
            words: ['Love', 'Fear', 'Joy', 'Crave', 'Desire', 'Hate', 'Panic', 'Hope', 'Win', 'Struggle']
        },
        {
            category: 'Action & Command Words',
            words: ['Start', 'Get', 'Discover', 'Build', 'Try', 'Join', 'Save', 'Upgrade', 'Unlock', 'Grab']
        }
    ];

    const handleHashtagInputChange = (e) => {
        setCurrentHashtagInput(e.target.value);
    };

    const handleHashtagInputKeyDown = (e) => {
        // 只保留回车键判断
        if (e.key === 'Enter') {
            e.preventDefault(); // 阻止默认行为

            const newTagText = currentHashtagInput.trim();

            if (newTagText) {
                const formattedTag = newTagText.startsWith('#') ? newTagText : `#${newTagText}`;
                const isDuplicate = hashtagSeeds.some(tag =>
                    tag.toLowerCase().replace(/^#/, '') === formattedTag.toLowerCase().replace(/^#/, '')
                );

                if (!isDuplicate) {
                    setHashtagSeeds(prevTags => [...prevTags, formattedTag]);
                    setCurrentHashtagInput(''); // 清空输入框
                } else {
                    alert("该标签已存在！");
                    setCurrentHashtagInput(''); // 清空输入框
                }
            }
        }
    };

    const handleRemoveHashtag = (tagToRemove) => {
        setHashtagSeeds(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!platform || !tone || !hookType || !emojiLevel || !language) {
            alert("请填写所有必填字段（平台、语调、钩子类型、表情符号级别、语言）。");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const formattedHashtagSeeds = hashtagSeeds.join(',');
            console.log("提交的 hashtagSeeds:", formattedHashtagSeeds);

            const response = await fetch(`http://localhost:3001/generated_posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.ok) {
                const generatedPosts = await response.json();

                if (generatedPosts && generatedPosts.length > 0) {
                    alert("文案生成请求成功 (json-server 模拟)！");
                    console.log("Simulated Generated Copywriting Data:", generatedPosts);
                    navigate(`/event/${id}/${version}/check-copywriting`, { state: { generatedPosts: generatedPosts } });
                } else {
                    alert("从 json-server 获取文案数据失败：'/generated_posts' 为空或格式不正确。请检查 db.json。");
                    console.error("No generated posts found or invalid format at /generated_posts:", generatedPosts);
                }

            } else {
                const errorData = await response.json();
                alert(`文案生成失败 (json-server 模拟): ${errorData.detail || errorData.message || "服务器错误"}`);
                console.error("Copywriting generation failed (json-server模拟):", errorData);
            }
        } catch (error) {
            alert("无法连接到 json-server，请检查是否已运行。");
            console.error("Network or server error (json-server模拟):", error);
        }
    };

    const handlePowerWordClick = (word) => {
        setPowerWords(prev => {
            const currentWords = prev.split(',').map(s => s.trim()).filter(Boolean);
            if (currentWords.includes(word)) {
                return currentWords.filter(s => s !== word).join(', ');
            } else {
                return (currentWords.length > 0 ? prev + ', ' : '') + word;
            }
        });
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-2xl w-full space-y-6 border border-white/10">
                <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow text-center">✨ AI 文案生成 (json-server 模拟)</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Platform */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">平台 (Platform):</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            required
                        >
                            <option value="" disabled className="text-gray-500 bg-white">请选择平台</option>
                            {platformOptions.map(opt => (
                                <option
                                    key={opt}
                                    value={opt}
                                    className="text-gray-900 bg-white"
                                    style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}
                                >
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Words Limit */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">字数限制 (Words Limit):</label>
                        <input
                            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-500 text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            type="number"
                            placeholder="例如：100"
                            value={wordsLimit}
                            onChange={(e) => setWordsLimit(e.target.value)}
                            required
                        />
                    </div>

                    {/* Tone */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">语调 (Tone):</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            required
                        >
                            <option value="" disabled className="text-gray-500 bg-white">请选择语调</option>
                            {toneOptions.map(opt => (
                                <option key={opt} value={opt} className="text-gray-900 bg-white" style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Hook Type */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">钩子类型 (Hook Type):</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={hookType}
                            onChange={(e) => setHookType(e.target.value)}
                            required
                        >
                            <option value="" disabled className="text-gray-500 bg-white">请选择钩子类型</option>
                            {hookTypeOptions.map(opt => (
                                <option key={opt} value={opt} className="text-gray-900 bg-white" style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Include Emoji */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">包含表情符号 (Include Emoji):</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={includeEmoji}
                            onChange={(e) => setIncludeEmoji(e.target.value)}
                            required
                        >
                            <option value="true" className="text-gray-900 bg-white" style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}>是 (true)</option>
                            <option value="false" className="text-gray-900 bg-white" style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}>否 (false)</option>
                        </select>
                    </div>

                    {/* Emoji Level */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">表情符号级别 (Emoji Level):</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={emojiLevel}
                            onChange={(e) => setEmojiLevel(e.target.value)}
                            required
                        >
                            <option value="" disabled className="text-gray-500 bg-white">请选择级别</option>
                            {emojiLevelOptions.map(opt => (
                                <option key={opt} value={opt} className="text-gray-900 bg-white" style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Power Words Section */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">力量词 (Power Words) - 逗号分隔:</label>
                        <input
                            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-500 text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            type="text"
                            placeholder="例如：All-in-one,Don’t miss"
                            value={powerWords}
                            onChange={(e) => setPowerWords(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            提示：可以从下方列表中选择或手动输入，多个词请用逗号分隔。
                        </p>
                        <div className="space-y-4">
                            {powerWordCategories.map((categoryData, index) => (
                                <div key={index}>
                                    <h4 className="text-white text-sm font-semibold mb-2 mt-3">{categoryData.category}:</h4>
                                    <div className="flex flex-row overflow-x-auto pb-2 custom-scrollbar-horizontal">
                                        {categoryData.words.map(word => (
                                            <span
                                                key={word}
                                                className={`
                                                    inline-flex justify-center items-center
                                                    px-4 py-2 mr-2 rounded-full text-sm cursor-pointer transition
                                                    ${powerWords.split(',').map(s => s.trim()).filter(Boolean).includes(word)
                                                        ? 'bg-cyan-600 text-white'
                                                        : 'bg-white/10 hover:bg-cyan-600 hover:text-white text-gray-300'
                                                    }
                                                    min-w-max
                                                    whitespace-nowrap
                                                `}
                                                onClick={() => handlePowerWordClick(word)}
                                            >
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Hashtag Seeds - 自定义实现 */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">话题标签种子 (Hashtag Seeds):</label>
                        <div className="flex flex-wrap gap-2 mb-2 p-2 rounded-lg bg-white/10 border border-white/30 min-h-[40px] items-center">
                            {hashtagSeeds.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveHashtag(tag)}
                                        className="ml-2 text-white hover:text-gray-200 cursor-pointer focus:outline-none"
                                        aria-label={`Remove tag ${tag}`}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                            <input
                                className="flex-grow p-1 bg-transparent text-white placeholder-gray-400 focus:outline-none min-w-[200px]" // 再次增加 min-w 确保显示完全
                                type="text"
                                placeholder={hashtagSeeds.length === 0 ? "输入标签并按回车键分隔" : ""} // 修正: 提示语
                                value={currentHashtagInput}
                                onChange={handleHashtagInputChange}
                                onKeyDown={handleHashtagInputKeyDown}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            提示：输入一个标签后按回车键自动分隔，并自动添加 #。
                        </p>
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">语言 (Language):</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            required
                        >
                            <option value="" disabled className="text-gray-500 bg-white">请选择语言</option>
                            {languageOptions.map(opt => (
                                <option key={opt} value={opt} className="text-gray-900 bg-white" style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transition duration-200 ease-in-out"
                        >
                            保存并生成文案 (Save & Generate)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Copywriting;