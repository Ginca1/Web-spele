import { Head, usePage, Link } from '@inertiajs/react'; 
import { useEffect, useState } from 'react';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { LuUserCircle } from "react-icons/lu";
import { IoGlobe } from "react-icons/io5";
import React from 'react';

const Lobby = ({ players = [], onStartGame }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleRoomClick = (index) => {
        setSelectedRoom(index);
    };

    return (
        <div className="background-container">
            <div className="main">
                <div className="header">
                    <div className="rowL-">
                    <Link href={route('home')} className="game2">
                            <span>P</span><span>r</span><span>ā</span><span>t</span><span>a</span>
                            <span>&nbsp;</span>
                            <span>D</span><span>u</span><span>e</span><span>ļ</span><span>i</span>
                            </Link>
                    </div>
                </div>

                <div className="rowW-M2">
                    <div className="lobby-container">
                        <div className="lobby-head">
                            <Link href={route('home')} className="react-icon">
                                <IoArrowBackCircleSharp /> 
                            </Link>
                            <div className="room-title">ISTABAS</div>
                        </div>

                        <div className="room-background">
                            <div className="scrollElements">
                                {["Valstis", "Matemātika", "Sports"].map((roomName, index) => (
                                    <div
                                        key={index}
                                        className={`rooms ${selectedRoom === index ? 'selected-room' : ''}`}
                                        onClick={() => handleRoomClick(index)}
                                    >
                                        <div className={`type-image-${roomName.toLowerCase()}`}></div>
                                        <div className="type-name">{roomName}</div>
                                        <div className="roomInfo">
                                            <div className="roomInfoUser">
                                                <div className="user-icon"><FaUserAlt /></div>
                                                <div className="userBellow-icon">{/* display users that are in room */}0/2</div>
                                            </div>
                                            {/* Conditional rendering for roomInfoContinent */}
                                            {roomName !== "Matemātika" && roomName !== "Sports" && (
                                                <div className="roomInfoContinent">
                                                    <div className="user-icon"><IoGlobe /></div>
                                                    <div className="userBellow-icon">{/* display region */}Visi</div>
                                                </div>
                                            )}
                                            <div className="roomInfoCreated">
                                                <div className="user-icon"><LuUserCircle /></div>
                                                <div className="userBellow-icon">  {/* display user that created room */}Sistēma</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rowW-M2">
                        <Link href={route('create')} className="create-game-button">
                        Izveidot istabu
                        </Link>
                           
                            <button
                                className={`start-game-button ${selectedRoom === null ? 'disabled' : ''}`}
                                onClick={selectedRoom !== null ? onStartGame : null}
                                disabled={selectedRoom === null}  // Disable the button if no room is selected
                            >
                                Tālāk
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
