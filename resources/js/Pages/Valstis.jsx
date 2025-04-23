import React, { useRef, useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IoArrowBackCircleSharp, IoChevronForwardCircleSharp, IoChevronBackCircleSharp } from "react-icons/io5";
import axios from 'axios';
import { router } from '@inertiajs/react';

const Valstis = () => {
    const scrollContainerRef = useRef(null);
    const [bestScores, setBestScores] = useState({
        europe: { score: 0, total: 50 },
        america: { score: 0, total: 35 },
        asia: { score: 0, total: 48 },
        africa: { score: 0, total: 54 },
        all: { score: 0, total: 197 }
    });
    const [loading, setLoading] = useState(true);
    const rewardSound = new Audio('/sounds/reward.mp3');

    useEffect(() => {
        const fetchBestScores = async () => {
            try {
                const response = await axios.get('/game-history');
                const gameResults = response.data;

                // Calculate best scores for each continent
                const scores = {
                    europe: calculateBestScore(gameResults, 'europe'),
                    america: calculateBestScore(gameResults, 'america'),
                    asia: calculateBestScore(gameResults, 'asia'),
                    africa: calculateBestScore(gameResults, 'africa'),
                    all: calculateBestScore(gameResults, 'all')
                };

                setBestScores(scores);
            } catch (error) {
                console.error('Error fetching game history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBestScores();
    }, []);

    const calculateBestScore = (gameResults, gameType) => {
        // Filter games by type and get the one with highest s dd bb vv nn m mm
        const filteredGames = gameResults.filter(game => game.game_type === gameType);
        
        if (filteredGames.length === 0) {
            return { score: 0, total: getDefaultTotal(gameType) };
        }

        // Find the game with highest score
        const bestGame = filteredGames.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current
        );

        return {
            score: bestGame.score,
            total: bestGame.total_countries
        };
    };

    const getDefaultTotal = (gameType) => {
        // Default total coun mm hh m mm
        switch(gameType) {
            case 'europe': return 50;
            case 'america': return 35;
            case 'asia': return 48;
            case 'africa': return 54;
            case 'all': return 197;
            default: return 50;
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -350, 
                behavior: 'smooth'
            });
            rewardSound.play();
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 350, 
                behavior: 'smooth'
            });
            rewardSound.play();
        }
    };
    const homeClick = (e) => {
        e.preventDefault(); // Prevent immediate navigation
        rewardSound.play();
        setTimeout(() => {
            router.visit(route('home'));
        }, 300); // Delay can be adjusted as needed
    };

    const ProgressCircle = ({ score, total }) => {
        const percentage = total > 0 ? (score / total) * 283 : 0;
        
        return (
            <div className="relative w-10 h-10">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: "#32f60f", stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: "#1e90ff", stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#b6b4b3" strokeWidth="8" opacity="0.3" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" strokeWidth="8" 
                        strokeLinecap="round" strokeDasharray={`${percentage} 283`} 
                        transform="rotate(-90 50 50)"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs font-bold text-[#32f60f]">
                        {total > 0 ? ((score / total) * 100).toFixed(0) : '0'}%
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="background-container">
            <div className="main">
                <div className="flex justify-between items-center px-4 w-full">
                    <div className="flex flex-row justify-start items-center flex-wrap w-full pl-4"> 
                        <Link href={route('home')} className="game2" 
                            onClick={() => {
                                 const audio = new Audio('/sounds/reward.mp3');
                                audio.play();
                            }}>
                             <span className='text-[3.5rem]'>Ģ</span><span>e</span><span>o</span><span className='text-[3.5rem]'>p</span><span>r</span><span>ā</span><span>t</span><span>s</span>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center flex-wrap w-full mt-[2%]">
                    <div className="bg-[#fdfdfb] w-[90vw] max-w-[1250px] h-auto p-5 rounded-lg min-h-[75vh] shadow-md 
                         relative text-center overflow-hidden flex flex-col z-[2001]">
                        <Head title={`Valstis`} />
                        <div className="flex items-center justify-center relative border-b-2 border-gray-300">
                        <Link 
                                href={route('home')}  
                                onClick={homeClick}
                                className="absolute left-[0px] top-[34%] transform -translate-y-1/2 z-10 
                                        bg-blue-200 bg-opacity-70 rounded-full p-1 shadow-lg 
                                        hover:bg-opacity-100 hover:scale-105 transition-all duration-300">
                                <IoArrowBackCircleSharp className="text-5xl text-[#084fd3]" />
                            </Link>
                            <h1 className="room-title1">Izvēlies Kontinentu</h1>
                        </div>
                      
                        <div className="relative w-full pt-[2.5rem] px-12">
                            {/* Navigation buttons */}
                            <button 
                                onClick={scrollLeft}
                                className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 z-10 bg-blue-200 bg-opacity-70 rounded-full p-1 shadow-lg hover:bg-opacity-100 hover:scale-105"
                            >
                                <IoChevronBackCircleSharp className="text-4xl text-[#084fd3]" />
                            </button>

                            <button 
                                onClick={scrollRight}
                                className="absolute right-[-8px] top-1/2 transform -translate-y-1/2 z-10 bg-blue-200 bg-opacity-70 rounded-full p-1 shadow-lg hover:bg-opacity-100 hover:scale-105"
                            >
                                <IoChevronForwardCircleSharp className="text-4xl text-[#084fd3]" />
                            </button>

                            {/* Scrollable content */}
                            <div 
                                ref={scrollContainerRef}
                                className="flex flex-row items-center justify-start w-full flex-nowrap pt-3 gap-2 max-h-[394px] overflow-x-auto overflow-y-hidden pscroll-smooth snap-x snap-mandatory "
                                style={{ scrollbarWidth: 'none' }}>
                                <style>
                                    {`
                                        .scroll-smooth::-webkit-scrollbar {
                                            display: none;
                                        }
                                    `}
                                </style>

                                {/* Europe */}
                                <Link 
                                    href={route('continent.europe')}
                                    className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 snap-center"
                                    onClick={() => {
                                        const audio = new Audio('/sounds/reward.mp3');
                                        audio.play();
                                    }}                               
                               >
                                    <img
                                        src="/images/Continent/europe.jpg"
                                        alt="Europe"
                                        className="w-[17rem] h-[22rem] object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 group-hover:bg-opacity-30"/>
                                    <div className="absolute top-3 left-3">
                                        <div className="bg-[#aaa9ab] flex items-center bg-opacity-70 px-1 py-0.5 diff justify-center text-sm text-[#5de400] font-semibold rounded">
                                            {loading ? (
                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5de400]"></div>
                                                </div>
                                            ) : (
                                                <div className="relative w-10 h-10">
                                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                                        <defs>
                                                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" style={{ stopColor: "#32f60f", stopOpacity: 1 }} />
                                                                <stop offset="100%" style={{ stopColor: "#1e90ff", stopOpacity: 1 }} />
                                                            </linearGradient>
                                                        </defs>
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#181818" strokeWidth="8" opacity="0.5" />
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" strokeWidth="8" 
                                                            strokeLinecap="round" strokeDasharray={`${(bestScores.europe.score / bestScores.europe.total) * 283} 283`} 
                                                            transform="rotate(-90 50 50)"/>
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <p className="text-[10px] font-bold text-[#32f60f]">
                                                            {bestScores.europe.total > 0 ? ((bestScores.europe.score / bestScores.europe.total) * 100).toFixed(0) : '0'} %
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                      </div>
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-[#aaa9ab] flex items-center bg-opacity-70 px-2 py-1 justify-center diff text-md text-[#5de400] font-semibold rounded">
                                            Viegls
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="font-nunito continent text-3xl font-bold">Eiropa</p>
                                    </div>
                                </Link>

                                {/* Americas */}
                                <Link 
                                    href={route('continent.america')}
                                    className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 snap-center"
                                    onClick={() => {
                                        const audio = new Audio('/sounds/reward.mp3');
                                        audio.play();
                                    }}  
                               >
                                    <img
                                        src="/images/Continent/americas.jpg"
                                        alt="Americas"
                                        className="w-[17rem] h-[22rem] object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
                                    <div className="absolute top-3 left-3">
                                        <div className="bg-[#aaa9ab] flex items-center bg-opacity-70 px-1 py-0.5 diff justify-center text-sm text-[#5de400] font-semibold rounded">
                                            {loading ? (
                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5de400]"></div>
                                                </div>
                                            ) : (
                                                <div className="relative w-10 h-10">
                                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                                        <defs>
                                                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" style={{ stopColor: "#32f60f", stopOpacity: 1 }} />
                                                                <stop offset="100%" style={{ stopColor: "#1e90ff", stopOpacity: 1 }} />
                                                            </linearGradient>
                                                        </defs>
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#181818" strokeWidth="8" opacity="0.5" />
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" strokeWidth="8" 
                                                            strokeLinecap="round" strokeDasharray={`${(bestScores.america.score / bestScores.america.total) * 283} 283`} 
                                                            transform="rotate(-90 50 50)"/>
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <p className="text-[10px] font-bold text-[#32f60f]">
                                                            {bestScores.america.total > 0 ? ((bestScores.america.score / bestScores.america.total) * 100).toFixed(0) : '0'} %
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-[#aaa9ab] flex items-center bg-opacity-70 px-2 py-1 justify-center diff text-md text-[#ffbd00] font-semibold rounded">
                                            Vidējs
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="font-nunito continent text-3xl font-bold">Amerika</p>
                                    </div>
                                </Link>

                                {/* Asia  */}
                                <Link 
                                    href={route('continent.asia')}
                                    className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 snap-center"
                                    onClick={() => {
                                        const audio = new Audio('/sounds/reward.mp3');
                                        audio.play();
                                    }}  
                               >
                                    <img
                                        src="/images/Continent/asia.jpg"
                                        alt="Asia"
                                        className="w-[17rem] h-[22rem] object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
                                    <div className="absolute top-3 left-3">
                                        <div className="bg-[#aaa9ab] flex items-center bg-opacity-70 px-1 py-0.5 diff justify-center text-sm text-[#5de400] font-semibold rounded">
                                            {loading ? (
                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5de400]"></div>
                                                </div>
                                            ) : (
                                                <div className="relative w-10 h-10">
                                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                                        <defs>
                                                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" style={{ stopColor: "#32f60f", stopOpacity: 1 }} />
                                                                <stop offset="100%" style={{ stopColor: "#1e90ff", stopOpacity: 1 }} />
                                                            </linearGradient>
                                                        </defs>
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#181818" strokeWidth="8" opacity="0.5" />
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" strokeWidth="8" 
                                                            strokeLinecap="round" strokeDasharray={`${(bestScores.asia.score / bestScores.asia.total) * 283} 283`} 
                                                            transform="rotate(-90 50 50)"/>
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <p className="text-[10px] font-bold text-[#32f60f]">
                                                            {bestScores.asia.total > 0 ? ((bestScores.asia.score / bestScores.asia.total) * 100).toFixed(0) : '0'} %
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-[#aaa9ab] flex items-center bg-opacity-70 px-2 py-1 justify-center diff text-md text-[#ff0000] font-semibold rounded">
                                            Grūts
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="font-nunito continent text-3xl font-bold">Āzija un Okeānija</p>
                                    </div>
                                </Link>

                                {/* Africa */}
                                <Link 
                                    href={route('continent.africa')}
                                    className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 snap-center"
                                    onClick={() => {
                                        const audio = new Audio('/sounds/reward.mp3');
                                        audio.play();
                                    }}  
                               >
                                    <img
                                        src="/images/Continent/africa.jpg"
                                        alt="Africa"
                                        className="w-[17rem] h-[22rem] object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
                                    <div className="absolute top-3 left-3">
                                        <div className="bg-[#aaa9ab] flex items-center bg-opacity-70 px-1 py-0.5 diff justify-center text-sm text-[#5de400] font-semibold rounded">
                                            {loading ? (
                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5de400]"></div>
                                                </div>
                                            ) : (
                                                <div className="relative w-10 h-10">
                                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                                        <defs>
                                                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" style={{ stopColor: "#32f60f", stopOpacity: 1 }} />
                                                                <stop offset="100%" style={{ stopColor: "#1e90ff", stopOpacity: 1 }} />
                                                            </linearGradient>
                                                        </defs>
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#181818" strokeWidth="8" opacity="0.5" />
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" strokeWidth="8" 
                                                            strokeLinecap="round" strokeDasharray={`${(bestScores.africa.score / bestScores.africa.total) * 283} 283`} 
                                                            transform="rotate(-90 50 50)"/>
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <p className="text-[10px] font-bold text-[#32f60f]">
                                                            {bestScores.africa.total > 0 ? ((bestScores.africa.score / bestScores.africa.total) * 100).toFixed(0) : '0'} %
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-[#aaa9ab] flex items-center bg-opacity-70 px-2 py-1 justify-center diff text-md text-[#bd00ff] font-semibold rounded">
                                            Ļoti grūts
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="font-nunito continent text-3xl font-bold">Āfrika</p>
                                    </div>
                                </Link>

                                {/* All Continents */}
                                <Link 
                                    href={route('continent.all')}
                                    className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-2 flex-shrink-0 snap-center"
                                    onClick={() => {
                                        const audio = new Audio('/sounds/reward.mp3');
                                        audio.play();
                                    }}  
                               >
                                    <img
                                        src="/images/Continent/all.jpg"
                                        alt="All Continents"
                                        className="w-[17rem] h-[22rem] object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
                                    <div className="absolute top-3 left-3">
                                        <div className="bg-[#aaa9ab] flex items-center bg-opacity-70 px-1 py-0.5 diff justify-center text-sm text-[#5de400] font-semibold rounded">
                                            {loading ? (
                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5de400]"></div>
                                                </div>
                                            ) : (
                                                <div className="relative w-10 h-10">
                                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                                        <defs>
                                                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" style={{ stopColor: "#32f60f", stopOpacity: 1 }} />
                                                                <stop offset="100%" style={{ stopColor: "#1e90ff", stopOpacity: 1 }} />
                                                            </linearGradient>
                                                        </defs>
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#181818" strokeWidth="8" opacity="0.5" />
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" strokeWidth="8" 
                                                            strokeLinecap="round" strokeDasharray={`${(bestScores.all.score / bestScores.all.total) * 283} 283`} 
                                                            transform="rotate(-90 50 50)"/>
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <p className="text-[10px] font-bold text-[#32f60f]">
                                                            {bestScores.all.total > 0 ? ((bestScores.all.score / bestScores.all.total) * 100).toFixed(0) : '0'} %
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-[#aaa9ab] flex items-center bg-opacity-70 px-2 py-1 justify-center diff text-md text-[#ff00e8] font-semibold rounded">
                                            Super grūts
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="font-nunito continent text-3xl font-bold">Visi kontinenti</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Valstis;