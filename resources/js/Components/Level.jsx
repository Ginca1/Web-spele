import React, { useEffect, useState } from 'react';

const Level = () => {
  const [userData, setUserData] = useState({
    currentLevel: 1,
    currentXP: 0,
  });

  const xpToNextLevel = 100 * Math.pow(2, userData.currentLevel - 1);

//hpp bar sh sdf hover now dorb god bb noorr
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-data');
        const data = await response.json();
        setUserData({
          currentLevel: data.level,
          currentXP: data.xp,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
 
  const progressPercentage = (userData.currentXP / xpToNextLevel) * 100;

  return (
    <div className="flex flex-col space-y-4 mx-auto">
      <div className="flex items-center bg-white p-2 rounded-lg space-x-2">
        <div className="text-[22px] ena font-mono font-bold text-gray-800">
          {userData.currentLevel}
        </div>
        {/*Progress Bar */}
        <div className="relative w-[80px] h-[16px] rounded-full border-2 border-gray-400 bg-gray-200 shadow-sm font-mono">
          <div
            className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-green-400 to-green-600"
            style={{ width: `${progressPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-800 font-semibold leading-none">
            {userData.currentXP}/{xpToNextLevel} XP
          </div>
        </div>

      </div>
    </div>
  );
};

export default Level;
