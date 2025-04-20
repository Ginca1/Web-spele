import React, { useEffect, useState, useCallback } from 'react';

const Level = () => {
  const [levelData, setLevelData] = useState({ 
    level: 1, 
    xp: 0,
    xpneeded: 100
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levelingUp, setLevelingUp] = useState(false);

  const levelSound = new Audio('/sounds/level-up.mp3');

  const formatXP = useCallback((xp) => {
    const xpNumber = Number(xp);
    if (isNaN(xpNumber)) return '0';
    
    if (xpNumber >= 1000000) {
      const millions = xpNumber / 1000000;
      return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
    }
    if (xpNumber >= 1000) {
      const thousands = xpNumber / 1000;
      return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(2)}k`;
    }
    return Math.floor(xpNumber).toString();
  }, []);

  const getCsrfToken = () => document.querySelector('meta[name="csrf-token"]').content;

  const fetchData = useCallback(async (signal) => {
    try {
      const res = await fetch('/user-data', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
        signal
      });
      
      if (!res.ok) throw new Error('Network error');
      
      const data = await res.json();
      setLevelData(prev => {
        
        if (prev.level !== data.level || prev.xp !== data.xp) {
          return {
            ...data,
            xpneeded: data.xpneeded || Math.floor(100 * Math.pow(1.2, data.level - 1))
          };
        }
        return prev;
      });
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLevelUp = useCallback(async () => {
    setLevelingUp(true);
    try {
      const res = await fetch('/level-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken()
        },
        credentials: 'include'
       
      });

      levelSound.play();

      if (!res.ok) throw new Error('Level up failed');
      
      const data = await res.json();
      setLevelData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLevelingUp(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    
    // Fast initial load
    fetchData(abortController.signal);
    
    let retryDelay = 500;
    let retryTimer;
    
    const pollData = () => {
      fetchData(abortController.signal);
      // Speed up polling if changes were detected recently
      retryDelay = levelData.xp > 0 ? 300 : 1000;
      retryTimer = setTimeout(pollData, retryDelay);
    };
    
    // Start polling after initial load
    const initialTimer = setTimeout(pollData, 300);
    
    return () => {
      abortController.abort();
      clearTimeout(initialTimer);
      clearTimeout(retryTimer);
    };
  }, [fetchData, levelData.xp]);

  // Auto level-up detection
  useEffect(() => {
    if (levelData.xp >= levelData.xpneeded && !levelingUp) {
      handleLevelUp();
    }
  }, [levelData.xp, levelData.xpneeded, handleLevelUp, levelingUp]);

  const progress = Math.min((levelData.xp / levelData.xpneeded) * 100, 100);

  if (loading) {
    return <div className="text-[22px] font-mono animate-pulse">...</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center gap-1 text-[22px] ena font-mono font-bold ${
          levelingUp ? 'text-yellow-500 scale-110' : 'text-gray-800'
        } transition-all duration-400`}>
          {levelData.level}
          <img 
            src="/images/icons/level.png" 
            alt="level" 
            className="w-[1.3rem] h-[1.3rem] object-contain"
          />
          {levelingUp && <span className="text-xs animate-pulse">↑</span>}
        </div>
      
      <div className="relative w-[90px] h-[16px] rounded-full border-2 border-gray-400 bg-gray-200 shadow-sm">
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold">
          {formatXP(levelData.xp)}/{formatXP(levelData.xpneeded)}
        </div>
      </div>

      {error && (
        <span 
          className="text-red-500 text-xs cursor-pointer"
          onClick={() => setError(null)}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Level;