import React, { useState, useEffect } from 'react';
import Missions, { allMissions } from '../../Components/Missions';
import Level from '../../Components/Level';
import Finish from '../../Components/Finish';
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


const America = ({ auth }) => {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [currentCountry, setCurrentCountry] = useState(null);
    const [countryIndex, setCountryIndex] = useState(0);
    const [coins, setCoins] = useState(0);

    const [score, setScore] = useState(0);
    const [message, setMessage] = useState(null);
    const [countries, setCountries] = useState([]);
    const [americaTopoJSON, setAmericaTopoJSON] = useState(null);
    const [correctlyGuessed, setCorrectlyGuessed] = useState([]); 
   
    const user = auth.user;

    const [userPictureId, setUserPictureId] = useState(null);
    const [europePicUrl, setEuropePicUrl] = useState('');

    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);  
    
    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);

    const [wrongGuessCount, setWrongGuessCount] = useState(0);
    const [perfectGuesses, setPerfectGuesses] = useState(0);
    const [perfectCountries, setPerfectCountries] = useState([]);
    const [failedGuessedCountries, setFailedGuessedCountries] = useState([]);
    const [semiCorrectGuessed, setSemiCorrectGuessed] = useState([]);
    const [autoGuessedCountries, setAutoGuessedCountries] = useState([]);

    const [showFinishScreen, setShowFinishScreen] = useState(false);
    const [gameStats, setGameStats] = useState(null);

    const correctSound = new Audio('/sounds/correct.mp3');
    const wrongSound = new Audio('/sounds/error.mp3');
    const failSound = new Audio('/sounds/fail.mp3');
    const hintSound = new Audio('/sounds/hint.mp3');
    const skipSound = new Audio('/sounds/skip.mp3');
    const flagSound = new Audio('/sounds/flag.mp3');
    const startSound = new Audio('/sounds/start.mp3');
    const guessedSound = new Audio('/sounds/guessed.mp3');
    const winSound = new Audio('/sounds/win.mp3');

    const [privileges, setPrivileges] = useState({
        hint_quantity: 0,
        hint_quantity_initial: 0,
        skip_quantity: 0,
        skip_quantity_initial: 0,
        flag_quantity: 0,
        flag_quantity_initial: 0,
        user_id: auth.user?.id
    });

    const [hintedCountry, setHintedCountry] = useState(null);

    const [flaggedCountry, setFlaggedCountry] = useState(null);
    const [hasUsedFlagForCurrentCountry, setHasUsedFlagForCurrentCountry] = useState(false);

    const [missionProgress, setMissionProgress] = useState(() => {
        const savedProgress = localStorage.getItem('missionProgress');
        return savedProgress ? JSON.parse(savedProgress) : {};
      });

  // Funcioon to update mission progs
  const handleUpdateMissionProgress = (missionType, increment = 1) => {
    console.log(`Updating mission type: ${missionType}, increment: ${increment}`);

    const missionsToUpdate = Object.values(allMissions)
      .flat()
      .filter((mission) => mission.type === missionType);

    setMissionProgress((prevProgress) => {
      const newProgress = { ...prevProgress };

      missionsToUpdate.forEach((mission) => {
        const current = prevProgress[mission.id] || 0;
        newProgress[mission.id] = current + increment;
        console.log(`Updated mission ${mission.id}: ${newProgress[mission.id]}`);
      });

      localStorage.setItem('missionProgress', JSON.stringify(newProgress));

      return newProgress;
    });
  };

  const handleFlagClick = async () => {
    if (hasUsedFlagForCurrentCountry) return;
  
    if (privileges?.flag_quantity > 0) {
      flagSound.play();
  
      handleUpdateMissionProgress('flag', 1); 
  
      setFlaggedCountry({
        name: currentCountry?.name,
        code: currentCountry?.code?.toLowerCase(),
      });
  
      setHasUsedFlagForCurrentCountry(true);
  
      try {
        const response = await fetch('/use-flag', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          },
          body: JSON.stringify({ user_id: user.id }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setPrivileges((prev) => ({
            ...prev,
            flag_quantity: data.flag_quantity,
          }));
        } else {
          console.error('Flag error:', data);
        }
      } catch (error) {
        console.error('Flag fetch failed:', error);
      }
    } else {
      alert('Tev vairs nav šīs privilēģijas');
    }
  };

    const skipToNextCountry = () => {
        
        setFlaggedCountry(null);

        const guessedCountries = [
            ...correctlyGuessed,
            ...semiCorrectGuessed,
            ...failedGuessedCountries,
        ];
    
        const totalCountries = countries.length;
        let nextIndex = countryIndex;
    
        for (let i = 1; i <= totalCountries; i++) {
            const potentialIndex = (countryIndex + i) % totalCountries;
            const potentialCountry = countries[potentialIndex];
    
            if (!guessedCountries.includes(potentialCountry.name)) {
                setCountryIndex(potentialIndex);
                setCurrentCountry(potentialCountry);
                return;
            }
        }
    
        setCurrentCountry(null);
        alert("No more unguessed countries to skip to.");
    };

    const handleUseSkip = async () => {
        try {
            const response = await fetch('/use-skip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    user_id: privileges?.user_id,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                if (data.skip_quantity !== undefined) {
                    setPrivileges(prev => ({
                        ...prev,
                        skip_quantity: data.skip_quantity,
                    }));
                    skipSound.play();
                    skipToNextCountry();
                }
            } else {
                alert(data.message || 'Unable to use skip.');
            }
        } catch (error) {
            console.error('Failed to use skip:', error);
            alert('Something went wrong while using skip.');
        }
    };

    const handleHintClick = async () => {
        if (privileges.hint_quantity > 0) {
            hintSound.play();
        
            handleUpdateMissionProgress('hint', 1); 
        
            setHintedCountry(currentCountry?.name);
            setTimeout(() => {
                setHintedCountry(false);
            }, 1000);
        
            try {
                const response = await fetch('/use-hint', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    body: JSON.stringify({ user_id: user.id }),
                });
        
                const data = await response.json();
        
                if (response.ok) {
                    setPrivileges(prev => ({
                        ...prev,
                        hint_quantity: data.hint_quantity
                    }));
                } else {
                    console.error('Hint error:', data);
                }
            } catch (error) {
                console.error('Hint fetch failed:', error);
            }
        }
    };

      useEffect(() => {
        if (user) {
            axios.get(`/privileges/${user.id}`)
                .then(response => {
                    setPrivileges({
                        hint_quantity: response.data.hint_quantity,
                        hint_quantity_initial: response.data.hint_quantity,
                        skip_quantity: response.data.skip_quantity,
                        skip_quantity_initial: response.data.skip_quantity,
                        flag_quantity: response.data.flag_quantity,
                        flag_quantity_initial: response.data.flag_quantity,
                        user_id: user.id
                    });
                })
                .catch(error => {
                    console.error('Error fetching privileges:', error);
                });
        }
    }, [user]);
    

    const handleStartGame = () => {
        setIsGameStarted(true); 
        startSound.play();
        setIsTimerRunning(true);  
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
            .then((data) => setAmericaTopoJSON(data))
            .catch((error) => console.error('Error loading TopoJSON:', error));
    }, []);
    
    useEffect(() => {
        const americanCountries = [           
            { name: 'Argentīna', code: 'ar', coordinates: [-63.6167, -38.4161] },
            { name: 'Bahamu salas', code: 'bs', coordinates: [-77.39628, 25.03428] },
            { name: 'Beliza', code: 'bz', coordinates: [-88.4976, 17.1899] },
            { name: 'Bolīvija', code: 'bo', coordinates: [-63.5887, -16.2902] },
            { name: 'Brazīlija', code: 'br', coordinates: [-51.9253, -14.2350] },
            { name: 'Kanāda', code: 'ca', coordinates: [-106.3468, 56.1304] },
            { name: 'Čīle', code: 'cl', coordinates: [-71.5430, -35.6751] },
            { name: 'Kolumbija', code: 'co', coordinates: [-74.2973, 4.5709] },
            { name: 'Kostarika', code: 'cr', coordinates: [-83.7534, 9.7489] },
            { name: 'Kuba', code: 'cu', coordinates: [-77.7812, 21.5218] },
            { name: 'Dominikāna', code: 'do', coordinates: [-70.1627, 18.7357] },
            { name: 'Ekvadora', code: 'ec', coordinates: [-78.1834, -1.8312] },
            { name: 'Salvadora', code: 'sv', coordinates: [-88.8965, 13.7942] },
            { name: 'Gvatemala', code: 'gt', coordinates: [-90.2308, 15.7835] },
            { name: 'Gajāna', code: 'gy', coordinates: [-58.9302, 4.8604] },
            { name: 'Haiti', code: 'ht', coordinates: [-72.2852, 18.9712] },
            { name: 'Hondurasa', code: 'hn', coordinates: [-86.2419, 15.2000] },
            { name: 'Jamaika', code: 'jm', coordinates: [-77.2975, 18.1096] },
            { name: 'Meksika', code: 'mx', coordinates: [-102.5528, 23.6345] },
            { name: 'Nikaragva', code: 'ni', coordinates: [-85.2072, 12.8654] },
            { name: 'Panama', code: 'pa', coordinates: [-80.7821, 8.5380] },
            { name: 'Paragvaja', code: 'py', coordinates: [-58.4438, -23.4425] },
            { name: 'Peru', code: 'pe', coordinates: [-75.0152, -9.1899] },  
            { name: 'Surinama', code: 'sr', coordinates: [-56.0278, 3.9193] },
            { name: 'Trinidāda un Tobāgo', code: 'tt', coordinates: [-61.2225, 10.6918] },
            { name: 'Amerikas Savienotās Valstis', code: 'us', coordinates: [-95.7129, 37.0902] },
            { name: 'Urugvaja', code: 'uy', coordinates: [-55.7658, -32.5228] },
            { name: 'Venecuēla', code: 've', coordinates: [-66.5897, 6.4238] },

            { name: 'Puertoriko', code: 'pr', coordinates: [-66.5901, 18.2208] },
            { name: 'Folklendu salas', code: 'fk', coordinates: [-59.5236, -51.7963] },
            { name: 'Grenlande', code: 'gl', coordinates: [-42.6043, 71.7069] }
        ];
        //dsd  sds sds sds sdsd sdds
        setCountries(americanCountries);
        selectRandomCountry(americanCountries);
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
          guessedSound.play();
          setTimeout(() => {
              setMessage({ text: '', type: '' });
          }, 500);
          return;
      }
      
      if (clickedCountry.name === currentCountry.name) {
          let earnedScore = 1;
          let isPerfectGuess = wrongGuessCount === 0;
      
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
          
          // Track perfect guesses separately
          if (isPerfectGuess) {
              setPerfectGuesses((prev) => prev + 1);
          }
          
          setMessage({
              text: isPerfectGuess ? 'Pareizi!' : 'Pareizi (ar atkārtotu mēģinājumu)!',
              type: 'correct',
          });
      
          handleUpdateMissionProgress('country', 1);
      
          setFlaggedCountry(null);
          setHasUsedFlagForCurrentCountry(false);
      
          const remainingCountries = countries.filter(
              (country) => !allAnswered.has(country.name) && country.name !== clickedCountry.name
          );
      
          if (remainingCountries.length > 0) {
              const randomIndex = Math.floor(Math.random() * remainingCountries.length);
              setCurrentCountry(remainingCountries[randomIndex]);
      
              setHasUsedFlagForCurrentCountry(false);
              setFlaggedCountry(null);
          } else {
              // Game complet vv
              setCurrentCountry(null);
              setIsTimerRunning(false);
              
              winSound.play().catch((e) => {
                  console.warn('Could not play win sound:', e);
              });
              
              // Prepare complete game stats
              const finalStats = {
                countries: countries,
                totalCountries: countries.length,
                timePlayed: timeElapsed,
                perfectGuesses: perfectGuesses + (isPerfectGuess ? 1 : 0),
                hintsUsed: privileges.hint_quantity_initial - privileges.hint_quantity,
                skipsUsed: privileges.skip_quantity_initial - privileges.skip_quantity,
                flagsUsed: privileges.flag_quantity_initial - privileges.flag_quantity,
                score: score + earnedScore,
                correctGuesses: correctGuesses + 1,
                incorrectGuesses: incorrectGuesses,
                failedCountries: failedGuessedCountries,
                semiCorrectCountries: semiCorrectGuessed,
                perfectCountries: [...correctlyGuessed, ...(isPerfectGuess ? [clickedCountry.name] : [])]
                    .filter(country => !semiCorrectGuessed.includes(country) && 
                                    !failedGuessedCountries.includes(country))
            };
              
              setGameStats(finalStats);
              setShowFinishScreen(true);
          
              setMessage({ text: 'Bravo tu izvēlējies visas valstis!', type: 'correct' });
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
      
                  setFlaggedCountry(null);
                  setHasUsedFlagForCurrentCountry(false);
      
                  const remainingCountries = countries.filter(
                      (country) => !allAnswered.has(country.name) && country.name !== currentCountry.name
                  );
      
                  if (remainingCountries.length > 0) {
                      const randomIndex = Math.floor(Math.random() * remainingCountries.length);
                      setCurrentCountry(remainingCountries[randomIndex]);
      
                      setHasUsedFlagForCurrentCountry(false);
                      setFlaggedCountry(null);
                  } else {
                      // Game completed
                      setCurrentCountry(null);
                      setIsTimerRunning(false);
      
                      winSound.play().catch((e) => {
                          console.warn('Could not play win sound:', e);
                      });
      
                      // Prepare complete game stats
                      const finalStats = {
                        countries: countries,
                        totalCountries: countries.length,
                        timePlayed: timeElapsed,
                        perfectGuesses: perfectGuesses,
                        hintsUsed: privileges.hint_quantity_initial - privileges.hint_quantity,
                        skipsUsed: privileges.skip_quantity_initial - privileges.skip_quantity,
                        flagsUsed: privileges.flag_quantity_initial - privileges.flag_quantity,
                        score: score,
                        correctGuesses: correctGuesses,
                        incorrectGuesses: incorrectGuesses + 1,
                        failedCountries: updatedFailed,
                        semiCorrectCountries: semiCorrectGuessed,
                        perfectCountries: correctlyGuessed.filter(country => 
                            !semiCorrectGuessed.includes(country) && 
                            !failedGuessedCountries.includes(country))
                    };
                      
                      setGameStats(finalStats);
                      setShowFinishScreen(true);
      
                      setMessage({ text: 'Bravo tu izvēlējies visas valstis!', type: 'correct' });
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
    

    if (!americaTopoJSON) {
        return <div>Lādē mapi...</div>;
    }

    return (
      <div className="background-container">
          <div className="relative flex flex-col items-center h-screen text-center overflow-hidden">
              <div className="relative flex justify-between items-center px-4 w-full">
                  <div className="flex flex-row justify-start items-center flex-wrap pl-4"> 
                      <Link href={route('home')} className="game2">
                          <span>P</span><span>r</span><span>ā</span><span>t</span><span>a</span>
                          <span>&nbsp;</span>
                          <span>D</span><span>u</span><span>e</span><span>ļ</span><span>i</span>
                      </Link>
                  </div>
                  <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white p-2 rounded-lg space-x-2">
                  <Level/>
                  </div>
                      
                      <Link href={route('lobby.valstis')} className="bg-white p-1 rounded-lg text-[56px] text-[#084fd3] transform">
                          <IoArrowBackCircleSharp /> 
                      </Link>
                  </div>
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                          {/* Imag */}
                          <img 
                              src="/images/icons/banner-orange.png" 
                              alt="Asia" 
                              className="w-[16rem] h-[15.9rem] object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 top-2 flex items-start justify-center z-50">
                              <h1 className="room-title1 text-[#f7f7f7] text-3xl font-bold p-4 drop-shadow-lg">
                                  Amerika
                              </h1>
                          </div>  
                      </div>
                  </div>
              </div>
              
              {/* Finish Screen - Moved outside the header and before the main content */}
              {showFinishScreen && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-[2002]">
                      <Finish 
                          gameType="america" 
                          gameStats={gameStats} 
                          onClose={() => setShowFinishScreen(false)}
                          user={user}           
                          europePicUrl={europePicUrl} 
                          americaTopoJSON={americaTopoJSON} 
                      />
                  </div>
              )}
  
              <div className="flex flex-row justify-center items-stretch w-full flex-1 mt-5 min-h-0 px-3 pb-3">
                  {/* Grid Contaieners*/}
                  <div className="grid grid-cols-[17%_65%_16%] gap-4 w-full h-full min-h-0">
                      {/* Left Box */}
                      <div className="bg-[#fdfdfb] p-4 rounded-lg shadow-md flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-center relative border-b-2 border-gray-300">
            <div className="text-2xl font-bold gap-2 mb-5 mt-1 flex items-center map">
              <span className="text-[#f90a0a]">|</span>
              <span className="text-4xl font-mono">Misijas</span>
              <span className="text-[#f90a0a]">|</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <Missions 
              missionProgress={missionProgress} 
              setMissionProgress={setMissionProgress} 
              setCoins={setCoins}
              coins={coins}
              containerHeight="100%"
            />
          </div>
        </div>
  
                      {/* Mid box */}
                      <div className="bg-[#fdfdfb] h-full p-5 w-full rounded-lg shadow-md relative text-center overflow-hidden flex flex-col z-[2001]">
                          <Head title={`Valstis`} />
                          <div className="flex items-center justify-between relative border-b-2 border-gray-300">
                          <h2 className="text-2xl font-bold map mb-4 flex items-center gap-2">
                                  Izvēlies valsti:
                                  <span className={`text-[#ffff00] ${!currentCountry ? 'text-3xl' : 'text-4xl'}`}>
                                      {currentCountry?.name || 'Bravo tu izvēlējies visas valstis!'}
                                  </span>
                              </h2>
                              <div className="text-2xl font-bold gap-4 mb-4 flex items-center ">
                              <div className="flex items-center space-x-2 map">
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
                              <span className="name text-white font-semibold" >{user.name}</span>
                              
                              <img
                                  src={europePicUrl}
                                  alt="Europe"
                                  className="w-[50px] h-[50px] rounded-full bg-cover shadow-md bg-center shadow-lg"
                              />
                              </div>
                          </div>
  
                          <div className="flex-1 min-h-0 relative">
                                  {flaggedCountry && (
                                      <div className="absolute top-0 left-0 m-2 z-10 flagged-country">
                                      <img
                                          src={`https://flagcdn.com/w80/${flaggedCountry.code}.png`}
                                          alt={`Flag of ${flaggedCountry.name}`}
                                          width="84"
                                          height="88"
                                      />
                                      </div>
                                  )}
  
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
                                              className="absolute top-4 left-1/2 map transform -translate-x-1/2 text-lg font-bold z-10"
                                             >
                                        <span className={message.type === 'correct' ? 'text-[#55ff00]' : 'text-[#ff0017]'}>
                                             {message.text}
                                        </span>
                                     </motion.div>
                                  )}
                                </AnimatePresence>
  
                              <div className="w-full h-full">
                              <ComposableMap
                                    projection="geoMercator"
                                    projectionConfig={{ center: [-80, 15], scale: 400 }}
                                    width={800}
                                    height={500}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <ZoomableGroup
                                        zoom={1}
                                        minZoom={0.7}
                                        maxZoom={5}
                                        translateExtent={[[-200, -600], [900, 900]]}
                                    >
                                        <Geographies geography={americaTopoJSON}>  
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
                                                                    fill:
                                                                        isGuessed
                                                                            ? '#4CAF50'
                                                                            : isSemiGuessed
                                                                            ? '#FFD700'
                                                                            : isFailedGuess
                                                                            ? '#FF5733'
                                                                            : hintedCountry === name
                                                                            ? '#a020f0'
                                                                            : '#D6D6DA',
                                                                    stroke: '#5a5c5f',
                                                                    strokeWidth: 0.6,
                                                                    outline: 'none',
                                                                },
                                                                hover: {
                                                                    fill:
                                                                        isGuessed
                                                                            ? '#4CAF50'
                                                                            : isSemiGuessed
                                                                            ? '#FFD700'
                                                                            : isFailedGuess
                                                                            ? '#FF5733'
                                                                            : '#0c6ae1',
                                                                    stroke: '#5a5c5f',
                                                                    strokeWidth: 1,
                                                                    outline: 'none',
                                                                    cursor: isGuessed || isSemiGuessed || isFailedGuess ? 'default' : 'pointer',
                                                                },
                                                                pressed: {
                                                                    fill:
                                                                        isGuessed
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
                      </div>
  
                      {/* Right Box */}
                      <div className="bg-[#fdfdfb] p-5 rounded-lg shadow-md w-full h-full flex flex-col overflow-hidden">
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
                                      Punkti <span className="text-[#08ff00]">{score} / 32 </span> 
                                  <span className="text-[#f90a0a]"> | </span> 
                              </div>
                          </div>
                          <div className="flex items-center justify-between relative border-b-2 border-gray-300">
                              {/* flag */}
                              <div className="text-2xl font-bold gap-2 pt-3 pb-1 flex flex-col items-center map gap-y-1">
                                  <img 
                                      src="/images/hint.png" 
                                      alt="Hint"
                                      onClick={handleFlagClick}
                                      className={`w-[3rem] h-[3rem] bg-[#e4e3a9] hover:bg-[#e4de81] p-2 object-cover rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 
                                          ${hasUsedFlagForCurrentCountry ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                      />
                                  
                                  <span>{privileges ? privileges.flag_quantity : 0}</span>
                              </div>
  
                              {/* Skip */}
                              <div className="text-2xl font-bold gap-2 pt-3 pb-1 flex flex-col items-center map gap-y-1">
                                  <img
                                      src="/images/icons/skip.png"
                                      alt="Skip"
                                      onClick={privileges?.skip_quantity > 0 ? handleUseSkip : null}
                                      className={`w-[3rem] h-[3rem] p-2 object-fit rounded-md shadow-md transition-all duration-300 ease-in-out transform ${privileges?.skip_quantity > 0 ? 'bg-[#a9e4ae] hover:bg-[#81e493] cursor-pointer hover:scale-105' : 'bg-gray-300 opacity-60 cursor-not-allowed'}`}
                                      />
                                  <span>{privileges ? privileges.skip_quantity : 0}</span>
                              </div>
  
                              {/* hint */}
                              <div className="text-2xl font-bold gap-2 pt-3 pb-1 flex flex-col items-center map gap-y-1">
                                  <img 
                                      src="/images/icons/flag.png" 
                                      alt="Flag" 
                                      onClick={handleHintClick}
                                      className="w-[3rem] h-[3rem] bg-[#a9b0e4] hover:bg-[#818de4] p-2 object-cover rounded-full shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
                                  />
                                  <span>{privileges ? privileges.hint_quantity : 0}</span>
                                  </div>
  
                              {/**/}
                              {!isGameStarted && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 z-20">
                                      
                                  </div>
                              )}
                          </div>
                          <div className="flex-1 flex flex-col font overflow-hidden ">
                              {/* top side*/}
                              <div className="text-2xl font-bold gap-2 pt-4 pb-2 flex justify-center items-center map">
                                    <span className="text-[#f90a0a]"> | </span> 
                                    Valstis <span className="text-[#08ff00]"></span> 
                                    <span className="text-[#f90a0a]"> | </span> 
                              </div>
  
                              {/* Country list below, aligned to the left */}
                            <div className="flex-1 overflow-auto custom-scrollbar">
                              <div className="flex flex-wrap gap-2 p-2">
                                  {correctlyGuessed.map((countryName, index) => {
                                  const country = countries.find((c) => c.name === countryName);
                                  return (
                                      <div key={`correct-${index}`} className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                                      <img
                                          src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                                          alt={`Flag of ${country.name}`}
                                          className="w-6 h-4"
                                      />
                                      <span className="text-[#4CAF50] text-sm">{country.name}</span>
                                      </div>
                                  );
                                  })}
  
                                  {semiCorrectGuessed.map((countryName, index) => {
                                  const country = countries.find((c) => c.name === countryName);
                                  return (
                                      <div key={`semi-${index}`} className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-md">
                                      <img
                                          src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                                          alt={`Flag of ${country.name}`}
                                          className="w-6 h-4"
                                      />
                                      <span className="text-[#FFD700] text-sm">{country.name}</span>
                                      </div>
                                  );
                                  })}
  
                                  {failedGuessedCountries.map((countryName, index) => {
                                  const country = countries.find((c) => c.name === countryName);
                                  return (
                                      <div key={`failed-${index}`} className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-md">
                                      <img
                                          src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                                          alt={`Flag of ${country.name}`}
                                          className="w-6 h-4"
                                      />
                                      <span className="text-[#FF5733] text-sm">{country.name}</span>
                                      </div>
                                  );
                                  })}
                              </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default America;