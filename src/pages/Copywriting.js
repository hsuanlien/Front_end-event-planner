import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Copywriting = () => {
    const navigate = useNavigate();
    const { id, version } = useParams(); // Get the id and version in the URL

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

    const handleIncludeEmojiChange = (value) => { // The value of emojiLevel is automatically updated according to includeEmoji
        setIncludeEmoji(value);
        if (value === 'false') {
            setEmojiLevel('None');
        } else {
            setEmojiLevel(''); // Reset to blank so user selects manually
        }
    };


    const handleHashtagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default behavior

            const newTagText = currentHashtagInput.trim();

            if (newTagText) {
                const formattedTag = newTagText.startsWith('#') ? newTagText : `#${newTagText}`;
                const isDuplicate = hashtagSeeds.some(tag =>
                    tag.toLowerCase().replace(/^#/, '') === formattedTag.toLowerCase().replace(/^#/, '')
                );

                if (!isDuplicate) {
                    setHashtagSeeds(prevTags => [...prevTags, formattedTag]);
                    setCurrentHashtagInput(''); // Clear the input box
                } else {
                    alert("This tag already exists!");
                    setCurrentHashtagInput(''); //Clear the input box
                }
            }
        }
    };

    const handleRemoveHashtag = (tagToRemove) => {
        setHashtagSeeds(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    };

    const formatContentWithHashtags = (content, hashtags = []) => {
        if (!Array.isArray(hashtags) || hashtags.length === 0) {
            return content;
        }
        const formattedTags = hashtags
            .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
            .join(' ');
        return `${content.trim()}\n\n${formattedTags}`;
    };

    const handleSubmit = async (e) => {// post
        e.preventDefault();

        if (!platform || !tone || !hookType || (includeEmoji === 'true' && !emojiLevel)  || !language) {
            alert("Please fill out all required fields (Platform, Tone, Hook Type, Emoji Level, Language).");
            return;
        }

        const token = localStorage.getItem("access_token");

        try {
            const postData = {
            platform,
            words_limit: parseInt(wordsLimit),
            tone,
            hook_type: hookType,
            include_emoji: includeEmoji === 'true',
            //emoji_level: emojiLevel,
            emoji_level: includeEmoji === 'true' ? emojiLevel : "None",
            power_words: powerWords.split(',').map(w => w.trim()).filter(Boolean),
            hashtag_seeds: hashtagSeeds,
            language
        };
            
            const response = await fetch(`https://genai-backend-2gji.onrender.com/ai/generate-social-post/${id}/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(postData)
                    });

            const formattedHashtagSeeds = hashtagSeeds.join(',');
            if (response.ok) {
                        const generatedPosts = await response.json();

                        if (generatedPosts) {
                            alert("Generated successfully!");
                            console.log("生成的文案:", generatedPosts);

                            navigate(`/event/${id}/check-copywriting`, {
                                state: { generatedPosts: generatedPosts.post_list 
                                }
                            });
                        } else {
                            alert("The copy data returned by the backend is empty!");
                            console.warn("Empty generated post from backend");
                        }
                    } else {
                        const errorData = await response.json();
                        alert(`Copy generation failed：${errorData.detail || errorData.message || "server error"}`);
                        console.error("Copywriting generation error:", errorData);
                    }
                } catch (error) {
                    alert("Network error or backend not started");
                    console.error("Network/server error:", error);
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
                <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow text-center">✨ Social media post</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Platform */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">Platform :</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            required
                        >
                            <option value="" disabled className="text-gray-500 bg-white">Choose Platform</option>
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
                        <label className="block text-white text-sm font-bold mb-2">Words Limit :</label>
                        <input
                            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-500 text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            type="number"
                            placeholder="For example：100"
                            value={wordsLimit}
                            onChange={(e) => setWordsLimit(e.target.value)}
                            required
                        />
                    </div>

                    {/* Tone */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">Tone :</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            required
                        >
                            <option value="" disabled className="text-gray-500 bg-white">Choose Tone</option>
                            {toneOptions.map(opt => (
                                <option key={opt} value={opt} className="text-gray-900 bg-white" style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Hook Type */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">Hook Type :</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={hookType}
                            onChange={(e) => setHookType(e.target.value)}
                            required
                        >
                            <option value="" disabled className="text-gray-500 bg-white">Choose Hook Type </option>
                            {hookTypeOptions.map(opt => (
                                <option key={opt} value={opt} className="text-gray-900 bg-white" style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Include Emoji */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">Include Emoji:</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={includeEmoji}
                            //onChange={(e) => setIncludeEmoji(e.target.value)}
                            onChange={(e) => handleIncludeEmojiChange(e.target.value)}
                            required
                        >
                            <option value="true" className="text-gray-900 bg-white" style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}>True</option>
                            <option value="false" className="text-gray-900 bg-white" style={{color: 'rgb(17 24 39)', backgroundColor: 'white'}}>False</option>
                        </select>
                    </div>

                    {/* Emoji Level */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">Emoji Level :</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={emojiLevel}
                            onChange={(e) => setEmojiLevel(e.target.value)}
                            //if choose no includeEmoji -> can not choose level
                            disabled={includeEmoji === 'false'}
                            required={includeEmoji === 'true'}
                        >
                        {includeEmoji === 'true' ? (
                            <>
                                <option value="" disabled className="text-gray-500 bg-white">Choose Emoji Level</option>
                                {emojiLevelOptions.map(opt => (
                                    <option key={opt} value={opt} className="text-gray-900 bg-white">{opt}</option>
                                ))}
                            </>
                        ) : (
                            <option value="None" className="text-gray-900 bg-white">None</option>
                        )}
                        </select>

                    </div>

                    {/* Power Words Section */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">Power Words - Comma separated :</label>
                        <input
                            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-500 text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            type="text"
                            placeholder="For example : All-in-one,Don't miss"
                            value={powerWords}
                            onChange={(e) => setPowerWords(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Tip: You can select from the list below or enter manually. Please separate multiple words with commas.
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
                        <label className="block text-white text-sm font-bold mb-2">Hashtag Seeds :</label>
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
                                placeholder={hashtagSeeds.length === 0 ? "Enter the tags" : ""} // Enter the tags and press Enter to separate them.
                                value={currentHashtagInput}
                                onChange={handleHashtagInputChange}
                                onKeyDown={handleHashtagInputKeyDown}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Tip: After entering a tag, press Enter to automatically separate it and add # automatically.
                        </p>
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2">Language :</label>
                        <select
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            required
                        >
                            <option value="" disabled className="text-gray-500 bg-white">Choose Language</option>
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
                            Save & Generate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Copywriting;