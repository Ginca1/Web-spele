import { Head, usePage, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { IoArrowBackCircleSharp, IoGlobe } from "react-icons/io5";
import { MdVisibility } from "react-icons/md";
import React from 'react';

const Create = ({ players = [], onStartGame }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isPrivateRoom, setIsPrivateRoom] = useState(false);
    const [region, setRegion] = useState('Visi'); 
    const [hasRoom, setHasRoom] = useState(false); 
    const { props } = usePage();
    const currentUserId = props.auth.user.id; 

    useEffect(() => {
        fetchUserRoom(); 
    }, []);

    const fetchUserRoom = async () => {
        try {
            const response = await fetch(`/rooms/user/${currentUserId}`); 
            const data = await response.json();
            
            console.log("Rooms fetched:", data); 
            if (Array.isArray(data) && data.length > 0) {
                setHasRoom(true);
                console.log("Rooms found for user:", true);
            } else {
                setHasRoom(false);
                console.log("No rooms found for user:", false);
            }
        } catch (error) {
            console.error("Error fetching user rooms:", error);
        }
    };

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        console.log("Selected room:", room);
    };

    const handleTogglePrivacy = () => {
        setIsPrivateRoom(!isPrivateRoom);
    };

    const handleCreateRoom = async () => {
        if (hasRoom || !selectedRoom) return; 
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
                    <div className="bg-[#fdfdfb] w-[90vw] max-w-[1050px] h-auto max-h-[80vh] p-5 rounded-lg min-h-[70vh]
                     shadow-md relative text-center overflow-hidden flex flex-col z-[2001]">
                       <div className="flex items-center justify-center relative border-b-2 border-gray-300">
                            <Link href={route('lobby')} className="react-icon">
                                <IoArrowBackCircleSharp /> 
                            </Link>
                            <div className="room-title">IZVEIDOT</div>
                        </div>
                        <div className="bg-gradient-to-br from-[#9fb0c9] to-[#6a8b9a] flex p-5 border-2 border-[#5d6c99] 
                            min-h-[50vh] h-auto rounded-[15px] overflow-hidden relative 
                            shadow-md transition-transform duration-300 ease-in-out">
                            <div className="flex flex-row items-center justify-center w-full flex-wrap my-2 gap-2 max-h-[394px] overflow-y-auto pr-4">
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
                                    <div className="flex flex-row items-center justify-center w-full flex-wrap my-2 gap-2 max-h-[394px] overflow-y-auto pr-4">
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
                                className={`create-game-button ${!selectedRoom || hasRoom ? 'disabled' : ''}`}
                                onClick={handleCreateRoom}
                                disabled={!selectedRoom || hasRoom} 
                            >
                                Izveidot
                            </button>
                            {console.log("Button disabled:", !selectedRoom || hasRoom)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;
