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
    const [volume, setVolume] = useState(80); 
    
    const rewardSound = new Audio('/sounds/reward.mp3');
  
    const { props } = usePage();
    const user = props.auth.user;

    const togglePopup = () => {
        setShowPopup(!showPopup);
        rewardSound.play();
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
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[2000]">
                    <div className="bg-[#F8FAFC] w-[70vw] h-full max-h-[90vh] p-5 rounded-lg shadow-lg relative text-center overflow-hidden flex flex-col z-[2001]">

                    <img
                            src="/images/icons/close.png"
                            alt="Close"
                            onClick={togglePopup}
                            className="w-9 h-9 object-contain absolute top-2 right-2 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 hover:rotate-6"
                        />
                        <div className="flex justify-center items-center px-4 w-full">
                            <div className="flex flex-row justify-start items-center flex-wrap w-full">
                                <div className="settings-T">
                                    Iestatījumi
                                </div>
                            </div>
                            
                        </div>

                        <div className="scrollable-content">
                            <div className="flex flex-row justify-start items-center flex-wrap w-full volume-container">
                                {renderVolumeIcon()}
                                <div className="volume">
                                    Skaņa: {volume}%
                                </div>
                            </div>
                            <div className="flex flex-row justify-center items-center flex-wrap w-full">
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
                            
                            <div className="flex items-center grid grid-cols-2 px-4 w-full gap-[15px]">
                                <div className="border-none h-full mt-[7%] bg-[#eeeeee] rounded-md p-[15px]">
                                    <div className="flex flex-row justify-center items-center flex-wrap w-full">
                                        <div className="finish text-white font-bold text-3xl">
                                            Atjaunināt profilu
                                        </div>
                                    </div>
                                  
                                    <UpdateProfileInformation 
                                        mustVerifyEmail={props.mustVerifyEmail} 
                                        status={props.status} 
                                    />
                                </div>
                                <div className="border-none h-full mt-[7%] bg-[#eeeeee] rounded-md p-[15px]">
                                    
                                    <div className="rowW">
                                        <div className="finish text-white font-bold text-3xl">
                                            Atjaunināt paroli
                                        </div>
                                    </div>
                                    <UpdatePasswordForm />
                                </div>
                            </div>
                           
                            <div className="flex flex-row justify-center mt-12 items-center flex-wrap w-full">
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                               Iziet
                            </ResponsiveNavLink>

                                
                            </div>
                            {/* <DeleteUserForm /> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
