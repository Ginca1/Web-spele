import React, { useState, useEffect } from 'react';

export const allMissions = {
  daily: [
    { id: 1, type: 'country', description: 'Uzmini 15 valstis', reward: { coins: 20, xp: 20 }, goal: 2 },
    { id: 2, type: 'hint', description: 'Izmanto 3 padomus', reward: { coins: 75, xp: 50 }, goal: 2 },
    { id: 3, type: 'country', description: 'Uzmini 25 valstis', reward: { coins: 45, xp: 25 }, goal: 2 },
    { id: 4, type: 'flag', description: 'Izmanto 1 karogu', reward: { coins: 30, xp: 40 }, goal: 2 },
    { id: 5, type: 'country', description: 'Uzmini 10 valstis', reward: { coins: 10, xp: 25 }, goal: 2 },
    { id: 6, type: 'hint', description: 'Izmanto 1 padomus', reward: { coins: 25, xp: 20 }, goal: 2 },
  ],
  weekly: [
    { id: 7, type: 'country', description: 'Uzmini 150 valstis', reward: { coins: 300, xp: 400 }, goal: 2 },
    { id: 8, type: 'flag', description: 'Izmanto 7 karogus', reward: { coins: 400, xp: 200 }, goal: 2 },
    { id: 9, type: 'country', description: 'Uzmini 200 valstis', reward: { coins: 400, xp: 500 }, goal: 2 },
    { id: 10, type: 'hint', description: 'Izmanto 10 padomus', reward: { coins: 500, xp: 300 }, goal: 2 },
    { id: 11, type: 'country', description: 'Uzmini 165 valstis', reward: { coins: 375, xp: 475 }, goal: 2 },
    { id: 12, type: 'flag', description: 'Izmanto 10 karogus', reward: { coins: 500, xp: 225 }, goal: 2 },
  ],
  allTime: [
    { id: 13, type: 'country', description: 'Uzmini 1000 valstis', reward: { coins: 2000, xp: 3000 }, goal: 2 },
    { id: 14, type: 'hint', description: 'Izmanto 100 padomus', reward: { coins: 4000, xp: 4500 }, goal: 2 },
    { id: 15, type: 'country', description: 'Uzmini 2000 valstis', reward: { coins: 5000, xp: 4000 }, goal: 2 },
    { id: 16, type: 'flag', description: 'Izmanto 50 karogus', reward: { coins: 2000, xp: 2500 }, goal: 2 },
    { id: 17, type: 'country', description: 'Uzmini 3500 valstis', reward: { coins: 7000, xp: 10000 }, goal: 2 },
    { id: 18, type: 'hint', description: 'Izmanto 200 padomus', reward: { coins: 8000, xp: 9000 }, goal: 2 },
  ],
};

const Missions = ({ missionProgress, setMissionProgress, containerHeight = "33rem", setCoins = () => {}, coins = 0, currentUserId = null  }) => {
  const [dailyMissions, setDailyMissions] = useState([]);
  const [weeklyMissions, setWeeklyMissions] = useState([]);
  const [showTimeLeft, setShowTimeLeft] = useState({});
  const [showAllTimeCompleted, setShowAllTimeCompleted] = useState({});
  const [timeLeft, setTimeLeft] = useState({ daily: 0, weekly: 0 }); 

  const rewardSound = new Audio('/sounds/reward.mp3');
  

  const selectRandomMissions = (missions, count) => {
    const shuffled = [...missions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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
  
    // Don't clear all progress - just progress for the missions being reset
    const storedProgress = JSON.parse(localStorage.getItem(`${currentUserId}_missionProgress`)) || {};
    const updatedProgress = { ...storedProgress };
  
    selectedMissions.forEach((mission) => {
      // Only reset progress if this mission is being replaced
      if (!selectedMissions.some(m => m.id === mission.id)) {
        delete updatedProgress[mission.id];
      }
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
        <button
          className="bg-blue-500 text-white w-full px-4 py-2 rounded-lg"
          onClick={handleResetMissions}
        >
          Reset Daily Missions
        </button>

        <div className="mt-4 w-full space-y-4">
          {/* Daily Missio */}
            
            <div className="ena">
              <h3 className="text-2xl font-semibold mb-2">Dienas</h3>
              <div className="space-y-2">
                {dailyMissions.map((mission) => {
                  const isClaimed = localStorage.getItem(getUserKey(`mission_claimed_${mission.id}`));
                  const showClaimedState = isClaimed || showTimeLeft[mission.id];
                  
                  return (
                    <div key={mission.id} className="bg-green-100 p-3 rounded-lg shadow-md relative">
                      {isMissionCompleted(mission) && (
                        <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                          {showClaimedState ? (
                            <span className="flex text-lg font-bold flex-col items-center">
                              <span className="text-white">Jaunas misijas pēc</span>
                              <span>{formatTimeLeft(timeLeft.daily)}</span>
                            </span>
                          ) : (
                            <button
                              className="text-white bg-blue-500 px-4 py-2 rounded-lg"
                              onClick={() => handleShowTimeLeft(mission.id, 'daily')}
                            >
                              Claim 
                            </button>
                          )}
                        </div>
                      )}
                      <p className="text-md">{mission.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
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
                      <div className="flex justify-center items-center mt-2">
                        <span className="text-[#ffff00]">+{mission.reward.coins} monētas</span>
                        <span className="text-[#3eff00] ml-2">+{mission.reward.xp} XP</span>
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
                    <div key={mission.id} className="bg-orange-100 p-3 rounded-lg shadow-md relative">
                      {isMissionCompleted(mission) && (
                        <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                          {showClaimedState ? (
                            <span className="flex text-lg font-bold flex-col items-center">
                              <span className="text-white">Jaunas misijas pēc</span>
                              <span>{formatTimeLeft(timeLeft.weekly)}</span>
                            </span>
                          ) : (
                            <button
                              className="text-white bg-blue-500 px-4 py-2 rounded-lg"
                              onClick={() => handleShowTimeLeft(mission.id, 'weekly')}
                            >
                              Claim
                            </button>
                          )}
                        </div>
                      )}
                      <p className="text-md">{mission.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(Math.min(missionProgress[mission.id] || 0, mission.goal) / mission.goal) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm ml-2">
                          {Math.min(missionProgress[mission.id] || 0, mission.goal)}/{mission.goal}
                        </span>
                      </div>
                      <div className="flex justify-center items-center mt-2">
                        <span className="text-[#ffff00]">+{mission.reward.coins} monētas</span>
                        <span className="text-[#3eff00] ml-2">+{mission.reward.xp} XP</span>
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
                    <div key={mission.id} className="bg-red-100 p-3 rounded-lg shadow-md relative">
                      {isMissionCompleted(mission) && (
                        <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                          {showClaimedState ? (
                            <span className="flex text-lg font-bold flex-col items-center">
                              <span className="text-white">Misija izpildīta</span>
                            </span>
                          ) : (
                            <button
                              className="text-white bg-blue-500 px-4 py-2 rounded-lg"
                              onClick={() => handleShowAllTimeCompleted(mission.id)}
                            >
                              Claim 
                            </button>
                          )}
                        </div>
                      )}
                      <p className="text-md">{mission.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(Math.min(missionProgress[mission.id] || 0, mission.goal) / mission.goal) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm ml-2">
                          {Math.min(missionProgress[mission.id] || 0, mission.goal)}/{mission.goal}
                        </span>
                      </div>
                      <div className="flex justify-center items-center mt-2">
                        <span className="text-[#ffff00]">+{mission.reward.coins} monētas</span>
                        <span className="text-[#3eff00] ml-2">+{mission.reward.xp} XP</span>
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