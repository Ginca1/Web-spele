import { useState, useEffect } from 'react';
import { FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from "react-icons/fa6";
import { HiVolumeUp } from "react-icons/hi";
import UpdateProfileInformation from '../Pages/Profile/Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from '../Pages/Profile/Partials/UpdatePasswordForm';
import DeleteUserForm from '../Pages/Profile/Partials/DeleteUserForm';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { usePage } from '@inertiajs/react';

export default function Settings() {
    const [showPopup, setShowPopup] = useState(false);
    const [volume, setVolume] = useState(80); // Default volume at 80%
    
  
    const { props } = usePage();
    const user = props.auth.user;

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleVolumeChange = (event) => {
        setVolume(event.target.value);
    };

    useEffect(() => {
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.style.setProperty('--volume-level', `${volume}%`);
        }
    }, [volume]);

    const renderVolumeIcon = () => {
        if (volume == 0) {
            return <FaVolumeXmark className="icon-volume" />;
        } else if (volume > 0 && volume <= 30) {
            return <FaVolumeLow className="icon-volume" />;
        } else if (volume > 30 && volume <= 70) {
            return <HiVolumeUp className="icon-volume" />;
        } else {
            return <FaVolumeHigh className="icon-volume" />;
        }
    };
    

    return (
        <>
            <div className="settings" onClick={togglePopup}>
                <div className="rowH">
                    <div className="settings-img"></div>
                </div>
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <div className="mid">
                            <div className="rowL">
                                <div className="settings-T">
                                    Iestatījumi
                                </div>
                            </div>
                            <div className="rowL">
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>

                                <button className="close-button" onClick={togglePopup}>
                                    &times;
                                </button>
                            </div>
                        </div>

                        <div className="scrollable-content">
                            <div className="rowL volume-container">
                                {renderVolumeIcon()}
                                <div className="volume">
                                    Skaņa: {volume}%
                                </div>
                            </div>
                            <div className="rowW">
                                <div className="volume-bar-container">
                                    <input 
                                        type="range" 
                                        className="volume-slider" 
                                        min="0" 
                                        max="100" 
                                        value={volume} 
                                        onChange={handleVolumeChange} 
                                        style={{
                                            background: `linear-gradient(to right, #18EE3A ${volume}%, #ccc ${volume}%)`
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <div className="set-box">
                                <div className="profile-update">
                                    <div className="rowW">
                                        <div className="profile-title">
                                            Atjaunināt profilu
                                        </div>
                                    </div>
                                  
                                    <UpdateProfileInformation 
                                        mustVerifyEmail={props.mustVerifyEmail} 
                                        status={props.status} 
                                    />
                                </div>
                                <div className="password-update">
                                    
                                    <div className="rowW">
                                        <div className="profile-title">
                                            Atjaunināt paroli
                                        </div>
                                    </div>
                                    <UpdatePasswordForm />
                                </div>
                            </div>
                           
                            
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
