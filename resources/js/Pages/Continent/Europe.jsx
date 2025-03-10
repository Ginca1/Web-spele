import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";

const europePictureMap = {
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



const Europe = ({ auth }) => {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [currentCountry, setCurrentCountry] = useState(null);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState(null);
    const [countries, setCountries] = useState([]);
    const [europeTopoJSON, setEuropeTopoJSON] = useState(null);
    const [correctlyGuessed, setCorrectlyGuessed] = useState([]); 
   
    const user = auth.user;

    const [userPictureId, setUserPictureId] = useState(null);
    const [europePicUrl, setEuropePicUrl] = useState('');

    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);  
    
    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);

    const [wrongGuessCount, setWrongGuessCount] = useState(0);
    const [failedGuessedCountries, setFailedGuessedCountries] = useState([]);
    const [semiCorrectGuessed, setSemiCorrectGuessed] = useState([]);
    const [autoGuessedCountries, setAutoGuessedCountries] = useState([]);

    const correctSound = new Audio('/sounds/correct.mp3');
    const wrongSound = new Audio('/sounds/error.mp3');
    const failSound = new Audio('/sounds/fail.mp3');
    

    const handleStartGame = () => {
        setIsGameStarted(true);  // Hide the overlay and start the game
        setIsTimerRunning(true);  // Start the timer
    };

    useEffect(() => {
        let timer;
        if (isTimerRunning) {
            timer = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
    
        return () => clearInterval(timer);
    }, [isTimerRunning]);


    useEffect(() => {
        const fetchUserPictureId = async () => {
            try {
                const response = await axios.get('/user/get-user-picture-id', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setUserPictureId(response.data.picture_id);
            } catch (error) {
                console.error('Error fetching user picture ID:', error);
            }
        };

        fetchUserPictureId();
    }, [auth.token]);

    useEffect(() => {
       
        if (userPictureId !== null) {
            setEuropePicUrl(europePictureMap[userPictureId] || '/images/europe1.png');
        }
    }, [userPictureId]);

    useEffect(() => {
        fetch('/data/countries-110m.json')
            .then((response) => response.json())
            .then((data) => setEuropeTopoJSON(data))
            .catch((error) => console.error('Error loading TopoJSON:', error));
    }, []);
    
    useEffect(() => {
        const europeanCountries = [
            { name: 'Albania', coordinates: [20.1683, 41.1533] },
            { name: 'Austria', coordinates: [14.5501, 47.5162] },
            { name: 'Belarus', coordinates: [27.9534, 53.7098] },
            { name: 'Belgium', coordinates: [4.4699, 50.5039] },
            { name: 'Bosnia and Herzegovina', coordinates: [17.6791, 43.9159] },
            { name: 'Bulgaria', coordinates: [25.4858, 42.7339] },
            { name: 'Croatia', coordinates: [15.2, 45.1] },
            { name: 'Cyprus', coordinates: [33.4299, 35.1264] },
            { name: 'Czech Republic', coordinates: [15.473, 49.8175] },
            { name: 'Denmark', coordinates: [9.5018, 56.2639] },
            { name: 'Estonia', coordinates: [25.0136, 58.5953] },
            { name: 'Finland', coordinates: [25.7482, 61.9241] },
            { name: 'France', coordinates: [2.2137, 46.2276] },
            { name: 'Germany', coordinates: [10.4515, 51.1657] },
            { name: 'Greece', coordinates: [21.8243, 39.0742] },
            { name: 'Hungary', coordinates: [19.5033, 47.1625] },
            { name: 'Iceland', coordinates: [-19.0208, 64.9631] },
            { name: 'Ireland', coordinates: [-8.2439, 53.4129] },
            { name: 'Italy', coordinates: [12.5674, 41.8719] },
            { name: 'Kosovo', coordinates: [20.9029, 42.6026] },
            { name: 'Latvia', coordinates: [24.6032, 56.8796] },
            { name: 'Lithuania', coordinates: [23.8813, 55.1694] },
            { name: 'Luxembourg', coordinates: [6.1296, 49.8153] },
            { name: 'Moldova', coordinates: [28.3699, 47.4116] },
            { name: 'Montenegro', coordinates: [19.3744, 42.7087] },
            { name: 'Netherlands', coordinates: [5.2913, 52.1326] },
            { name: 'North Macedonia', coordinates: [21.7453, 41.6086] },
            { name: 'Norway', coordinates: [8.4689, 60.472] },
            { name: 'Poland', coordinates: [19.1451, 51.9194] },
            { name: 'Portugal', coordinates: [-8.2245, 39.3999] },
            { name: 'Romania', coordinates: [24.9668, 45.9432] },
            { name: 'Russia', coordinates: [37.6184, 55.7512] },
            { name: 'Serbia', coordinates: [21.0059, 44.0165] },
            { name: 'Slovakia', coordinates: [19.699, 48.669] },
            { name: 'Slovenia', coordinates: [14.9955, 46.1512] },
            { name: 'Spain', coordinates: [-3.7492, 40.4637] },
            { name: 'Sweden', coordinates: [18.6435, 60.1282] },
            { name: 'Switzerland', coordinates: [8.2275, 46.8182] },
            { name: 'Turkey', coordinates: [35.2433, 38.9637] },
            { name: 'Ukraine', coordinates: [31.1656, 48.3794] },
            { name: 'United Kingdom', coordinates: [-3.436, 55.3781] },
        ];
        setCountries(europeanCountries);
        selectRandomCountry(europeanCountries);
    }, []);


    const selectRandomCountry = (countries) => {
        const remainingCountries = countries.filter(
            (country) => !correctlyGuessed.includes(country.name) && !failedGuessedCountries.includes(country.name)
        );
    
        if (remainingCountries.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingCountries.length);
            setCurrentCountry(remainingCountries[randomIndex]);
        } else {
            setCurrentCountry(null);
            setMessage({ text: 'Bravo tu izvēlējies visas valstis!', type: 'correct' });
        }
    };

    const handleMapClick = (geo) => {
        if (!currentCountry) return;
        if (message) setMessage(null);
    
        const clickedCountry = countries.find((country) => country.name === geo.properties.name);
    
        if (!clickedCountry) return;
    
        const allAnswered = new Set([
            ...correctlyGuessed,
            ...semiCorrectGuessed,
            ...failedGuessedCountries,
        ]);
    
        if (allAnswered.has(clickedCountry.name)) {
            setMessage({ text: 'Šī valsts jau ir uzminēta!', type: 'info' });
        
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 500);  
            return;
        }
    
        if (clickedCountry.name === currentCountry.name) {
            let earnedScore = 1;
    
            if (wrongGuessCount <= 2) {
                correctSound.play();
            }
    
            if (wrongGuessCount === 1 || wrongGuessCount === 2) {
                earnedScore = 0.5;
                setSemiCorrectGuessed((prev) => [...prev, clickedCountry.name]);
            } else {
        
                setCorrectlyGuessed((prevGuessed) => [...prevGuessed, clickedCountry.name]);
            }
    
            setScore((prev) => prev + earnedScore);
            setCorrectGuesses((prev) => prev + 1);
            setMessage({
                text: wrongGuessCount === 0 ? 'Pareizi!' : 'Pareizi (ar atkārtotu mēģinājumu)!',
                type: 'correct',
            });
    
            const remainingCountries = countries.filter(
                (country) => !allAnswered.has(country.name) && country.name !== clickedCountry.name
            );

            if (remainingCountries.length > 0) {
                const randomIndex = Math.floor(Math.random() * remainingCountries.length);
                setCurrentCountry(remainingCountries[randomIndex]); 
            } else {
                setCurrentCountry(null); 
                setIsTimerRunning(false);
            }

            setWrongGuessCount(0);
        } else {
            setIncorrectGuesses((prev) => prev + 1);
            const newCount = wrongGuessCount + 1;
            setWrongGuessCount(newCount);
    
            if (newCount >= 3) {
                setMessage({ text: 'Pārsniegts mēģinājumu limits!', type: 'incorrect' });
                failSound.play();
    
                setFailedGuessedCountries((prevFailed) => {
                    const updatedFailed = [...prevFailed, currentCountry.name];

                    const remainingCountries = countries.filter(
                        (country) => !allAnswered.has(country.name) && country.name !== currentCountry.name
                    );

                    if (remainingCountries.length > 0) {
                        const randomIndex = Math.floor(Math.random() * remainingCountries.length);
                        setCurrentCountry(remainingCountries[randomIndex]); 
                    } else {
                        setCurrentCountry(null); 
                        setIsTimerRunning(false);
                    }
    
                    return updatedFailed;
                });
    
                setWrongGuessCount(0);
            } else {
                setMessage({ text: 'Nepareizi!', type: 'incorrect' });
                wrongSound.play();
            }
        }
    
        setTimeout(() => setMessage(null), 500);
    };
    

    if (!europeTopoJSON) {
        return <div>Loading map...</div>;
    }

    return (
        <div className="background-container">
            <div className="main">
              <div className="relative flex justify-between items-center px-4 w-full">
                <div className="flex flex-row justify-start items-center flex-wrap pl-4"> 
                    <Link href={route('home')} className="game2">
                        <span>P</span><span>r</span><span>ā</span><span>t</span><span>a</span>
                        <span>&nbsp;</span>
                        <span>D</span><span>u</span><span>e</span><span>ļ</span><span>i</span>
                    </Link>
                </div>
                <Link href={route('lobby.valstis')} className="bg-white p-1 rounded-lg text-[56px] text-[#084fd3] transform">
                        <IoArrowBackCircleSharp /> 
                    </Link>

                <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                        {/* Imag */}
                        <img 
                            src="/images/icons/banner-green.png" 
                            alt="Asia" 
                            className="w-[16rem] h-[15.9rem] object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 top-2 flex items-start justify-center z-50">
                            <h1 className="room-title1 text-[#f7f7f7] text-3xl font-bold p-4 drop-shadow-lg">
                                Eiropa
                            </h1>
                        </div>  
                    </div>
                </div>
            </div>
                
            <div className="flex flex-row justify-center items-center w-full px-3 mt-[1%]">
            {/* Grid Contaienr s*/}
            <div className="grid grid-cols-[17%_65%_16%] gap-4 w-full">
                {/* Left BboxesS */}
                <div className="bg-[#fdfdfb] p-4 rounded-lg shadow-md w-full">
                    <h3 className="text-lg font-bold mb-2">Left Box</h3>
                    <p>This is the left box content.</p>
                </div>

                {/* Middle Comoletion */}
                <div className="bg-[#fdfdfb] h-auto p-5 w-full rounded-lg shadow-md relative text-center overflow-hidden flex flex-col z-[2001]">
            <Head title={`Valstis`} />
            <div className="flex items-center justify-between relative border-b-2 border-gray-300">
             <h2 className="text-2xl font-bold map mb-4 flex items-center gap-2">
                    Izvēlies valsti:
                    <span className={`text-[#ffff00] ${!currentCountry ? 'text-3xl' : 'text-4xl'}`}>
                        {currentCountry?.name || 'Bravo tu izvēlējies visas valstis!'}
                    </span>
                </h2>
                <div className="text-2xl font-bold gap-4 mb-4 flex items-center map">
                <div className="flex items-center space-x-2">
                    <span className="text-[#ffff00]">|</span>
                    <span className="text-[#f90a0a] ml-1">
                    <span className="text-sm align-middle">❌</span> {incorrectGuesses}
                    </span>
                    <span className="mx-1">:</span>
                    <span className="text-[#08ff00]">
                    <span className="text-sm align-middle">✅</span> {correctGuesses}
                    </span>
                    <span className="text-[#ffff00] ml-1">|</span>
                </div>
                <span>{user.name}</span>
                <img
                    src={europePicUrl}
                    alt="Europe"
                    className="w-[50px] h-[50px] rounded-full bg-cover bg-center shadow-lg"
                />
                </div>
            </div>

            <div className="w-full h-[515px] mt-4 flex justify-center items-center relative">

                    {!isGameStarted && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 z-20">
                            <div className="absolute inset-0 flex justify-center items-center">
                                <button 
                                    onClick={handleStartGame} 
                                    className="bg-gradient-to-r cool from-yellow-400 via-yellow-500 to-yellow-600 text-white text-xl font-mono py-2 px-4 rounded-lg font-semibold 
                                            transition-all duration-300 ease-in-out 
                                            hover:bg-gradient-to-l hover:from-yellow-500 hover:to-yellow-400"
                                >
                                    Sākt spēli!
                                </button>
                            </div>
                        </div>
                    )}

                 <AnimatePresence>
                    {message && (
                        <motion.div
                            key={message.text} 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-4 map left-50 transform -translate-x-1/2 text-lg font-bold z-10"
                        >
                            <span className={message.type === 'correct' ? 'text-[#55ff00]' : 'text-[#ff0017]'}>
                                {message.text}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{ center: [10, 45], scale: 500 }}
                    width={800}
                    height={500}
                    style={{ width: '100%', height: '100%' }}
                >
                    <ZoomableGroup
                        zoom={1}
                        minZoom={1}
                        maxZoom={5}
                        translateExtent={[[100, -300], [700, 400]]}
                    >
                        <Geographies geography={europeTopoJSON}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const name = geo.properties.name;
                                    const isGuessed = correctlyGuessed.includes(name);
                                    const isSemiGuessed = semiCorrectGuessed.includes(name);
                                    const isAutoGuessed = autoGuessedCountries.includes(name);
                                    const isFailedGuess = failedGuessedCountries.includes(geo.properties.name);

                                    let fillColor = '#D6D6DA';
                                    if (isGuessed) fillColor = '#4CAF50';
                                    else if (isSemiGuessed) fillColor = '#FFD700';
                                    else if (isAutoGuessed) fillColor = '#FF5733';

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onClick={() => handleMapClick(geo)}
                                            style={{
                                                default: {
                                                    fill: isGuessed
                                                        ? '#4CAF50'
                                                        : isSemiGuessed
                                                        ? '#FFD700'
                                                        : isFailedGuess
                                                        ? '#FF5733'
                                                        : '#D6D6DA',
                                                    stroke: '#5a5c5f', 
                                                    strokeWidth: 0.6, 
                                                    outline: 'none',
                                                },
                                                hover: {
                                                    fill: isGuessed
                                                        ? '#4CAF50'
                                                        : isSemiGuessed
                                                        ? '#FFD700'
                                                        : isFailedGuess
                                                        ? '#FF5733'
                                                        : '#0c6ae1',
                                                        stroke: '#5a5c5f', // Light gray border on hover
                                                        strokeWidth: 1, 
                                                    outline: 'none',
                                                    cursor: isGuessed || isSemiGuessed || isFailedGuess ? 'default' : 'pointer',
                                                },
                                                pressed: {
                                                    fill: isGuessed
                                                        ? '#4CAF50'
                                                        : isSemiGuessed
                                                        ? '#FFD700'
                                                        : isFailedGuess
                                                        ? '#FF5733'
                                                        : '#E42E',
                                                    outline: 'none', 
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>

                        {countries.map((country, index) => (
                            <Marker key={index} coordinates={country.coordinates}>
                                <circle r={1.7} fill="#FF5733" stroke="#fff" strokeWidth={0.7} />
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>
            </div>
         </div>

        {/* Right Box */}
        <div className="bg-[#fdfdfb] p-5 rounded-lg shadow-md w-full">
          <div className="flex items-center justify-center relative border-b-2 border-gray-300">
             <div className="text-2xl font-bold gap-2 mb-5 mt-1 flex items-center map">
                 <span className="text-[#f90a0a]">|</span>
                    <span className="text-4xl font-mono">
                        {Math.floor(timeElapsed / 60)
                        .toString()
                        .padStart(1, '0')}:
                        {(timeElapsed % 60).toString().padStart(2, '0')}
                    </span>
                  <span className="text-[#f90a0a]">|</span>
                    
                </div>
            </div>
            <div className="flex items-center justify-center relative border-b-2 border-gray-300">
            <div className="text-2xl font-bold gap-2 pt-4 pb-2 flex items-center map">
            <span className="text-[#f90a0a]"> | </span> 
            Punkti <span className="text-[#08ff00]">{score} / 41 </span> 
            <span className="text-[#f90a0a]"> | </span> 
            </div>
            </div>
        </div>

    </div>
</div>

            </div>
        </div>
    );
};

export default Europe;