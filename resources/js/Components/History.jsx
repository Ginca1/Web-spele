import React, { useState, useEffect } from 'react';


const History = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [gameHistory, setGameHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedContinent, setSelectedContinent] = useState(null); // Changed from 'all' to null
    const rewardSound = new Audio('/sounds/reward.mp3');

    const togglePopup = async () => {
        if (!showPopup) {
            await fetchHistory();
        }
        setShowPopup(!showPopup);
        rewardSound.play();
    };

    const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/game-history', {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                credentials: 'include'
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                } catch (e) {
                    throw new Error(errorText || `HTTP error! status: ${response.status}`);
                }
            }
    
            const data = await response.json();
            
            if (Array.isArray(data)) {
                const sortedData = data.sort((a, b) => 
                    new Date(b.completed_at) - new Date(a.completed_at)
                );
                setGameHistory(sortedData);
                setFilteredHistory(sortedData); // Initially show all games
            } else if (data && data.success !== undefined) {
                const sortedData = (data.data || []).sort((a, b) => 
                    new Date(b.completed_at) - new Date(a.completed_at)
                );
                setGameHistory(sortedData);
                setFilteredHistory(sortedData);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error('Error fetching game history:', error);
            setError(error.message || 'Failed to load game history. Please try again.');
            setGameHistory([]);
            setFilteredHistory([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filterByContinent = (continent) => {
        // Store current sort value
        const sortSelect = document.querySelector('select');
        const currentSort = sortSelect ? sortSelect.value : 'newest';
        rewardSound.play();
        // Filter logic...
        let filtered = [];
        if (continent === null) {
            filtered = [...gameHistory];
        } else if (continent === 'all') {
            filtered = gameHistory.filter(game => game.game_type.toLowerCase() === 'all');
        } else {
            filtered = gameHistory.filter(game => game.game_type.toLowerCase() === continent.toLowerCase());
        }
    
        // Apply current sort to filtered results
        const sorted = sortGames(filtered, currentSort);
        setFilteredHistory(sorted);
        setSelectedContinent(continent);
    };
    
    // Helper function for sorting
    const sortGames = (games, sortType) => {
        switch(sortType) {
            case 'points-high':
                return [...games].sort((a, b) => b.score - a.score);
            case 'points-low':
                return [...games].sort((a, b) => a.score - b.score);
            case 'time-fast':
                return [...games].sort((a, b) => a.time_played - b.time_played);
            case 'time-slow':
                return [...games].sort((a, b) => b.time_played - a.time_played);
            case 'newest':
            default:
                return [...games].sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('lv-LV', options);
    };
     //s dsdss gg s sdsd s
    const translateGameType = (gameType) => {
        switch(gameType.toLowerCase()) {
            case 'europe':
                return 'Eiropa';
            case 'america':
                return 'Amerikas';
            case 'asia':
                return 'Āzija un Okeānija';
            case 'africa':
                return 'Āfrika';
            case 'all':
                return 'Visi kontinenti';
            default:
                return gameType.toUpperCase();
        }
    };

    const getGameTypeGradient = (gameType) => {
        switch(gameType.toLowerCase()) {
            case 'europe':
                return 'bg-gradient-to-r from-[#5de400] to-[#1ef184]'; 
            case 'america':
                return 'bg-gradient-to-r from-[#ffbd00] to-[#f0831e]'; 
            case 'asia':
                return 'bg-gradient-to-r from-[#ff0000] to-[#f7325c]'; 
            case 'africa':
                return 'bg-gradient-to-r from-[#bd00ff] to-[#5c32f7]'; 
            case 'all':
                return 'bg-gradient-to-r from-[#ff00e8] to-[#b832f7]'; 
            default:
                return 'bg-gradient-to-r from-green-200 to-green-300';
        }
    };

    return (
        <>
            <div className="history" onClick={togglePopup}></div>
            
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[2000]">
                    <div className="bg-[#F8FAFC] w-[70vw] h-full max-h-[90vh] p-5 rounded-lg shadow-lg relative text-center overflow-hidden flex flex-col z-[2001]">

                        <img
                            src="../images/icons/close.png"
                            alt="Close"
                            onClick={togglePopup}
                            className="w-9 h-9 object-contain absolute top-2 right-2 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 hover:rotate-6"
                        />

                        <div className="flex flex-row justify-center items-center flex-wrap w-full">
                             <img  src="../images/icons/star.png" className="inline-block animate-spin-slow mr-3 w-10 h-10" />
                            <div className="text-center">
                                <div className="settings-T">Vēsture</div>
                            </div>
                            <img  src="../images/icons/star.png" className="inline-block animate-spin-slow-reverse w-10 h-10 ml-3 " />
                        </div>

                        <div className="flex flex-row justify-center items-center gap-2 flex-wrap w-full mt-2">
                            <button 
                                onClick={() => filterByContinent(null)}
                                className={`font-bold ht bg-gray-300 text-gray-800 rounded-md shadow-md px-2 text-xl transition-all duration-300 ${
                                    !selectedContinent 
                                        ? 'ring-2 ring-blue-500 scale-105 animate-pulse-once' 
                                        : 'opacity-90 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                                Jaunākie
                            </button>
                            <button 
                                onClick={() => filterByContinent('europe')}
                                className={`font-bold ht bg-gradient-to-r from-[#5de400] to-[#1ef184] text-white rounded-md shadow-md px-2 text-xl transition-all duration-300 ${
                                    selectedContinent === 'europe' 
                                        ? 'ring-2 ring-blue-500 scale-105 animate-pulse-once' 
                                        : 'opacity-90 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                                Eiropa
                            </button>
                            <button 
                                onClick={() => filterByContinent('america')}
                                className={`font-bold ht bg-gradient-to-r from-[#ffbd00] to-[#f0831e] text-white rounded-md shadow-md px-2 text-xl transition-all duration-300 ${
                                    selectedContinent === 'america' 
                                        ? 'ring-2 ring-blue-500 scale-105 animate-pulse-once' 
                                        : 'opacity-90 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                                Amerika
                            </button>
                            <button 
                                onClick={() => filterByContinent('asia')}
                                className={`font-bold ht bg-gradient-to-r from-[#ff0000] to-[#f7325c] text-white rounded-md shadow-md px-2 text-xl transition-all duration-300 ${
                                    selectedContinent === 'asia' 
                                        ? 'ring-2 ring-blue-500 scale-105 animate-pulse-once' 
                                        : 'opacity-90 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                                Āzija un Okeānija
                            </button>
                            <button 
                                onClick={() => filterByContinent('africa')}
                                className={`font-bold ht bg-gradient-to-r from-[#bd00ff] to-[#5c32f7] text-white rounded-md shadow-md px-2 text-xl transition-all duration-300 ${
                                    selectedContinent === 'africa' 
                                        ? 'ring-2 ring-blue-500 scale-105 animate-pulse-once' 
                                        : 'opacity-90 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                                Āfrika
                            </button>
                            <button 
                                onClick={() => filterByContinent('all')}
                                className={`font-bold ht bg-gradient-to-r from-[#ff00e8] to-[#b832f7] text-white rounded-md shadow-md px-2 text-xl transition-all duration-300 ${
                                    selectedContinent === 'all' 
                                        ? 'ring-2 ring-blue-500 scale-105 animate-pulse-once' 
                                        : 'opacity-90 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                                Visi kontinenti
                            </button>
                        </div>

                        <div className="flex flex-row justify-end items-center px-10 gap-2 mt-4">
                            <div className="relative group w-45 mr-[3.2%]">
                                <select 
                                    className="appearance-none bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg shadow-sm pl-3 pr-8 
                                    py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 
                                    focus:border-gray-400 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 
                                    cursor-pointer w-full"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'points-high') {
                                            setFilteredHistory([...filteredHistory].sort((a, b) => b.score - a.score));
                                        } else if (value === 'points-low') {
                                            setFilteredHistory([...filteredHistory].sort((a, b) => a.score - b.score));
                                        } else if (value === 'time-fast') {
                                            setFilteredHistory([...filteredHistory].sort((a, b) => a.time_played - b.time_played));
                                        } else if (value === 'time-slow') {
                                            setFilteredHistory([...filteredHistory].sort((a, b) => b.time_played - a.time_played));
                                        } else {
                                            setFilteredHistory([...filteredHistory].sort((a, b) => 
                                                new Date(b.completed_at) - new Date(a.completed_at)
                                            ));
                                        }
                                    }}
                                >
                                    <option value="newest" className="text-gray-700 font-semibold py-1.5 hover:bg-gray-100">Jaunākās spēles</option>
                                    <option value="points-high" className="text-gray-700 font-semibold py-1.5 hover:bg-gray-100">Visvairāk punkti</option>
                                    <option value="points-low" className="text-gray-700 font-semibold py-1.5 hover:bg-gray-100">Vismazāk punkti</option>
                                    <option value="time-fast" className="text-gray-700 font-semibold py-1.5 hover:bg-gray-100">Ātrākais laiks</option>
                                    <option value="time-slow" className="text-gray-700 font-semibold py-1.5 hover:bg-gray-100">Lēnākais laiks</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>


        
                        <div className="flex-1 flex flex-col overflow-hidden mt-3">
                            <div className="flex-1 overflow-auto custom-scrollbar bg-[#eeeeee] rounded-xl p-6 pt-10">
                                {isLoading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : error ? (
                                        <div className="flex justify-center items-center h-full">
                                            <p className="text-red-500">{error}</p>
                                        </div>
                                    ) : filteredHistory.length === 0 ? (
                                        <div className="flex justify-center items-center h-full">
                                            <p>Nav spēļu vēstures {selectedContinent ? `priekš ${translateGameType(selectedContinent)}` : ''}</p>
                                        </div>
                                    ) : (
                                    <div className="space-y-4">
                                        {filteredHistory.map((game) => (
                                            <div key={game.id} className="bg-white p-4 rounded-lg shadow">
                                                <div className="flex justify-between items-center mb-2">
                                                <h3 className={`font-bold ht text-white ${getGameTypeGradient(game.game_type)} rounded-md shadow-md px-2 text-xl`}>
                                        {translateGameType(game.game_type)}
                                    </h3>
                                                    <span className="text-sm bg-orange-200 rounded-md p-1 shadow-md font-semibold">{formatDate(game.completed_at)}</span>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                                                <div>
                                                    <p className="finish text-white text-md font-semibold">Laiks</p>
                                                    <div className="flex items-center ml-3 mt-1 justify-center gap-1">
                                                        <p className="ena2 text-white font-mono font-bold">{formatTime(game.time_played)}</p>
                                                        <img
                                                            src="/images/icons/clock.png"
                                                            alt="clock"
                                                            className="w-[1rem] h-[1rem] object-contain"
                                                        />
                                                    </div>
                                                </div>
                                        <div>
                                            <p className="finish text-white text-md font-semibold">Punkti</p>
                                            <div className="flex justify-center items-center mt-1">
                                                <div className="relative w-20 h-20"> {/* s */}
                                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                                        <defs>
                                                            <linearGradient id="punktiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" style={{ stopColor: "#32f60f", stopOpacity: 1 }} />
                                                                <stop offset="100%" style={{ stopColor: "#1e90ff", stopOpacity: 1 }} />
                                                            </linearGradient>
                                                        </defs>
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#b6b4b3" strokeWidth="8"/>
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#a9a9a9" strokeWidth="10" opacity="0.3"/>
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#punktiGradient)" strokeWidth="8"
                                                            strokeLinecap="round" strokeDasharray={`${(game.score / game.total_countries) * 283} 283`}
                                                            transform="rotate(-90 50 50)"/>
                                                    </svg>

                                                    <div className="absolute font-mono inset-0 flex flex-col items-center justify-center">
                                                        <p className="text-md ena2 font-bold text-[#32f60f]">{game.score}/{game.total_countries}</p>
                                                        <p className="text-xs ena2 font-semibold text-[#32f60f]">
                                                            {((game.score / game.total_countries) * 100).toFixed(1)} %
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="finish text-white text-md font-semibold">Pareizās atbildes</p>
                                            <div className="flex justify-center mt-1 items-center">
                                                <div className="relative w-20 h-20">
                                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                                        <defs>
                                                            <linearGradient id="correctGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" style={{ stopColor: "#ff6347", stopOpacity: 1 }} />  
                                                                <stop offset="50%" style={{ stopColor: "#ffa500", stopOpacity: 1 }} />  
                                                                <stop offset="100%" style={{ stopColor: "#32cd32", stopOpacity: 1 }} />
                                                            </linearGradient>
                                                        </defs>
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#b6b4b3" strokeWidth="8" />
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#a9a9a9" strokeWidth="10" opacity="0.3" />
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#correctGradient)" strokeWidth="8"
                                                            strokeLinecap="round" strokeDasharray={`${(game.correct_guesses / game.total_countries) * 283} 283`}
                                                            transform="rotate(-90 50 50)"/>
                                                    </svg>

                                                    <div className="absolute font-mono inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-md font-bold ena2 text-[#ff6347]">
                                                            {game.correct_guesses}/{game.total_countries}
                                                        </span>
                                                        <span className="text-xs ena2 font-semibold text-[#ff6347]">
                                                            {((game.correct_guesses / game.total_countries) * 100).toFixed(1)} %
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                                    <div>
                                                        <p className="finish text-white text-md font-semibold">Atlīdzība</p>
                                                        <div className="flex flex-row mt-1 font-mono items-center font-bold justify-center gap-2">
                                                        <div className="flex items-center ena2 gap-1">
                                                            <span className="text-[#3eff00] font-semibold">{game.earned_xp}</span>
                                                            <img
                                                                src="/images/icons/xp.png"
                                                                alt="XP"
                                                                className="w-5 h-5 object-contain"
                                                            />
                                                        </div> 
                                                        +
                                                        <div className="flex items-center ena2 gap-1">
                                                            <span className="text-[#ffff00] font-semibold">{game.earned_coins}</span>
                                                            <img
                                                                src="/images/icons/coin.png"
                                                                alt="Coin"
                                                                className="w-4 h-4 object-contain"
                                                            />
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-6 flex justify-between font-semibold text-xs font-mono">
                                                    <span className="bg-blue-200 p-1 rounded-md flex items-center gap-1 ">Karogi: {game.flags_used}
                                                        <img
                                                            src="/images/hint.png" 
                                                            alt="Skip"
                                                            className="w-[1rem] h-[1rem] object-contain"
                                                        />
                                                    </span>
                                                    <span className="bg-blue-200 p-1 rounded-md flex items-center gap-1 ">Lēcieni: {game.skips_used}
                                                        <img
                                                            src="/images/icons/skip.png"
                                                            alt="Skip"
                                                            className="w-[1rem] h-[1rem] object-contain"
                                                        />
                                                    </span>
                                                    <span className="bg-blue-200 p-1 rounded-md flex items-center gap-1 ">Padomi: {game.hints_used} 
                                                        <img
                                                            src="/images/icons/flag.png"
                                                            alt="Skip"
                                                            className="w-[1rem] h-[1rem] object-contain"/> 
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default History;