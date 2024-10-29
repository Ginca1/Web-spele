import React, { useState } from 'react';

const History = ({ }) => {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <>
        <div className="history" onClick={togglePopup}></div>
            
            

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <div className="rowW">
                        <div className="history-header">
                            <div className="settings-T">Vēsture</div>
                            <button className="close-button" onClick={togglePopup}>
                                    &times;
                                </button>
                        </div>
                        </div>
                        <div className="rowW-M5">
                        <div className="box">
                            <h1>Vēstures sarakts</h1>
                        </div>
                        </div>
                        </div>
                    </div>
                
            )}
        </>
    );
};

export default History;
