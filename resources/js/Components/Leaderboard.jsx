import React, { useState } from 'react';

const Leaderboard = ({}) => {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <>
            <div className="leaderboard" onClick={togglePopup}>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <div className="rowW">
                        <div className="leaderboard-header">
                            <div className="settings-T">Līderi</div>
                            <button className="close-button" onClick={togglePopup}>
                                    &times;
                                </button>
                        </div>
                        </div>
                        <div className="rowW-M5">
                        <div className="box">
                            <h1>Līderu sarakts</h1>
                        </div>
                        </div>
                        </div>
                    </div>
                
            )}
        </>
    );
};

export default Leaderboard;
