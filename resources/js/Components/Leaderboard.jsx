import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('level'); // 'level' or 'coins'

    const pictureMap = {
        1: '/images/dog.png',
        2: '/images/cat.png',
        3: '/images/frog.png',
        4: '/images/antilope.png',
        5: '/images/horse.png',
        6: '/images/lion.png',
        7: '/images/tiger.png',
        8: '/images/snake.png',
        9: '/images/deer.png',
    };

    const formatXP = (xp) => {
        const xpNum = Number(xp);
        if (xpNum >= 1000000) {
            return `${(xpNum / 1000000).toFixed(1)}M`;
        }
        if (xpNum >= 1000) {
            return `${(xpNum / 1000).toFixed(1)}k`;
        }
        return xpNum.toString();
    };

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/leaderboard', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
    
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
            }
    
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
    
            if (!data || !Array.isArray(data.users)) {
                throw new Error('Invalid leaderboard data');
            }
    
            // Sort users based on selected option
            const sortedUsers = [...data.users].sort((a, b) => {
                if (sortBy === 'coins') {
                    return b.coins - a.coins;
                } else { // default sort by level
                    if (b.level !== a.level) return b.level - a.level;
                    return b.xp - a.xp;
                }
            });
    
            setUsers(sortedUsers);
        } catch (err) {
            setError(err.message || 'Failed to load leaderboard');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const togglePopup = async () => {
        if (!showPopup) {
            await fetchLeaderboard();
        }
        setShowPopup(!showPopup);
    };

    useEffect(() => {
        if (showPopup && users.length > 0) {
            // Re-sort when sortBy changes
            const sorted = [...users].sort((a, b) => {
                if (sortBy === 'coins') {
                    return b.coins - a.coins;
                } else {
                    if (b.level !== a.level) return b.level - a.level;
                    return b.xp - a.xp;
                }
            });
            setUsers(sorted);
        }
    }, [sortBy]);

    return (
        <>
            <div className="leaderboard" onClick={togglePopup}></div>
    
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[2000]">
                    <div className="bg-[#F8FAFC] w-[70vw] h-full max-h-[90vh] p-5 rounded-lg shadow-lg relative text-center overflow-hidden flex flex-col z-[2001]">
                        {/* Close button and header */}
                        <img
                            src="/images/icons/close.png"
                            alt="Close"
                            onClick={togglePopup}
                            className="w-9 h-9 object-contain absolute top-2 right-2 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 hover:rotate-6"
                        />
                        
                        <div className="flex flex-row justify-center items-center flex-wrap w-full">
                            <img src="/images/icons/star.png" className="inline-block animate-spin-slow mr-3 w-10 h-10" />
                            <div className="text-center">
                                <div className="settings-T">Līderu saraksts</div>
                            </div>
                            <img src="/images/icons/star.png" className="inline-block animate-spin-slow-reverse w-10 h-10 ml-3" />
                        </div>
                        
                        {/* Sorting dropdown */}
                        <div className="flex justify-center mt-4">
                            <div className="relative group w-52">
                                <select
                                        value={sortBy}
                                        onChange={handleSortChange}
                                        className="appearance-none bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg shadow-sm pl-3 pr-8 
                                        py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 
                                        focus:border-gray-400 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 
                                        cursor-pointer w-full">
                                        <option value="level" className="text-gray-700 font-semibold py-1.5 hover:bg-gray-100">Pēc Līmeņa</option>
                                        <option value="coins" className="text-gray-700 font-semibold py-1.5 hover:bg-gray-100">Pēc Monētām</option>
                                </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            </div>

                        
                        {/* Scrollable container */}
                        <div className="flex-1 flex flex-col overflow-hidden mt-3">
                            <div className="flex-1 overflow-auto custom-scrollbar bg-[#eeeeee] rounded-xl p-6 pt-10">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : error ? (
                                    <div className="text-red-500">{error}</div>
                                ) : users.length === 0 ? (
                                    <div className="text-gray-500">Nav datu par līderiem</div>
                                ) : (
                                    <>
                                        {/* Podium section */}
                                        {users.length >= 3 && (
                                            <div className="flex justify-center items-end h-[28rem] mb-10 gap-6">
                                                {/* 2nd Place */}
                                                <div className="flex flex-col items-center w-1/4">
                                                    <img 
                                                        src="/images/icons/2nd-place.png" 
                                                        className="w-16 h-16"
                                                        alt="2nd place" 
                                                    />
                                                    <div className="bg-silver h-[19rem] w-full rounded-t-lg flex flex-col items-center justify-center pb-6 shadow-lg">
                                                        <div 
                                                            className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-3 bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${pictureMap[users[1].picture_id] || pictureMap[1]})` }}
                                                            aria-label={`${users[1].name}'s avatar`}
                                                        />
                                                        <h3 className="font-bold text-3xl name2 text-white">{users[1].name}</h3>
                                                        <div className="text-center text-gray-600 text-lg mt-2">
                                                            <p className="flex items-center font-semibold finish text-white">
                                                                {users[1].level} Līmenis  
                                                                <img 
                                                                    src="/images/icons/level.png" 
                                                                    alt="Level" 
                                                                    className="w-[1.5rem] h-[1.5rem] object-contain ml-2 mb-2"
                                                                />
                                                            </p>
                                                            <div className="flex flex-row items-center ena2 gap-2">
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-[#3eff00] font-semibold">{formatXP(users[1].xp)}</span>
                                                                    <img
                                                                        src="/images/icons/xp.png"
                                                                        alt="XP"
                                                                        className="w-5 h-5 object-contain"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-[#ffff00] font-semibold">{users[1].coins}</span>
                                                                    <img
                                                                        src="/images/icons/coin.png"
                                                                        alt="Coins"
                                                                        className="w-5 h-5 object-contain"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* 1st Place */}
                                                <div className="flex flex-col items-center w-1/3 ">
                                                    <img 
                                                        src="/images/icons/1st-prize.png" 
                                                        className="w-20 h-20"
                                                        alt="1st place" 
                                                    />
                                                    <div className="bg-gold h-[24rem] w-full rounded-t-lg flex flex-col items-center justify-center pb-8 shadow-xl">
                                                        <div 
                                                            className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-4 bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${pictureMap[users[0].picture_id] || pictureMap[1]})` }}
                                                            aria-label={`${users[0].name}'s avatar`}
                                                        />
                                                        <h3 className="font-bold text-3xl name2 text-white">{users[0].name}</h3>
                                                        <div className="text-center text-gray-600 text-lg mt-2">
                                                            <p className="flex items-center font-semibold finish text-white">
                                                                {users[0].level} Līmenis  
                                                                <img 
                                                                    src="/images/icons/level.png" 
                                                                    alt="Level" 
                                                                    className="w-[1.5rem] h-[1.5rem] object-contain ml-2 mb-2"
                                                                />
                                                            </p>
                                                            <div className="flex flex-row items-center ena2 gap-2">
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-[#3eff00] font-semibold">{formatXP(users[0].xp)}</span>
                                                                    <img
                                                                        src="/images/icons/xp.png"
                                                                        alt="XP"
                                                                        className="w-5 h-5 object-contain"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-[#ffff00] font-semibold">{users[0].coins}</span>
                                                                    <img
                                                                        src="/images/icons/coin.png"
                                                                        alt="Coins"
                                                                        className="w-5 h-5 object-contain"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* 3rd Place */}
                                                <div className="flex flex-col items-center w-1/4">
                                                    <img 
                                                        src="/images/icons/3rd-place.png" 
                                                        className="w-16 h-16"
                                                        alt="3rd place" 
                                                    />
                                                    <div className="bg-bronze h-[14rem] w-full rounded-t-lg flex flex-col items-center justify-center pb-4 shadow-lg">
                                                        <div 
                                                            className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mb-2 bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${pictureMap[users[2].picture_id] || pictureMap[1]})` }}
                                                            aria-label={`${users[2].name}'s avatar`}
                                                        />
                                                        <h3 className="font-bold text-3xl name2 text-white">{users[2].name}</h3>
                                                        <div className="text-center text-gray-600 text-lg mt-2">
                                                            <p className="flex items-center font-semibold finish text-white">
                                                                {users[2].level} Līmenis  
                                                                <img 
                                                                    src="/images/icons/level.png" 
                                                                    alt="Level" 
                                                                    className="w-[1.5rem] h-[1.5rem] object-contain ml-2 mb-2"
                                                                />
                                                            </p>
                                                            <div className="flex flex-row items-center ena2 gap-2">
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-[#3eff00] font-semibold">{formatXP(users[2].xp)}</span>
                                                                    <img
                                                                        src="/images/icons/xp.png"
                                                                        alt="XP"
                                                                        className="w-5 h-5 object-contain"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-[#ffff00] font-semibold">{users[2].coins}</span>
                                                                    <img
                                                                        src="/images/icons/coin.png"
                                                                        alt="Coins"
                                                                        className="w-5 h-5 object-contain"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Rest of the leaderboard */}
                                        <div className="space-y-3">
                                            {users.slice(users.length >= 3 ? 3 : 0).map((user, index) => (
                                                <div key={user.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-bold w-6 text-center">{index + (users.length >= 3 ? 4 : 1)}</span>
                                                        <div 
                                                            className="w-10 h-10 bg-gray-200 rounded-full bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${pictureMap[user.picture_id] || pictureMap[1]})` }}
                                                            aria-label={`${user.name}'s avatar`}
                                                        />
                                                        <div className="flex items-center gap-4">
                                                            <h3 className="font-medium text-xl name2 text-white">{user.name}</h3>
                                                            <span className="text-[#f90a0a] finish font-bold"> | </span> 
                                                            <span className="flex items-center font-semibold pt-1 lv ena2 text-white">
                                                                {user.level} Līmenis
                                                                <img 
                                                                    src="/images/icons/level.png" 
                                                                    alt="Level" 
                                                                    className="w-[1.3rem] h-[1.3rem] object-contain ml-2"
                                                                />
                                                            </span>
                                                            <span className="text-[#f90a0a] finish font-bold"> | </span> 
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-[#3eff00] text-md ena2 font-semibold">{formatXP(user.xp)}</span>
                                                                <img
                                                                    src="/images/icons/xp.png"
                                                                    alt="XP"
                                                                    className="w-5 h-5 object-contain"
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-[#ffff00] text-md ena2 font-semibold">{user.coins}</span>
                                                                <img
                                                                    src="/images/icons/coin.png"
                                                                    alt="Coins"
                                                                    className="w-5 h-5 object-contain"
                                                                />
                                                            </div>
                                                            <span className="text-[#f90a0a] finish font-bold"> | </span> 
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Leaderboard;