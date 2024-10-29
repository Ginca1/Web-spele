import { Head, usePage, Link } from '@inertiajs/react'; 
import { useEffect, useState } from 'react';
import { IoArrowBackCircleSharp, IoGlobe } from "react-icons/io5";
import { MdVisibility } from "react-icons/md";
import React from 'react';

const Create = ({ players = [], onStartGame }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isPrivateRoom, setIsPrivateRoom] = useState(false);
    const [region, setRegion] = useState('Visi'); // To store selected region

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        // Optionally navigate directly to the room if you want to display it immediately
        // window.location.href = `http://127.0.0.1:8000/rooms/${room}`;
    };

    const handleTogglePrivacy = () => {
        setIsPrivateRoom(!isPrivateRoom);
    };

    const handleCreateRoom = async () => {
        const roomData = {
            theme: selectedRoom,
            region: region,
            privacy: isPrivateRoom ? 'private' : 'public'
        };
    
        try {
            const response = await fetch(route('lobby.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify(roomData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to create room');
            }
    
            const data = await response.json();
    
            
            window.location.href = `/lobby/${data.room_code}`;
        } catch (error) {
            console.error(error.message); 
        }
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
                            <Link href={route('lobby')} className="react-icon">
                                <IoArrowBackCircleSharp /> 
                            </Link>
                            <div className="room-title">IZVEIDOT</div>
                        </div>
                        <div className="room-create-background">
                            <div className="scrollElements">
                                <div className="settings-box">
                                    <div className="rowW">
                                        <div className="create-lobby-text">
                                            Iestatījumi
                                        </div>
                                    </div>
                                    <div className="rowW">
                                        <div className="user-icon"><IoGlobe /></div>
                                        <div className="region-text">Izvēlies kontinentu</div>
                                        <div className="region-select">
                                            <select name="region" onChange={(e) => setRegion(e.target.value)}>
                                                <option value="Visi">Visi</option>
                                                <option value="Eiropa">Eiropa</option>
                                                <option value="Āzija">Āzija</option>
                                                <option value="Āfrika">Āfrika</option>
                                                <option value="Ziemeļamerika">Ziemeļamerika</option>
                                                <option value="Dienvidamerika">Dienvidamerika</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="rowW">
                                        <div className="user-icon"><MdVisibility /></div>
                                        <div className="region-text">Privāta istaba</div>
                                        <div className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                id="privateRoomToggle" 
                                                checked={isPrivateRoom} 
                                                onChange={handleTogglePrivacy}
                                            />
                                            <label htmlFor="privateRoomToggle" className="switch-label"></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="theme-box">
                                    <div className="rowW">
                                        <div className="create-lobby-text1">
                                            Tēmas
                                        </div>
                                    </div>
                                    <div className="scrollElements">  
                                        <div 
                                            className={`rooms-create ${selectedRoom === 'Valstis' ? 'selected-room' : ''}`} 
                                            onClick={() => handleRoomClick('Valstis')}
                                        >
                                            <div className="type-image-valstis"> </div>
                                            <div className="type-name-create">Valstis</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rowW-M2">
                            <button 
                                className='create-game-button' 
                                onClick={handleCreateRoom} // Trigger the create room function
                                disabled={!selectedRoom} 
                            >
                                Jauna istaba
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;
