import React, { useState, useEffect } from 'react';

export const allMissions = {
  daily: [
    { id: 1, type: 'country', description: 'Uzmini 15 valstis', reward: { coins: 20, xp: 20 }, goal: 15 },
    { id: 2, type: 'hint', description: 'Izmanto 3 padomus', reward: { coins: 75, xp: 50 }, goal: 3 },
    { id: 3, type: 'skip', description: 'Izmanto 2 izlaidienus', reward: { coins: 50, xp: 50 }, goal: 2 },
    { id: 4, type: 'country', description: 'Uzmini 25 valstis', reward: { coins: 45, xp: 25 }, goal: 25 },
    { id: 5, type: 'flag', description: 'Izmanto 1 karogu', reward: { coins: 30, xp: 40 }, goal: 1 },
    { id: 6, type: 'hint', description: 'Izmanto 4 padomus', reward: { coins: 80, xp: 50 }, goal: 4 },
    { id: 7, type: 'skip', description: 'Izmanto 3 izlaidienus', reward: { coins: 70, xp: 60 }, goal: 3 },
    { id: 8, type: 'country', description: 'Uzmini 10 valstis', reward: { coins: 10, xp: 25 }, goal: 10 },
    { id: 9, type: 'hint', description: 'Izmanto 1 padomus', reward: { coins: 25, xp: 20 }, goal: 1 },
    { id: 10, type: 'skip', description: 'Izmanto 1 izlaidienu', reward: { coins: 30, xp: 45 }, goal: 1 },
    
  ],
  weekly: [
    { id: 11, type: 'country', description: 'Uzmini 150 valstis', reward: { coins: 300, xp: 400 }, goal: 150 },
    { id: 12, type: 'flag', description: 'Izmanto 10 karogus', reward: { coins: 400, xp: 200 }, goal: 10 },
    { id: 13, type: 'skip', description: 'Izmanto 10 izlaidienus', reward: { coins: 200, xp: 225 }, goal: 10 },
    { id: 14, type: 'skip', description: 'Izmanto 12 izlaidienus', reward: { coins: 240, xp: 250 }, goal: 12 },
    { id: 15, type: 'skip', description: 'Izmanto 15 izlaidienus', reward: { coins: 270, xp: 285 }, goal: 15 },
    { id: 16, type: 'hint', description: 'Izmanto 15 padomus', reward: { coins: 800, xp: 500 }, goal: 15 },
    { id: 17, type: 'country', description: 'Uzmini 200 valstis', reward: { coins: 400, xp: 500 }, goal: 200 },
    { id: 18, type: 'hint', description: 'Izmanto 10 padomus', reward: { coins: 500, xp: 300 }, goal: 10 },
    { id: 19, type: 'hint', description: 'Izmanto 12 padomus', reward: { coins: 600, xp: 370 }, goal: 12 },
    { id: 20, type: 'country', description: 'Uzmini 165 valstis', reward: { coins: 375, xp: 475 }, goal: 165 },
    { id: 21, type: 'flag', description: 'Izmanto 15 karogus', reward: { coins: 620, xp: 225 }, goal: 15 },
    { id: 22, type: 'flag', description: 'Izmanto 20 karogus', reward: { coins: 800, xp: 225 }, goal: 20 },
  ],
  allTime: [
    { id: 23, type: 'country', description: 'Uzmini 1000 valstis', reward: { coins: 2000, xp: 3000 }, goal: 1000 },
    { id: 24, type: 'country', description: 'Uzmini 2000 valstis', reward: { coins: 5000, xp: 4000 }, goal: 2000 },
    { id: 25, type: 'country', description: 'Uzmini 3500 valstis', reward: { coins: 7000, xp: 10000 }, goal: 3500 },
    { id: 26, type: 'flag', description: 'Izmanto 50 karogus', reward: { coins: 2000, xp: 2500 }, goal: 50 },
    { id: 27, type: 'flag', description: 'Izmanto 100 karogus', reward: { coins: 3400, xp: 5000 }, goal: 100 },
    { id: 28, type: 'flag', description: 'Izmanto 200 karogus', reward: { coins: 6000, xp: 8000 }, goal: 200 },
    { id: 29, type: 'hint', description: 'Izmanto 100 padomus', reward: { coins: 4000, xp: 5000 }, goal: 100 },
    { id: 30, type: 'hint', description: 'Izmanto 200 padomus', reward: { coins: 8000, xp: 9000 }, goal: 200 },
    { id: 31, type: 'hint', description: 'Izmanto 300 padomus', reward: { coins: 10000, xp: 12000 }, goal: 300 },
    { id: 32, type: 'skip', description: 'Izmanto 100 izlaidienus', reward: { coins: 4200, xp: 4850 }, goal: 100 },
    { id: 33, type: 'skip', description: 'Izmanto 175 izlaidienus', reward: { coins: 5150, xp: 6320 }, goal: 175 },
    { id: 34, type: 'skip', description: 'Izmanto 225 izlaidienus', reward: { coins: 6000, xp: 7200 }, goal: 225 },
  ],
};

const Missions = ({ missionProgress, setMissionProgress, containerHeight = "33rem", setCoins = () => {}, coins = 0, currentUserId = null  }) => {
  const [dailyMissions, setDailyMissions] = useState([]);
  const [weeklyMissions, setWeeklyMissions] = useState([]);
  const [showTimeLeft, setShowTimeLeft] = useState({});
  const [showAllTimeCompleted, setShowAllTimeCompleted] = useState({});
  const [timeLeft, setTimeLeft] = useState({ daily: 0, weekly: 0 }); 

  const rewardSound = new Audio('/sounds/reward.mp3');
  

  useEffect(() => {
    // Check for old global missionProgress
    const globalProgress = localStorage.getItem('missionProgress');
    if (globalProgress && currentUserId) {
      // Migrate to user-specific key
      localStorage.setItem(`${currentUserId}_missionProgress`, globalProgress);
      localStorage.removeItem('missionProgress');
      setMissionProgress(JSON.parse(globalProgress));
    }
  }, [currentUserId]);

  const selectRandomMissions = (missions, count) => {
  // Group missions by type
  const missionsByType = {
    country: [],
    hint: [],
    skip: [],
    flag: []
  };
  
  missions.forEach(mission => {
    missionsByType[mission.type].push(mission);
  });

  const selectedMissions = [];
  const selectedTypes = new Set();

  // Keep trying until we get enough unique missions
  while (selectedMissions.length < count && selectedTypes.size < Object.keys(missionsByType).length) {
    // Get all remaining types we haven't selected yet
    const availableTypes = Object.keys(missionsByType).filter(
      type => missionsByType[type].length > 0 && !selectedTypes.has(type)
    );

    // If no more unique types available, break to avoid infinite loop
    if (availableTypes.length === 0) break;

    // Randomly select a type we haven't used yet
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    selectedTypes.add(randomType);

    // Get a random mission of this type
    const missionsOfType = missionsByType[randomType];
    const randomMission = missionsOfType[Math.floor(Math.random() * missionsOfType.length)];

    // Add to selected missions
    selectedMissions.push(randomMission);

    // Remove this mission from the pool to avoid duplicates
    missionsByType[randomType] = missionsByType[randomType].filter(m => m.id !== randomMission.id);
  }

  // If we still need more missions (not enough types), fill with random remaining missions
  while (selectedMissions.length < count) {
    const remainingMissions = Object.values(missionsByType).flat();
    if (remainingMissions.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * remainingMissions.length);
    selectedMissions.push(remainingMissions[randomIndex]);
    
    // Remove the selected mission from its type group
    const missionType = remainingMissions[randomIndex].type;
    missionsByType[missionType] = missionsByType[missionType].filter(
      m => m.id !== remainingMissions[randomIndex].id
    );
  }

  return selectedMissions.slice(0, count);
};

  const getUserKey = (key) => {
    return currentUserId ? `${currentUserId}_${key}` : key;
  };

  const resetMissions = (type) => {
    const now = new Date();
    let resetDate;
  
    if (type === 'daily') {
      resetDate = now.toDateString();
    } else if (type === 'weekly') {
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + (7 - now.getDay()) || 7); 
      nextSunday.setHours(0, 0, 0, 0);
      resetDate = nextSunday.toDateString();
    }
  
    const selectedMissions = selectRandomMissions(allMissions[type], 3);
    localStorage.setItem(`${currentUserId}_${type}ResetDate`, resetDate);
    localStorage.setItem(`${currentUserId}_${type}Missions`, JSON.stringify(selectedMissions));
  
    // Get current progress
    const storedProgress = JSON.parse(localStorage.getItem(`${currentUserId}_missionProgress`)) || {};
    const updatedProgress = { ...storedProgress };
  
    // Clear progress ONLY for the missions that are being replaced
    const currentMissions = type === 'daily' ? dailyMissions : weeklyMissions;
    currentMissions.forEach(mission => {
      if (!selectedMissions.some(m => m.id === mission.id)) {
        delete updatedProgress[mission.id];
      }
    });
  
    // Also clear the claimed status for the new missions
    selectedMissions.forEach(mission => {
      localStorage.removeItem(`${currentUserId}_showTimeLeft_${mission.id}`);
      localStorage.removeItem(`${currentUserId}_mission_claimed_${mission.id}`);
    });
  
    localStorage.setItem(`${currentUserId}_missionProgress`, JSON.stringify(updatedProgress));
    setMissionProgress(updatedProgress);
  
    if (type === 'daily') {
      setDailyMissions(selectedMissions);
    } else if (type === 'weekly') {
      setWeeklyMissions(selectedMissions);
    }
  };

  const handleResetMissions = () => {
    const updatedMissionProgress = { ...missionProgress };
  
    //boBOLO
    dailyMissions.forEach((mission) => {
      delete updatedMissionProgress[mission.id];
      localStorage.removeItem(`showTimeLeft_${mission.id}`);
    });
  
    localStorage.setItem('missionProgress', JSON.stringify(updatedMissionProgress));
    setMissionProgress(updatedMissionProgress);
  
    resetMissions('daily');
  };
  
  const calculateTimeLeft = (type) => {
    const now = new Date();
    let resetTime;
  
    if (type === 'daily') {
      resetTime = new Date();
      resetTime.setHours(24, 0, 0, 0);
    } else if (type === 'weekly') {
      resetTime = new Date();
      resetTime.setDate(now.getDate() + (7 - now.getDay()) % 7); 
      resetTime.setHours(0, 0, 0, 0);
    }
  
    const difference = resetTime - now;
    return difference > 0 ? difference : 0;
  };

  useEffect(() => {
    const updateTimeLeft = () => {
      setTimeLeft({
        daily: calculateTimeLeft('daily'),
        weekly: calculateTimeLeft('weekly')
      });
    };

    updateTimeLeft();

    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);


  const formatTimeLeft = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000)) % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
  };

  const handleShowTimeLeft = async (missionId, type) => {
    try {
      const mission = [...dailyMissions, ...weeklyMissions].find(m => m.id === missionId);
      
      if (!mission) {
        console.error('Mission not found');
        return;
      }
  
      // Check if already claimed
      const claimedKey = getUserKey(`mission_claimed_${missionId}`);
      if (localStorage.getItem(claimedKey)) {
        return;
      }
  
      const response = await fetch('/claim-mission-reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
          coins: mission.reward.coins,
          xp: mission.reward.xp,
          mission_id: missionId
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
      if (data.success) {
        rewardSound.play().catch(e => console.error('Error playing sound:', e));
        
        if (typeof setCoins === 'function') {
          setCoins(prevCoins => prevCoins + mission.reward.coins);
        }
  
        // Mark as claimed
        localStorage.setItem(claimedKey, 'true');
        
        const updatedShowTimeLeft = { ...showTimeLeft, [missionId]: true };
        setShowTimeLeft(updatedShowTimeLeft);
        localStorage.setItem(getUserKey(`showTimeLeft_${missionId}`), JSON.stringify(true));
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const handleShowAllTimeCompleted = async (missionId) => {
    try {
      const mission = allMissions.allTime.find(m => m.id === missionId);
      
      if (!mission) {
        console.error('Mission not found');
        return;
      }
  
      // Check if already claimed
      const claimedKey = getUserKey(`mission_claimed_${missionId}`);
      if (localStorage.getItem(claimedKey)) {
        return;
      }
  
      const response = await fetch('/claim-mission-reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
          coins: mission.reward.coins,
          xp: mission.reward.xp,
          mission_id: missionId
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
      if (data.success) {
        rewardSound.play().catch(e => console.error('Error playing sound:', e));
        
        if (typeof setCoins === 'function') {
          setCoins(prevCoins => prevCoins + mission.reward.coins);
        }
  
        // Mark as claimed
        localStorage.setItem(claimedKey, 'true');
        
        const updatedShowAllTimeCompleted = { ...showAllTimeCompleted, [missionId]: true };
        setShowAllTimeCompleted(updatedShowAllTimeCompleted);
        localStorage.setItem(getUserKey(`showAllTimeCompleted_${missionId}`), JSON.stringify(true));
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const loadMissions = (type) => {
    const lastReset = localStorage.getItem(`${currentUserId}_${type}ResetDate`);
    const storedMissions = localStorage.getItem(`${currentUserId}_${type}Missions`);
    const now = new Date();
  
    // Load mission progress with user prefix
    const storedProgress = JSON.parse(localStorage.getItem(`${currentUserId}_missionProgress`)) || {};
    setMissionProgress(storedProgress); // This updates the state with loaded progress
  
    if (type === 'daily') {
      const currentDate = now.toDateString();
      if (lastReset === currentDate && storedMissions) {
        const parsedMissions = JSON.parse(storedMissions);
        setDailyMissions(parsedMissions);
      } else {
        resetMissions(type);
      }
    } else if (type === 'weekly') {
      if (lastReset) {
        const resetDate = new Date(lastReset);
        if (now < resetDate && storedMissions) {
          const parsedMissions = JSON.parse(storedMissions);
          setWeeklyMissions(parsedMissions);
          return;
        }
      }
      resetMissions(type);
    }
  };

  useEffect(() => {
    loadMissions('daily');
    loadMissions('weekly');
  }, [currentUserId]);

  useEffect(() => {
    // Load mission progress when userId changes
    const storedProgress = JSON.parse(localStorage.getItem(`${currentUserId}_missionProgress`)) || {};
    setMissionProgress(storedProgress);
  }, [currentUserId]);

  useEffect(() => {
    const checkReset = () => {
      const now = new Date();
      
      // Check daily reset - use user-specific key
      const lastDailyReset = localStorage.getItem(`${currentUserId}_dailyResetDate`);
      if (!lastDailyReset || new Date(lastDailyReset).toDateString() !== now.toDateString()) {
        resetMissions('daily');
      }
  
      // Check weekly reset - use user-specific key
      const lastWeeklyReset = localStorage.getItem(`${currentUserId}_weeklyResetDate`);
      if (lastWeeklyReset) {
        const resetDate = new Date(lastWeeklyReset);
        if (now >= resetDate) {
          resetMissions('weekly');
        }
      }
    };
  
    // Run immediately on mount
    checkReset();
  
    // Then set up interval to check periodically (every hour instead of every minute)
    const interval = setInterval(checkReset, 1000 * 60 * 60);
  
    return () => clearInterval(interval);
  }, [currentUserId]);

  useEffect(() => {
    const storedShowTimeLeft = {};
    const storedShowAllTimeCompleted = {};
  
    dailyMissions.forEach((mission) => {
      const storedValue = localStorage.getItem(getUserKey(`showTimeLeft_${mission.id}`));
      if (storedValue) {
        storedShowTimeLeft[mission.id] = JSON.parse(storedValue);
      }
    });
    
    weeklyMissions.forEach((mission) => {
      const storedValue = localStorage.getItem(getUserKey(`showTimeLeft_${mission.id}`));
      if (storedValue) {
        storedShowTimeLeft[mission.id] = JSON.parse(storedValue);
      }
    });
    
    allMissions.allTime.forEach((mission) => {
      const storedValue = localStorage.getItem(getUserKey(`showAllTimeCompleted_${mission.id}`));
      if (storedValue) {
        storedShowAllTimeCompleted[mission.id] = JSON.parse(storedValue);
      }
    });
  
    setShowTimeLeft(storedShowTimeLeft);
    setShowAllTimeCompleted(storedShowAllTimeCompleted);
  }, [dailyMissions, weeklyMissions, currentUserId]);

  const isMissionCompleted = (mission) => {
    return missionProgress[mission.id] >= mission.goal;
  };

  

  return (
    <div className="flex flex-col h-full w-full">
  
    <div
        className="flex-1 flex flex-wrap gap-2 w-full overflow-y-auto custom-scrollbar pr-3"
      >
        {/* <button
          className="bg-blue-500 text-white w-full px-4 py-2 rounded-lg"
          onClick={handleResetMissions}
        >
          Reset Daily Missions
        </button> */}

        <div className=" w-full space-y-4">
          {/* Daily Missio */}
            
            <div className="ena">
              <h3 className="text-2xl font-semibold mb-2">Dienas</h3>
              <div className="space-y-2">
                {dailyMissions.map((mission) => {
                  const isClaimed = localStorage.getItem(getUserKey(`mission_claimed_${mission.id}`));
                  const showClaimedState = isClaimed || showTimeLeft[mission.id];
                  
                  return (
                    <div key={mission.id} className="bg-green-200 p-3 rounded-lg shadow-md relative border-2 border-green-400">
                      {isMissionCompleted(mission) && (
                        <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                          {showClaimedState ? (
                            <span className="flex text-lg font-bold flex-col items-center">
                              <span className="text-white">Jaunas misijas pēc</span>
                              <span>{formatTimeLeft(timeLeft.daily)}</span>
                            </span>
                          ) : (
                            <button
                                className="text-white px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 
                                hover:from-yellow-600 ena hover:via-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg 
                                hover:shadow-yellow-500/30"
                                onClick={() => handleShowTimeLeft(mission.id, 'daily')}>
                                Saņemt
                              </button>
                          )}
                        </div>
                      )}
                      <p className="text-md">{mission.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="w-full bg-gray-200 border border-gray-400 rounded-full h-2.9">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-red-500 to-green-500"
                            style={{
                              width: `${(Math.min(missionProgress[mission.id] || 0, mission.goal) / mission.goal) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm ml-2">
                          {Math.min(missionProgress[mission.id] || 0, mission.goal)}/{mission.goal}
                        </span>
                      </div>
                      <div className="flex justify-center items-center mt-2 gap-3">
                        <div className="flex items-center">
                          <span className="text-[#ffff00] font-medium">+{mission.reward.coins}</span>
                          <img
                            src="/images/icons/coin.png"
                            alt="Coin"
                            className="w-5 h-5 object-contain ml-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-[#3eff00] font-medium">+{mission.reward.xp}</span>
                          <img
                            src="/images/icons/xp.png"
                            alt="XP"
                            className="w-5 h-5 object-contain ml-1"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Missions */}
            <div className="ena">
              <h3 className="text-2xl font-semibold mb-2">Nedēļas</h3>
              <div className="space-y-2">
                {weeklyMissions.map((mission) => {
                  const isClaimed = localStorage.getItem(getUserKey(`mission_claimed_${mission.id}`));
                  const showClaimedState = isClaimed || showTimeLeft[mission.id];
                  
                  return (
                    <div key={mission.id} className="bg-orange-200 p-3 rounded-lg shadow-md relative border-2 border-orange-400">
                      {isMissionCompleted(mission) && (
                        <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                          {showClaimedState ? (
                            <span className="flex text-lg font-bold flex-col items-center">
                              <span className="text-white">Jaunas misijas pēc</span>
                              <span>{formatTimeLeft(timeLeft.weekly)}</span>
                            </span>
                          ) : (
                            <button
                              className="text-white px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 
                                hover:from-yellow-600 ena hover:via-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg 
                                hover:shadow-yellow-500/30"
                              onClick={() => handleShowTimeLeft(mission.id, 'weekly')}
                            >
                              Saņemt
                            </button>
                          )}
                        </div>
                      )}
                      <p className="text-md">{mission.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="w-full bg-gray-200 border border-gray-400 rounded-full h-2.9">
                          <div
                            className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full"
                            style={{
                              width: `${(Math.min(missionProgress[mission.id] || 0, mission.goal) / mission.goal) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm ml-2">
                          {Math.min(missionProgress[mission.id] || 0, mission.goal)}/{mission.goal}
                        </span>
                      </div>
                      <div className="flex justify-center items-center mt-2 gap-3">
                        <div className="flex items-center">
                          <span className="text-[#ffff00] font-medium">+{mission.reward.coins}</span>
                          <img
                            src="/images/icons/coin.png"
                            alt="Coin"
                            className="w-5 h-5 object-contain ml-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-[#3eff00] font-medium">+{mission.reward.xp}</span>
                          <img
                            src="/images/icons/xp.png"
                            alt="XP"
                            className="w-5 h-5 object-contain ml-1"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All-Time Missions */}
            <div className="ena">
              <h3 className="text-2xl font-semibold mb-2">Visu Laiku</h3>
              <div className="space-y-2">
                {allMissions.allTime.map((mission) => {
                  const isClaimed = localStorage.getItem(getUserKey(`mission_claimed_${mission.id}`));
                  const showClaimedState = isClaimed || showAllTimeCompleted[mission.id];
                  
                  return (
                    <div key={mission.id} className="bg-red-200 p-3 rounded-lg shadow-md relative border-2 border-red-400">
                      {isMissionCompleted(mission) && (
                        <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                          {showClaimedState ? (
                            <span className="flex text-lg font-bold flex-col items-center">
                              <span className="text-white">Misija izpildīta</span>
                            </span>
                          ) : (
                            <button
                              className="text-white px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 
                                hover:from-yellow-600 ena hover:via-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg 
                                hover:shadow-yellow-500/30"
                              onClick={() => handleShowAllTimeCompleted(mission.id)}
                            >
                              Saņemt
                            </button>
                          )}
                        </div>
                      )}
                      <p className="text-md">{mission.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="w-full bg-gray-200 border border-gray-400 rounded-full h-2.9">
                          <div
                            className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full"
                            style={{
                              width: `${(Math.min(missionProgress[mission.id] || 0, mission.goal) / mission.goal) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm ml-2">
                          {Math.min(missionProgress[mission.id] || 0, mission.goal)}/{mission.goal}
                        </span>
                      </div>
                      <div className="flex justify-center items-center mt-2 gap-3">
                        <div className="flex items-center">
                          <span className="text-[#ffff00] font-medium">+{mission.reward.coins}</span>
                          <img
                            src="/images/icons/coin.png"
                            alt="Coin"
                            className="w-5 h-5 object-contain ml-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-[#3eff00] font-medium">+{mission.reward.xp}</span>
                          <img
                            src="/images/icons/xp.png"
                            alt="XP"
                            className="w-5 h-5 object-contain ml-1"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


        </div>
      </div>
      <div className="text-md gap-2 border-b-2 border-gray-300 pb-2 flex items-center w-full"></div>
    </div>
    
  );
};

export default Missions;