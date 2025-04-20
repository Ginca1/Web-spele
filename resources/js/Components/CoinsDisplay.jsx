import React, { useState, useEffect, useRef } from 'react';

const CoinsDisplay = ({ coins }) => {
    const [animate, setAnimate] = useState(false);
    const prevCoinsRef = useRef(coins);
  
    useEffect(() => {
      if (coins !== prevCoinsRef.current) {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timer);
      }
      prevCoinsRef.current = coins;
    }, [coins]);
  
    return (
      <div className="bg-white bg-opacity-80 rounded-lg py-1 px-3 mr-8 relative">
        <div className="flex items-center gap-3 justify-center">
          <img
            src="../images/icons/coin.png"
            alt="Coin"
            className={`w-9 h-9 object-contain ${animate ? 'coin-update' : ''}`}
          />
          <span className={`text-[#ffff00] text-3xl ena2  ${animate ? 'coin-update' : ''}`}>
            {coins}
          </span>
        </div>
      </div>
    );
  };
  export default CoinsDisplay;