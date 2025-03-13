import React, { useState, useEffect } from 'react';

export const allMissions = {
  daily: [
    { id: 1, type: 'country', description: 'Uzmini 5 valstis', reward: { coins: 10, xp: 50 }, goal: 2 },
    { id: 2, type: 'hint', description: 'Izmanto 2 padomus', reward: { coins: 5, xp: 20 }, goal: 2 },
    { id: 3, type: 'country', description: 'Uzmini 3 valstis bez kļūdām', reward: { coins: 15, xp: 75 }, goal: 2 },
    { id: 4, type: 'flag', description: 'Izmanto 1 karogu', reward: { coins: 8, xp: 40 }, goal: 2 },
    { id: 5, type: 'country', description: 'Uzmini 10 valstis', reward: { coins: 20, xp: 100 }, goal: 2 },
    { id: 6, type: 'hint', description: 'Izmanto 3 padomus', reward: { coins: 12, xp: 60 }, goal: 2 },
  ],
  weekly: [
    { id: 7, type: 'country', description: 'Uzmini 50 valstis', reward: { coins: 50, xp: 200 }, goal: 2 },
    { id: 8, type: 'flag', description: 'Izmanto 10 karogus', reward: { coins: 30, xp: 100 }, goal: 2 },
    { id: 9, type: 'country', description: 'Uzmini 100 valstis', reward: { coins: 100, xp: 500 }, goal: 2 },
    { id: 10, type: 'hint', description: 'Izmanto 20 padomus', reward: { coins: 60, xp: 300 }, goal: 2 },
    { id: 11, type: 'country', description: 'Uzmini 75 valstis', reward: { coins: 75, xp: 375 }, goal: 2 },
    { id: 12, type: 'flag', description: 'Izmanto 15 karogus', reward: { coins: 45, xp: 225 }, goal: 2 },
  ],
  allTime: [
    { id: 13, type: 'country', description: 'Uzmini 1000 valstis', reward: { coins: 500, xp: 1000 }, goal: 2 },
    { id: 14, type: 'hint', description: 'Izmanto 100 padomus', reward: { coins: 200, xp: 500 }, goal: 2 },
    { id: 15, type: 'country', description: 'Uzmini 500 valstis', reward: { coins: 250, xp: 750 }, goal: 2 },
    { id: 16, type: 'flag', description: 'Izmanto 50 karogus', reward: { coins: 100, xp: 250 }, goal: 2 },
    { id: 17, type: 'country', description: 'Uzmini 2000 valstis', reward: { coins: 1000, xp: 2000 }, goal: 2 },
    { id: 18, type: 'hint', description: 'Izmanto 200 padomus', reward: { coins: 400, xp: 1000 }, goal: 2 },
  ],
};

const Missions = ({ missionProgress, setMissionProgress }) => {
  const [dailyMissions, setDailyMissions] = useState([]);
  const [weeklyMissions, setWeeklyMissions] = useState([]);
  const [showTimeLeft, setShowTimeLeft] = useState({});
  const [showAllTimeCompleted, setShowAllTimeCompleted] = useState({});

  const selectRandomMissions = (missions, count) => {
    const shuffled = [...missions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const resetMissions = (type) => {
    const currentDate = new Date().toDateString();
    const selectedMissions = selectRandomMissions(allMissions[type], 3);
    localStorage.setItem(`${type}ResetDate`, currentDate);
    localStorage.setItem(`${type}Missions`, JSON.stringify(selectedMissions));
  
    // Clear old mission progress from localStorage
    const storedProgress = JSON.parse(localStorage.getItem('missionProgress')) || {};
    const updatedProgress = { ...storedProgress };
  
    selectedMissions.forEach((mission) => {
      // Remove mission progress
      if (updatedProgress[mission.id]) {
        delete updatedProgress[mission.id];
      }
  
      // ✅ Remove any showTimeLeft localStorage keys
      localStorage.removeItem(`showTimeLeft_${mission.id}`);
    });
  
    localStorage.setItem('missionProgress', JSON.stringify(updatedProgress));
    setMissionProgress(updatedProgress); // Sync state too
  
    if (type === 'daily') {
      setDailyMissions(selectedMissions);
    } else if (type === 'weekly') {
      setWeeklyMissions(selectedMissions);
    }
  };

  const handleResetMissions = () => {
    const updatedMissionProgress = { ...missionProgress };

    const allResettableIds = [...dailyMissions, ...weeklyMissions].map((m) => m.id);

    allResettableIds.forEach((id) => {
      delete updatedMissionProgress[id];
    });

    // Update localStorage
    localStorage.setItem('missionProgress', JSON.stringify(updatedMissionProgress));
    setMissionProgress(updatedMissionProgress);

    // Reset missions
    resetMissions('daily');
    resetMissions('weekly');
  };

  const calculateTimeLeft = (type) => {
    const now = new Date();
    let resetTime;

    if (type === 'daily') {
      resetTime = new Date(now);
      resetTime.setHours(24, 0, 0, 0); // Next midnight
    } else if (type === 'weekly') {
      resetTime = new Date(now);
      resetTime.setDate(resetTime.getDate() + (7 - resetTime.getDay())); // Next Sunday
      resetTime.setHours(0, 0, 0, 0); // Midnight
    }

    const difference = resetTime - now;
    return difference > 0 ? difference : 0;
  };

  const formatTimeLeft = (time) => {
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleShowTimeLeft = (missionId, type) => {
    const updatedShowTimeLeft = { ...showTimeLeft, [missionId]: true };
    setShowTimeLeft(updatedShowTimeLeft);
    localStorage.setItem(`showTimeLeft_${missionId}`, JSON.stringify(true));
  };

  const handleShowAllTimeCompleted = (missionId) => {
    const updatedShowAllTimeCompleted = { ...showAllTimeCompleted, [missionId]: true };
    setShowAllTimeCompleted(updatedShowAllTimeCompleted);
    localStorage.setItem(`showAllTimeCompleted_${missionId}`, JSON.stringify(true));
  };

  useEffect(() => {
    // Load missions from localStorage or reset them if necessary
    const loadMissions = (type) => {
      const lastReset = localStorage.getItem(`${type}ResetDate`);
      const storedMissions = localStorage.getItem(`${type}Missions`);
      const currentDate = new Date().toDateString();

      if (lastReset === currentDate && storedMissions) {
        const parsedMissions = JSON.parse(storedMissions);
        if (type === 'daily') {
          setDailyMissions(parsedMissions);
        } else if (type === 'weekly') {
          setWeeklyMissions(parsedMissions);
        }
      } else {
        resetMissions(type);
      }
    };

    loadMissions('daily');
    loadMissions('weekly');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const dailyTimeLeft = calculateTimeLeft('daily');
      const weeklyTimeLeft = calculateTimeLeft('weekly');

      if (dailyTimeLeft <= 0) {
        resetMissions('daily'); // Will also clear expired progress
      }

      if (weeklyTimeLeft <= 0) {
        resetMissions('weekly'); // Will also clear expired progress
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load showTimeLeft and showAllTimeCompleted states from localStorage
    const storedShowTimeLeft = {};
    const storedShowAllTimeCompleted = {};

    dailyMissions.forEach((mission) => {
      const storedValue = localStorage.getItem(`showTimeLeft_${mission.id}`);
      if (storedValue) {
        storedShowTimeLeft[mission.id] = JSON.parse(storedValue);
      }
    });
    weeklyMissions.forEach((mission) => {
      const storedValue = localStorage.getItem(`showTimeLeft_${mission.id}`);
      if (storedValue) {
        storedShowTimeLeft[mission.id] = JSON.parse(storedValue);
      }
    });
    allMissions.allTime.forEach((mission) => {
      const storedValue = localStorage.getItem(`showAllTimeCompleted_${mission.id}`);
      if (storedValue) {
        storedShowAllTimeCompleted[mission.id] = JSON.parse(storedValue);
      }
    });

    setShowTimeLeft(storedShowTimeLeft);
    setShowAllTimeCompleted(storedShowAllTimeCompleted);
  }, [dailyMissions, weeklyMissions]);

  const isMissionCompleted = (mission) => {
    return missionProgress[mission.id] >= mission.goal;
  };

  return (
    <div className="text-md gap-2 border-b-2 border-gray-300 pb-2 flex items-center w-full">
    
      <div className="flex flex-wrap gap-2 w-full max-h-[33rem] overflow-y-auto">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        onClick={handleResetMissions}
      >
        Reset Daily & Weekly Missions
      </button>
        {/* Missions Section */}
        <div className="mt-4 space-y-4">
          {/* Daily Missions */}
          <div className="ena">
            <h3 className="text-2xl font-semibold mb-2">Dienas</h3>
            <div className="space-y-2">
              {dailyMissions.map((mission) => (
                <div key={mission.id} className="bg-green-100 p-3 rounded-lg shadow-md relative">
                  {isMissionCompleted(mission) && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                      {showTimeLeft[mission.id] ? (
                       <span className="flex text-lg font-bold flex-col items-center">
                       <span className="text-white">Jaunas misijas pēc</span>
                       <span>{formatTimeLeft(calculateTimeLeft('daily'))}</span>
                     </span>
                      ) : (
                        <button
                          className="text-white bg-blue-500 px-4 py-2 rounded-lg"
                          onClick={() => handleShowTimeLeft(mission.id, 'daily')}
                        >
                          Show Time Left
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
                  <div className="flex items-center mt-2">
                    <span className="text-[#ffff00]">+{mission.reward.coins} monētas</span>
                    <span className="text-[#3eff00] ml-2">+{mission.reward.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Missions */}
          <div className="ena">
            <h3 className="text-2xl font-semibold mb-2">Nedēļas</h3>
            <div className="space-y-2">
              {weeklyMissions.map((mission) => (
                <div key={mission.id} className="bg-orange-100 p-3 rounded-lg shadow-md relative">
                  {isMissionCompleted(mission) && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                      {showTimeLeft[mission.id] ? (
                        <span className="text-white">
                          Time left: {formatTimeLeft(calculateTimeLeft('weekly'))}
                        </span>
                      ) : (
                        <button
                          className="text-white bg-blue-500 px-4 py-2 rounded-lg"
                          onClick={() => handleShowTimeLeft(mission.id, 'weekly')}
                        >
                          Show Time Left
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
                  <div className="flex items-center mt-2">
                    <span className="text-[#ffff00]">+{mission.reward.coins} monētas</span>
                    <span className="text-[#3eff00] ml-2">+{mission.reward.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All-Time Missions */}
          <div className="ena">
            <h3 className="text-2xl font-semibold mb-2">Visu Laiku</h3>
            <div className="space-y-2">
              {allMissions.allTime.map((mission) => (
                <div key={mission.id} className="bg-red-100 p-3 rounded-lg shadow-md relative">
                  {isMissionCompleted(mission) && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                      {showAllTimeCompleted[mission.id] ? (
                        <span className="text-white">Completed Mission</span>
                      ) : (
                        <button
                          className="text-white bg-blue-500 px-4 py-2 rounded-lg"
                          onClick={() => handleShowAllTimeCompleted(mission.id)}
                        >
                          Show Completed
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
                  <div className="flex items-center mt-2">
                    <span className="text-[#ffff00]">+{mission.reward.coins} monētas</span>
                    <span className="text-[#3eff00] ml-2">+{mission.reward.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions;