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
                <div className="flex justify-between items-center px-4 w-full">
                    <div className="flex flex-row justify-start items-center flex-wrap w-full pl-4">
                        <Link href={route('home')} className="game2">
                            <span>P</span><span>r</span><span>ā</span><span>t</span><span>a</span>
                            <span>&nbsp;</span>
                            <span>D</span><span>u</span><span>e</span><span>ļ</span><span>i</span>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-row justify-center items-center flex-wrap w-full mt-[2%]">
                    <div className="bg-[#fdfdfb] w-[90vw] max-w-[1050px] h-auto max-h-[80vh] p-5 rounded-lg min-h-[70vh] shadow-md relative 
                    text-center overflow-hidden flex flex-col z-[2001]">
                        <div className="flex items-center justify-center relative border-b-2 border-gray-300">
                            <Link href={route('home')} className="react-icon">
                                <IoArrowBackCircleSharp /> 
                            </Link>
                            <div className="room-title">ISTABAS</div>
                        </div>

                        <div className="bg-gradient-to-br from-[#9fb0c9] to-[#6a8b9a] border-2 border-[#5d6c99] min-h-[50vh] h-auto rounded-[15px]
                        overflow-hidden relative shadow-lg transition-transform duration-300 ease-in-out">
                            <div className="flex flex-row items-center justify-center w-full flex-wrap my-2 gap-2 max-h-[394px] overflow-y-auto pr-4">
                                {/* Static Roomm */}
                                <div 
                                    className={`w-[226px] h-[231px] bg-gradient-to-br from-[#ffffff] to-[#f0f0f0] m-[2px_0_8px_10px] 
                                    rounded-lg cursor-pointer flex flex-col items-center justify-center p-5 transition-all duration-300 
                                    ease-in-out shadow-md relative overflow-hidden 
                                    ${selectedRoom === -1 ? 'border-[7px] border-[#00f] bg-[#e6eff2]' : ''}`} 
                                    onClick={() => handleRoomClick(-1)}
                                > 
                                    <div className={`type-image-valstis`}></div>
                                    <div className="flex items-center">
                                        <div className="font-nunito mr-[5px] pt-3 text-[19px] my-[10px_0_2px] text-[#797979] whitespace-nowrap w-[104%]
                                            overflow-hidden text-center pr-[4px]">
                                            Valstis
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center w-full my-[10px_0_2px]">
                                        <div className="mx-[12px] w-[55px] text-[#868d96] flex flex-col relative items-center justify-start p-0 overflow-hidden text-center whitespace-normal">
                                            <div className="user-icon"><IoGlobe /></div>
                                            <div className="userBellow-icon">Visi</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fetched Rooms from Database uwu */}
                                {rooms.map((room, index) => (
                                    <div
                                        key={room.id} 
                                        className={`w-[226px] h-[231px] bg-gradient-to-br from-[#ffffff] to-[#f0f0f0] m-[2px_0_8px_10px] 
                                            rounded-lg cursor-pointer flex flex-col items-center justify-center p-5 transition-all duration-300 
                                            ease-in-out shadow-md relative overflow-hidden 
                                            ${selectedRoom === index ? 'border-[7px] border-[#00f] bg-[#e6eff2]' : ''}`}
                                        onClick={() => handleRoomClick(index)}>
                                        {room.user.id === currentUser.id && ( 
                                            <button 
                                                className="absolute top-[-3px] left-[-2px] bg-[#f71616] text-white font-semibold border-none cursor-pointer px-[17px] py-[5px] 
                                                      text-[15px] font-nunito rounded-tl-[11px] rounded-br-[11px] transition duration-200 hover:bg-[#e80e0e]" 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    handleDeleteRoom(room.id);
                                                }}
                                            >
                                                Dzēst
                                            </button>
                                        )}
                                        <div className={`type-image-${room.theme ? room.theme.toLowerCase() : 'default'}`}></div>
                                        <div className="flex items-center">
                                            <div className="font-nunito mr-[5px] pt-3 text-[19px] my-[10px_0_2px] text-[#797979] whitespace-nowrap w-[104%]
                                             overflow-hidden text-center pr-[4px]">
                                                {room.theme}</div>
                                            <div className="font-nunito mr-[5px] pt-3 text-[16px] my-[10px_0_2px] text-[#797979] whitespace-nowrap w-full overflow-hidden text-center pl-[5px]">
                                                #{room.room_code.length > 4 ? `${room.room_code.substring(0, 4)}...` : room.room_code}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center w-full my-[10px_0_2px]">
                                            <div className="w-[55px] max-w-[55px] text-[#868d96] flex flex-col relative items-center justify-start p-0 text-center overflow-hidden whitespace-nowrap text-ellipsis">
                                                <div className="user-icon"><FaUserAlt /></div>
                                                <div className="userBellow-icon">
                                                    {room.current_players}/{room.max_players}
                                                </div>
                                            </div>
                                            <div className="mx-[12px] w-[55px] text-[#868d96] flex flex-col relative items-center justify-start p-0 overflow-hidden text-center whitespace-normal">
                                                <div className="user-icon"><IoGlobe /></div>
                                                <div className={room.region.length > 10 ? "userBellow-icon2" : "userBellow-icon"}>
                                                    {room.region}
                                                </div>
                                            </div>
                                            <div className="w-[55px] max-w-[55px] text-[#868d96] flex flex-col relative items-center justify-start p-0 text-center overflow-hidden whitespace-nowrap text-ellipsis">
                                                <div className="user-icon"><LuUserCircle /></div>
                                                <div className={room.user.name.length > 10 ? "userBellow-icon2" : "userBellow-icon"}>
                                                    {room.user.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-row justify-center items-center flex-wrap w-full mt-[2%]">
                            <Link href={route('create')} className="create-game-button">
                                Izveidot istabu
                            </Link>
                            {selectedRoom !== null ? (
                                <Link
                                    href={selectedRoom === -1 ? route('lobby.valstis') : `/lobby/${rooms[selectedRoom].room_code}`}
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