import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import axios from 'axios';
import { IoArrowBackCircleSharp } from "react-icons/io5";

const UserRoom = ({ room }) => {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/rooms/${room.id}/messages`);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [room.id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (messageInput.trim()) {
            try {
                const response = await axios.post(`/rooms/${room.id}/messages`, {
                    message: messageInput,
                });

               
                const newMessage = {
                    id: response.data.id,
                    message: response.data.message,
                    user: auth.user || { name: "Unknown User" }, 
                };

                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setMessageInput(""); 
            } catch (error) {
                console.error("Error sending message:", error);
            }
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
                        <Head title={`Lobby: ${room.room_code}`} />
                        <div className="lobby-head">
                        <Link href={route('lobby')} className="react-icon2">
                                <IoArrowBackCircleSharp /> 
                            </Link>
                            <h1 className="room-title">Sveicināts istabā: {room.room_code}</h1>
                        </div>
                      
                           
                            <div className="scrollElements">
                            <div className="room-details-card">
                                <div className="room-info">
                                    <p><strong>Tēma:</strong> {room.theme}</p>
                                    <p><strong>Reģions:</strong> {room.region}</p>
                                    <p><strong>Spēlētāji:</strong> {room.current_players}/{room.max_players}</p>
                                    {/* <p><strong>Status:</strong> {room.status}</p> */}
                                    <p><strong>Privātuma iestatījums:</strong> {room.privacy}</p>
                                </div>
                                <div className="invite-section">
                                    <h3>Uzaicini savu draugu!</h3>
                                    <p>Kopīgo šo saiti: <a href={window.location.href} className="invite-link">{window.location.href}</a></p>
                                </div>
                            </div>

                            {/* Chat Box */}
                            <div className="chat-container">
                                <strong>Čats</strong>
                                <div className="chat-messages">
                                    {messages.map((msg, index) => (
                                        <div key={index} className="chat-message">
                                            <strong>{msg.user && msg.user.name ? msg.user.name : "Unknown User"}:</strong> {msg.message}
                                        </div>
                                    ))}
                                </div>
                                <form className="chat-form" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Ieraksti ziņu..."
                                        className="chat-input"
                                    />
                                    <button type="submit" className="chat-send-button">Sūtīt</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRoom;
