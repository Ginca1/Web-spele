import React, { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { Head, Link } from '@inertiajs/react';
import Level from '../Components/Level';
import EuropeMapPreview from '../Components/EuropeMapPreview';
import AmericaMapPreview from '../Components/AmericaMapPreview';
import AsiaMapPreview from '../Components/AsiaMapPreview';
import AfricaMapPreview from '../Components/AfricaMapPreview';
import AllMapPreview from '../Components/AllMapPreview';
//redt d

const Finish = ({  gameStats: initialGameStats, onClose, user, europePicUrl, europeTopoJSON, americaTopoJSON, asiaTopoJSON, africaTopoJSON,
     allTopoJSON, gameType = 'europe' 
}) => {
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [gameStats, setGameStats] = useState(initialGameStats);
    const [earnedRewards, setEarnedRewards] = useState({
        xp: 0,
        coins: 50 
    });

    const findCountry = (countryName) => {
        return gameStats.countries?.find(c => c.name === countryName);
    };

    const saveResults = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            // First, verify we have a CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }
    
            const payload = {
                totalCountries: gameStats.totalCountries || 0,
                timePlayed: gameStats.timePlayed || 0,
                perfectGuesses: gameStats.perfectGuesses || 0,
                hintsUsed: gameStats.hintsUsed || 0,  
                skipsUsed: gameStats.skipsUsed || 0,  
                flagsUsed: gameStats.flagsUsed || 0,  
                score: gameStats.score || 0,
                correctGuesses: gameStats.correctGuesses || 0,
                incorrectGuesses: gameStats.incorrectGuesses || 0,
                failedCountries: gameStats.failedCountries || [],
                semiCorrectCountries: gameStats.semiCorrectCountries || [],
                perfectCountries: gameStats.perfectCountries || [],
                gameType: gameType,
            };
    
            const response = await fetch('/save-game-results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest' // Helps Laravel identify AJAX requests
                },
                credentials: 'include', // Important for sessions/cookies
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Save failed');
            }
    
            // Update gameStats with the earned XP and coins
            setEarnedRewards({
                xp: data.data.earned_xp || 0,
                coins: data.data.earned_coins || 50
            });
    
            return data;
        } catch (err) {
            console.error('Save failed:', err);
            setSaveError(err.message);
            throw err;
        } finally {
            setSaving(false);
        }
    };
    
    useEffect(() => {
        saveResults();
    }, []);
    
    const handleCloseAndReload = () => {
        onClose(); 
        window.location.reload(); 
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        }
        return `${minutes}m ${secs}s`;
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
            <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-[#F8FAFC] p-6 pb-5 rounded-2xl max-w-[60%] w-full mx-4 max-h-[90vh] flex flex-col"
            >
                {/* Scrollable content area with proper */}
                <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                <h1 className="text-[#ffff00] finish text-3xl font-bold text-center mt-1 mb-6 flex items-center justify-center">
                    <FaStar className="inline-block animate-spin-slow mr-3 text-4xl text-[#ffff00] [&>path]:stroke-black [&>path]:stroke-[10px]" />
                    Bravo tu izvēlējies visas valstis!
                    <FaStar className="inline-block animate-spin-slow-reverse ml-3 text-4xl text-[#ffff00] [&>path]:stroke-black [&>path]:stroke-[10px]" />
                </h1>
                                        
                    {saving && (
                        <div className="text-center text-blue-500 mb-4">
                            Saving your results...
                        </div>
                    )}
                    {saveError && (
                        <div className="text-center text-red-500 mb-4">
                            Error saving: {saveError}
                        </div>
                    )}

                    <div className="bg-[#eeeeee] shadow-md p-4 rounded-xl grid grid-cols-3 gap-4">
                    {/* Left Column - Score Summary */}
                    <div className="col-span-1">
                        <h3 className="text-xl font-bold mb-4 border-b-4 border-[#bd7357] rounded-full font-mono text-[#58392d] pb-2 
                             border-opacity-70">Punktu kopsavilkums</h3>
                        <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: "#32f60f", stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: "#1e90ff", stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#b6b4b3" strokeWidth="8" />
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#a9a9a9" strokeWidth="10" opacity="0.3" />
                                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" strokeWidth="8" 
                                    strokeLinecap="round" strokeDasharray={`${(gameStats.score / gameStats.totalCountries ) * 283} 283`} 
                                    transform="rotate(-90 50 50)"/>
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className={`ena2 font-bold text-[#32f60f] ${gameType === 'all' ? 'md:text-md' : 'text-xl'}`}>
                                    {gameStats.score % 1 === 0 ? gameStats.score.toFixed(0) : gameStats.score.toFixed(1)} / {gameStats.totalCountries}
                                </p>
                                <p className="text-sm ena2 font-semibold text-[#32f60f]">
                                    {((gameStats.score / gameStats.totalCountries) * 100 % 1 === 0 ? 
                                    ((gameStats.score / gameStats.totalCountries) * 100).toFixed(0) : 
                                    ((gameStats.score / gameStats.totalCountries) * 100).toFixed(1))} %
                                </p>
                                </div>
                            </div>
                            </div>
                        <div className="text-right text-sm font-semibold">
                            <p className="text-gray-500">
                                 Pareizās valstis: {gameStats.perfectGuesses} × 1.0 = {gameStats.perfectGuesses * 1.0}
                            </p>
                            <p className="text-gray-500">
                                 Daļēji pareizās valstis: {(gameStats.correctGuesses - gameStats.perfectGuesses)} × 0.5 = {((gameStats.correctGuesses - gameStats.perfectGuesses) * 0.5).toFixed(1)}
                            </p>
                            <p className="text-gray-500">
                                Neveiksmīgās valstis: {gameStats.failedCountries?.length} × 0 = 0
                            </p>
                        </div>
                        </div>
                    </div>

                    {/* Middle Column - User I vhhsds sdsd sdsd */}
                    <div className="col-span-1 flex flex-col items-center justify-center gap-1">
                        <div className="relative">
                            {gameType === 'europe' ? (
                                <img
                                    src="/images/icons/green-banner.png"
                                    alt="Banner"
                                    className="w-[10rem] h-[4rem] object-contain"
                                />
                            ) : gameType === 'asia' ? (
                                <img
                                    src="/images/icons/red-banner.png"
                                    alt="Banner"
                                    className="w-[14rem] h-[4rem] object-contain"
                                />
                            ) : gameType === 'africa' ? (
                                <img
                                    src="/images/icons/purple-banner.png"
                                    alt="Banner"
                                    className="w-[10rem] h-[4rem] object-contain"
                                />
                            ) : gameType === 'all' ? (
                                <img
                                    src="/images/icons/pink-banner.png"
                                    alt="Banner"
                                    className="w-[10rem] h-[4rem] object-contain"
                                />
                            ) : (
                                <img
                                    src="/images/icons/orange-banner.png"
                                    alt="Banner"
                                    className="w-[10rem] h-[4rem] object-contain"
                                />
                            )}

                            <div className="absolute inset-0 top-0.5 flex items-start justify-center z-50">
                                  <h1
                                    className={`europe text-[#f7f7f7] p-4 drop-shadow-lg font-bold ${
                                        gameType === 'europe'
                                            ? 'text-2xl'
                                            : gameType === 'asia'
                                            ? 'text-md mt-1'
                                            : gameType === 'africa'
                                            ? 'text-xl mt-1'
                                            : gameType === 'all'
                                            ? 'text-md mt-1 '
                                            : 'text-2xl'
                                    }`}
                                >
                                    {gameType === 'europe'
                                        ? 'Eiropa'
                                        : gameType === 'asia'
                                        ? 'Āzija un Okeānija'
                                        : gameType === 'africa'
                                        ? 'Āfrika'
                                        : gameType === 'all'
                                        ? 'Visi kontinenti'
                                        : 'Amerika'}
                                </h1>
                            </div>
                        </div>


                        <img
                            src={europePicUrl}
                            alt="Europe"
                            className="w-[70px] h-[70px] rounded-full object-cover shadow-lg"
                        />
                        <span className="name text-white text-2xl  font-semibold">{user.name}</span>
                        <Level />
                        {/* show coins and xp that i got */}
                        <div className="flex flex-row items-center ena2 gap-2">
                            <div className="flex items-center gap-1">
                                <span className="text-[#3eff00] font-semibold">+{earnedRewards.xp}</span>
                                <img
                                    src="/images/icons/xp.png"
                                    alt="XP"
                                    className="w-5 h-5 object-contain"
                                 />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[#ffff00] font-semibold">+{earnedRewards.coins}</span>
                                <img
                                    src="/images/icons/coin.png"
                                    alt="Coin"
                                    className="w-5 h-5 object-contain"
                                 />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-span-1">
                        <h3 className="text-xl font-bold mb-4 border-b-4 border-[#bd7357] rounded-full font-mono text-[#58392d] pb-2 
                        border-opacity-70">Pareizās valstis</h3>
                        <ul className="space-y-2 flex justify-center items-center">
                            <li className="flex justify-between items-center gap-4">
                                <div className="relative w-32 h-32">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="correctGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: "#ff6347", stopOpacity: 1 }} />  
                                        <stop offset="50%" style={{ stopColor: "#ffa500", stopOpacity: 1 }} />  
                                        <stop offset="100%" style={{ stopColor: "#32cd32", stopOpacity: 1 }} />
                                        </linearGradient>
                                        
                                    </defs>
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#b6b4b3" strokeWidth="8"/>
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#a9a9a9" strokeWidth="10" opacity="0.3"/>
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#correctGradient)" strokeWidth="8" 
                                        strokeLinecap="round" strokeDasharray={`${(gameStats.correctGuesses / gameStats.totalCountries) * 283} 283`}
                                        transform="rotate(-90 50 50)"/>
                                    </svg>

                                  

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`ena2 font-bold text-[#ff6347] ${gameType === 'all' ? 'md:text-lg' : 'text-xl'}`}>
                                        {formatNumber(gameStats.correctGuesses)}/{gameStats.totalCountries}
                                    </span>
                                    <span className="text-sm ena2 font-semibold text-[#ff6347]">
                                        {((gameStats.correctGuesses / gameStats.totalCountries) * 100).toFixed(1)} %
                                    </span>
                                </div>
                                </div>
                            </li>
                            </ul>
                    </div>

                    <div className="col-span-3 mt-4">
                        <h3 className="text-xl font-bold mb-2 border-b-4 border-[#bd7357] rounded-full font-mono text-[#58392d] pb-2 
                        border-opacity-70">Mans rezultāts</h3>
                        <div className="bg-white p-2 rounded-lg shadow-md">
                             {gameType === 'europe' ? (
                                <EuropeMapPreview 
                                    europeTopoJSON={europeTopoJSON}
                                    correctlyGuessed={gameStats.perfectCountries} 
                                    semiCorrectGuessed={gameStats.semiCorrectCountries}
                                    failedGuessedCountries={gameStats.failedCountries}
                                    countries={gameStats.countries}
                                />
                            ) : gameType === 'asia' ? (
                                <AsiaMapPreview 
                                    asiaTopoJSON={asiaTopoJSON}
                                    correctlyGuessed={gameStats.perfectCountries} 
                                    semiCorrectGuessed={gameStats.semiCorrectCountries}
                                    failedGuessedCountries={gameStats.failedCountries}
                                    countries={gameStats.countries}
                                />
                            ) : gameType === 'africa' ? (
                                <AfricaMapPreview 
                                    africaTopoJSON={africaTopoJSON}
                                    correctlyGuessed={gameStats.perfectCountries} 
                                    semiCorrectGuessed={gameStats.semiCorrectCountries}
                                    failedGuessedCountries={gameStats.failedCountries}
                                    countries={gameStats.countries}
                                />
                            ) : gameType === 'all' ? (
                                <AllMapPreview 
                                    allTopoJSON={allTopoJSON}
                                    correctlyGuessed={gameStats.perfectCountries} 
                                    semiCorrectGuessed={gameStats.semiCorrectCountries}
                                    failedGuessedCountries={gameStats.failedCountries}
                                    countries={gameStats.countries}
                                />
                            ) : (
                                <AmericaMapPreview 
                                    americaTopoJSON={americaTopoJSON}
                                    correctlyGuessed={gameStats.perfectCountries} 
                                    semiCorrectGuessed={gameStats.semiCorrectCountries}
                                    failedGuessedCountries={gameStats.failedCountries}
                                    countries={gameStats.countries}
                                />
                            )}

                            <div className="flex justify-center mt-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#4CAF50] rounded-sm"></div>
                                    <span className="text-sm font-semibold">Pareizi atminēts</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#FFD700] rounded-sm"></div>
                                    <span className="text-sm font-semibold">Daļēji pareizi</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#FF5733] rounded-sm"></div>
                                    <span className="text-sm font-semibold">Neveiksmīgās</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* add the map preview  from europe.jsx */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
                        {/* Game Stats */}
                        <div className="bg-[#eeeeee] shadow-md p-4 rounded-xl">
                            <h3 className="text-2xl font-bold mb-4 border-b-4 border-[#bd7357] rounded-full font-mono text-[#58392d] pb-2 border-opacity-70">
                                Statistika
                            </h3>
                            <ul className="space-y-2 font-semibold font-mono text-[#7b4d3c] text-md">
                                <li className="flex justify-between">
                                    <span>Laiks:</span>
                                    <span className="flex items-center gap-1">
                                        {formatTime(gameStats.timePlayed)}
                                    <img
                                        src="/images/icons/clock.png"
                                        alt="clock"
                                        className="w-[1rem] h-[1rem] object-contain"
                                    />
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Perfekti izvēlētas valstis:</span>
                                    <span>{formatNumber(gameStats.perfectGuesses)}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Pareizi klikšķi:</span>
                                    <span>
                                    {formatNumber(gameStats.correctGuesses)} <span className="text-xs pr-1">✅</span></span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Nepareizi klikšķi:</span>
                                    <span>
                                    {formatNumber(gameStats.incorrectGuesses)} <span className="text-xs pr-1">❌</span></span>
                                </li>
                            </ul>
                        </div>
    
                        {/* Privileges Used */}
                        <div className="bg-[#eeeeee] shadow-md p-4 rounded-xl">
                        <h3 className="text-2xl font-bold mb-4 border-b-4 border-[#bd7357] rounded-full font-mono text-[#58392d] pb-2 
                        border-opacity-70">
                            Izmantotās privilēģijas
                        </h3>
                        <ul className="space-y-2 font-semibold font-mono text-[#7b4d3c] text-md">
                            <li className="flex justify-between">
                                <span>Padomi izmantoti:</span>
                                <span className="flex items-center gap-1">
                                    {formatNumber(gameStats.hintsUsed || 0)}
                                <img
                                        src="/images/icons/flag.png"
                                        alt="Skip"
                                        className="w-[1rem] h-[1rem] object-contain"
                                    />
                                </span>
                            </li>
                            <li className="flex justify-between">
                                <span>Lēcieni izmantoti:</span>
                                 <span className="flex items-center gap-1">
                                    {formatNumber(gameStats.skipsUsed || 0)}
                                    <img
                                        src="/images/icons/skip.png"
                                        alt="Skip"
                                        className="w-[1rem] h-[1rem] object-contain"
                                    />
                                    </span>
                            </li>
                            <li className="flex justify-between">
                                <span>Karogi izmantoti:</span>
                                <span className="flex items-center gap-1">
                                    {formatNumber(gameStats.flagsUsed || 0)}
                                <img
                                        src="/images/hint.png" 
                                        alt="Skip"
                                        className="w-[1rem] h-[1rem] object-contain"
                                    />
                                </span>
                            </li>
                            <li className="flex justify-between">
                                <span>Pabeigšanas datums:</span>
                                <span className="flex items-center gap-1">
                                    {new Date().toLocaleDateString()}
                                    <img
                                        src="/images/icons/date.png"
                                        alt="Skip"
                                        className="w-[1rem] h-[1rem] object-contain"
                                    />
                                </span>
                            </li>
                        </ul>
                    </div>
                    </div>
    
                    {/* Failed Countries */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {gameStats.failedCountries?.length > 0 && (
                        <div className="bg-[#eeeeee] shadow-md p-4 rounded-xl">
                            <h3 className="text-xl font-bold font-semibold mb-4 border-b-4 border-[#bd7357] rounded-full
                            text-[#58392d] font-mono pb-2 border-opacity-70">
                                Neveiksmīgās valstis
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {gameStats.failedCountries.map((countryName, index) => {
                                    const country = findCountry(countryName);
                                    return country ? (
                                        <div
                                            key={`failed-${index}`}
                                            className="flex items-center gap-1 bg-red-200 px-2 py-1 rounded-md shadow-md"
                                        >
                                            <img
                                                src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                                                alt={`Flag of ${country.name}`}
                                                className="w-6 h-4"
                                            />
                                            <span className="text-[#272524] text-sm font-mono font-semibold">{country.name}</span>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
    
                        {/* Semi-Correct Countries */}
                        {gameStats.semiCorrectCountries?.length > 0 && (
                            <div className="bg-[#eeeeee] shadow-md p-4 rounded-xl">
                                <h3 className="text-xl font-bold font-semibold mb-4 border-b-4 border-[#bd7357] rounded-full
                                text-[#58392d] font-mono pb-2 border-opacity-70">
                                    Daļēji pareizās valstis
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {gameStats.semiCorrectCountries.map((countryName, index) => {
                                        const country = findCountry(countryName);
                                        return country ? (
                                            <div
                                                key={`semi-${index}`}
                                                className="flex items-center gap-1 bg-yellow-200 px-2 py-1 rounded-md shadow-md"
                                            >
                                                <img
                                                    src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                                                    alt={`Flag of ${country.name}`}
                                                    className="w-6 h-4"
                                                />
                                                <span className="text-[#272524] text-sm font-mono font-semibold">{country.name}</span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
    
                    <div className="grid grid-cols-1 gap-6 mb-4">
                      {gameStats.perfectCountries?.length > 0 && (
                        <div className="bg-[#eeeeee] shadow-md p-4 rounded-xl">
                            <h3 className="text-xl font-bold font-semibold mb-4 border-b-4 border-[#bd7357] rounded-full
                            text-[#58392d] font-mono pb-2 border-opacity-70">
                                Pareizās valstis
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {gameStats.perfectCountries.map((countryName, index) => {
                                    const country = findCountry(countryName);
                                    return country ? (
                                        <div
                                            key={`perfect-${index}`}
                                            className="flex items-center gap-1 bg-green-200 px-2 py-1 rounded-md shadow-md"
                                        >
                                            <img
                                                src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                                                alt={`Flag of ${country.name}`}
                                                className="w-6 h-4"
                                            />
                                            <span className="text-[#272524] text-sm font-mono font-semibold">{country.name}</span>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}

                    </div>
                </div>
    
                {/* Fixed button at bottom */}
                <div className="flex justify-center gap-8 pt-4">
                    <Link href={route('lobby.valstis')}>
                        <div className="bg-red-100 rounded-full shadow-md transform transition-all duration-300 ease-out 
                                    hover:scale-110 hover:-rotate-6 active:scale-90">
                            <img 
                                src="/images/icons/exit.png" 
                                alt="Exit" 
                                className="w-14 h-14 cursor-pointer object-contain p-3"
                            />
                        </div>
                    </Link>
                    <div className="bg-blue-100 rounded-full shadow-md transform transition-all duration-300 ease-out 
                                hover:scale-110 hover:rotate-12 active:scale-90">
                        <img 
                            onClick={handleCloseAndReload} 
                            src="/images/icons/refresh.png" 
                            alt="Refresh" 
                            className="w-14 h-14 cursor-pointer object-contain p-2"
                        />
                    </div>
                    </div>



            </motion.div>
        </motion.div>
    );
};

export default Finish;