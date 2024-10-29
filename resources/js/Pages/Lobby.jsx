import { Head, usePage, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { LuUserCircle } from "react-icons/lu";
import { IoGlobe } from "react-icons/io5";
import axios from 'axios'; 
import React from 'react';

const Lobby = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]); 
    const { props } = usePage();
    const currentUser = props.auth.user;

    const handleRoomClick = (index) => {
        setSelectedRoom(index);
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('/rooms'); 
                setRooms(response.data); 
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []); 

    const handleDeleteRoom = async (roomId) => {
        try {
            await axios.delete(`/rooms/${roomId}`); 
            setRooms(rooms.filter(room => room.id !== roomId)); 
            console.log("Room deleted successfully");
        } catch (error) {
            console.error("Failed to delete room:", error);
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
                            <Link href={route('home')} className="react-icon">
                                <IoArrowBackCircleSharp /> 
                            </Link>
                            <div className="room-title">ISTABAS</div>
                        </div>

                        <div className="room-background">
                            <div className="scrollElements">
                                {rooms.map((room, index) => (
                                    <div
                                        key={room.id} 
                                        className={`rooms ${selectedRoom === index ? 'selected-room' : ''}`}
                                        onClick={() => handleRoomClick(index)}
                                    >
                                        {room.user.id === currentUser.id && ( 
                                            <button 
                                                className="delete-room-button" 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    handleDeleteRoom(room.id);
                                                }}
                                            >
                                                Dzēst
                                            </button>
                                        )}
                                        <div className={`type-image-${room.theme ? room.theme.toLowerCase() : 'default'}`}></div>
                                        <div className="type-name-container">
                                            <div className="type-name">{room.theme}</div>
                                            <div className="type-name-code">
                                                #{room.room_code.length > 4 ? `${room.room_code.substring(0, 4)}...` : room.room_code}
                                            </div>
                                        </div>
                                        <div className="roomInfo">
                                            <div className="roomInfoUser">
                                                <div className="user-icon"><FaUserAlt /></div>
                                                <div className="userBellow-icon">
                                                    {room.current_players}/{room.max_players}
                                                </div>
                                            </div>
                                            <div className="roomInfoContinent">
                                                <div className="user-icon"><IoGlobe /></div>
                                                <div className={room.region.length > 10 ? "userBellow-icon2" : "userBellow-icon"}>
                                                    {room.region}
                                                </div>
                                            </div>
                                            <div className="roomInfoCreated">
                                                <div className="user-icon"><LuUserCircle /></div>
                                                <div className={room.user.name.length > 5 ? "userBellow-icon2" : "userBellow-icon"}>
                                                    {room.user.name}
                                                </div>
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
                            {selectedRoom !== null ? (
                                <Link
                                    href={`/lobby/${rooms[selectedRoom].room_code}`}
                                    className="start-game-button"
                                >
                                    Tālāk
                                </Link>
                            ) : (
                                <button
                                    className="start-game-button disabled"
                                    disabled
                                >
                                    Tālāk
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
