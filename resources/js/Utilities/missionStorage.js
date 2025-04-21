export const clearUserMissions = (userId) => {
    if (!userId) return;
  
    // Clear all mission-related keys for this user
    const keysToRemove = [
      `${userId}_dailyResetDate`,
      `${userId}_dailyMissions`,
      `${userId}_weeklyResetDate`,
      `${userId}_weeklyMissions`,
      `${userId}_missionProgress`,
    ];
  
    // Add all mission-specific keys
    for (let i = 1; i <= 18; i++) { // Assuming mission IDs go up to 18
      keysToRemove.push(`${userId}_mission_claimed_${i}`);
      keysToRemove.push(`${userId}_showTimeLeft_${i}`);
      keysToRemove.push(`${userId}_showAllTimeCompleted_${i}`);
    }
  
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };
  
  export const initializeUserMissions = (userId) => {
    if (!userId) return;
  
    // Daily missions reset at midnight
    const dailyResetDate = new Date();
    dailyResetDate.setHours(24, 0, 0, 0); // Next midnight
    
    // Weekly missions reset on Sunday
    const weeklyResetDate = new Date();
    weeklyResetDate.setDate(weeklyResetDate.getDate() + (7 - weeklyResetDate.getDay()));
    weeklyResetDate.setHours(0, 0, 0, 0);
  
    // Initialize if not exists
    if (!localStorage.getItem(`${userId}_dailyResetDate`)) {
      localStorage.setItem(`${userId}_dailyResetDate`, dailyResetDate.toISOString());
      localStorage.setItem(`${userId}_dailyMissions`, JSON.stringify([]));
    }
  
    if (!localStorage.getItem(`${userId}_weeklyResetDate`)) {
      localStorage.setItem(`${userId}_weeklyResetDate`, weeklyResetDate.toISOString());
      localStorage.setItem(`${userId}_weeklyMissions`, JSON.stringify([]));
    }
  
    if (!localStorage.getItem(`${userId}_missionProgress`)) {
      localStorage.setItem(`${userId}_missionProgress`, JSON.stringify({}));
    }
  };
  


  