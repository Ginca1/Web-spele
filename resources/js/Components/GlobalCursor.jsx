import { useEffect, useState, useRef } from 'react';

export default function GlobalCursor() {
  const cursorRef = useRef(null);
  const [clicked, setClicked] = useState(false);
  const [cursorType, setCursorType] = useState('default');
  const posRef = useRef({ x: 0, y: 0 });

  // Ultra-smooth 1:1 move
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      cursor.style.left = `${posRef.current.x}px`;
      cursor.style.top = `${posRef.current.y}px`;
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      setCursorType(target?.dataset.cursor || 'default');
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

 

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: '0px',
        top: '0px',
        willChange: 'transform'
      }}
    >
      <img 
        src="../images/icons/cursor.png"
        alt="cursor"
        className={`w-5 h-5 ${clicked ? 'scale-90' : 'scale-100'} transition-transform duration-100`} 
      />
    </div>
  );
  
  
}
