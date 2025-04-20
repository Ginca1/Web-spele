import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            const response = await fetch('/leaderboard', {  
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            // First get the raw response tdd gg vv gg v   bb bb b vv vm
            const responseText = await response.text();
            
            // Try to parse as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON:', responseText);
                throw new Error('Invalid server response format');
            }

            // Check if response has the expected structure
            if (!data || !data.success || !Array.isArray(data.users)) {
                throw new Error(data.message || 'Invalid leaderboard data');
            }

            setUsers(data.users);
        } catch (err) {
            setError(err.message || 'Failed to load leaderboard');
            console.error('Fetch error:', err);
            
            // Debug output
            console.log('Attempting to fetch from /leaderboard as fallback...');
            try {
                const fallbackResponse = await fetch('/leaderboard');
                console.log('Fallback response:', await fallbackResponse.text());
            } catch (fallbackErr) {
                console.error('Fallback fetch failed:', fallbackErr);
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePopup = async () => {
        if (!showPopup) {
            await fetchLeaderboard();
        }
        setShowPopup(!showPopup);
    };

    return (
        <>
            <div className="leaderboard" onClick={togglePopup}></div>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[2000]">
                    <div className="bg-[#F8FAFC] w-[90vw] max-w-[1100px] h-full max-h-[90vh] p-5 rounded-lg shadow-lg relative text-center overflow-hidden flex flex-col z-[2001]">
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
                        
                        <div className="flex flex-col justify-center items-center w-full mt-3">
                            <div className="w-full h-[70vh] bg-[#eeeeee] rounded-xl p-6 pt-10 overflow-y-auto custom-scrollbar">
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
                                        {/* Podium - Only show if we have at least 3 users */}
                                        {users.length >= 3 && (
                                            <div className="flex justify-center items-end h-64 mb-10 gap-4">
                                                {/* 2nd Place */}
                                                <div className="flex flex-col items-center w-1/4">
                                                    <img src="/images/icons/2nd-place.png" className="w-16 h-16" />
                                                    <div className="bg-silver h-40 w-full rounded-t-lg flex flex-col items-center justify-end pb-4 shadow-lg">
                                                        <div 
                                                            className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2 bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${pictureMap[users[1].picture_id] || pictureMap[1]})` }}
                                                        />
                                                        <h3 className="font-bold text-lg">{users[1].name}</h3>
                                                        <p className="text-gray-600">
                                                            Lv. {users[1].level} • {formatXP(users[1].xp)} XP
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {/* 1st Place */}
                                                <div className="flex flex-col items-center w-1/3">
                                                    <img src="/images/icons/1st-prize.png" className="w-16 h-16" />
                                                    <div className="bg-gold h-56 w-full rounded-t-lg flex flex-col items-center justify-end pb-6 shadow-xl">
                                                        <div 
                                                            className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-3 bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${pictureMap[users[0].picture_id] || pictureMap[1]})` }}
                                                        />
                                                        <h3 className="font-bold text-xl">{users[0].name}</h3>
                                                        <p className="text-gray-700 font-medium">
                                                            Lv. {users[0].level} • {formatXP(users[0].xp)} XP
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {/* 3rd Place */}
                                                <div className="flex flex-col items-center w-1/4">
                                                    <img src="/images/icons/3rd-place.png" className="w-16 h-16" />
                                                    <div className="bg-bronze h-32 w-full rounded-t-lg flex flex-col items-center justify-end pb-3 shadow-lg">
                                                        <div 
                                                            className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center mb-2 bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${pictureMap[users[2].picture_id] || pictureMap[1]})` }}
                                                        />
                                                        <h3 className="font-bold">{users[2].name}</h3>
                                                        <p className="text-gray-600 text-sm">
                                                            Lv. {users[2].level} • {formatXP(users[2].xp)} XP
                                                        </p>
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
                                                        />
                                                        <div>
                                                            <h3 className="font-medium">{user.name}</h3>
                                                            <p className="text-gray-500 text-sm">
                                                                Lv. {user.level} • {formatXP(user.xp)} XP
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                                                        Apskatīt
                                                    </button>
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