import HomeLayout from '@/Layouts/HomeLayout'; 
import { Head, usePage, Link } from '@inertiajs/react'; 
import Settings from '../Components/Settings'; 
import Leaderboard from '../Components/Leaderboard';
import Missions, { allMissions } from '../Components/Missions';
import Level from '../Components/Level';
import History from '../Components/History';
import CoinsDisplay from '../Components/CoinsDisplay';
import { useEffect, useState } from 'react';
import axios from 'axios';

const pictureMap = {
    1: '/images/dog.png',
    2: '/images/cat.png',
    3: '/images/frog.png',
    4: '/images/antilope.png',
    5: '/images/horse.png',
    6: '/images/lion.png',
    7: '/images/tiger.png',
    8: '/images/snake.png',
    9: '/images/deer.png',
};

const pictureCost = {
    1: 0,  2: 0,   3: 0,  4: 50,   5: 75,   6: 100,   7: 125,   8: 150,   9: 200,
};
//mm nn hh
const Home = () => {
    const user = usePage().props.auth.user; 
    const [privileges, setPrivileges] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(pictureMap[user.picture_id] || '/images/dog.png'); 
    const [selectedPictureId, setSelectedPictureId] = useState(null); 
    const [coins, setCoins] = useState(user.coins);
    const [purchasedPictures, setPurchasedPictures] = useState([]);

    const buySound = new Audio('/sounds/buy.mp3');
    

     const [missionProgress, setMissionProgress] = useState(() => {
            const savedProgress = localStorage.getItem('missionProgress');
            return savedProgress ? JSON.parse(savedProgress) : {};
          });

    useEffect(() => {
        if (user) {
            axios.get(`/privileges/${user.id}`).then(response => {
                setPrivileges(response.data);
            });
        }
    }, [user]);

    useEffect(() => {
        axios.get('/user/get-user-picture-id')
            .then(response => {
                setSelectedPictureId(response.data.picture_id);
            })
            .catch(error => {
                console.error('Error fetching picture_id:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('/user/get-user-owned-pictures')
            .then(response => {
                setPurchasedPictures(response.data.owned_pictures);
            })
            .catch(error => {
                console.error('Error fetching owned pictures:', error);
            });
    }, []);

    const handlePictureClick = (pictureId) => {
        const cost = pictureCost[pictureId];
        
        if (!purchasedPictures.includes(pictureId) && coins < cost) {
            alert("Nav pietiekami daudz liesmas, lai nopirktu šo bildi!");
            return;
        }

        axios.post('/user/purchase-picture', { picture_id: pictureId })
            .then(response => {
                setProfilePicUrl(pictureMap[pictureId]);
                setSelectedPictureId(pictureId);
                console.log(response.data.message);
                if (!purchasedPictures.includes(pictureId)) {
                    setCoins(prevCoins => prevCoins - cost);
                    setPurchasedPictures(prev => [...prev, pictureId]);
                }
            })
            .catch(error => {
                console.error('Error updating picture:', error);
            });
    };
    
    const getPriceDisplay = (pictureId) => {
        return purchasedPictures.includes(pictureId) ? '0' : pictureCost[pictureId];
    };

    const handlePurchasePrivilege = async (privilegeName, price) => {
        if (coins < price) {
            alert("Nav pietiekami daudz liesmas, lai iegādātos šo privilēģiju!");
            return;
        }
        
        try {
            const response = await axios.post('/user/purchase-privilege', { privilege_name: privilegeName });
            const { updatedCoins, updatedPrivileges } = response.data;
            setCoins(updatedCoins); 
            setPrivileges(updatedPrivileges); 
            buySound.play();
            console.log(response.data.message);
        } catch (error) {
            console.error('Error purchasing privilege:', error.response?.data?.message);
        }
    };

    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1218);

    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 1218);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <HomeLayout>
            <Head title="Homepage" />
            <div className="main">
                <div className="header">      
                    <div className="rowL-">
                    <Link href={route('home')} className="game2">
                            <span>P</span><span>r</span><span>ā</span><span>t</span><span>a</span>
                            <span>&nbsp;</span>
                            <span>D</span><span>u</span><span>e</span><span>ļ</span><span>i</span>
                        </Link>
                    </div>            
                    <div className="flex flex-row justify-end items-center flex-wrap w-full pr-8">
                        <div className="bg-white bg-opacity-80 rounded-lg py-1 px-3 mr-4">
                             <Level/>
                        </div>

                            <CoinsDisplay coins={coins} />

                        <Settings />
                    </div>
                </div>

                <div class="w-full h-screen grid grid-cols-3 gap-6 justify-items-center p-4">
                    {/* picture shop starts */}
                    <div className="col-span-1 w-full h-full flex flex-col rounded-md">
                        <div className="flex flex-row justify-center items-center flex-wrap w-full">
                            <div className="bg-[#FF5309] rounded-[7px] px-4">
                            <div className="flex flex-row justify-center items-center flex-wrap w-full h-full">
                                <div className="shop-title2">
                                     Aksesuāri
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow w-full bg-[#FFF5EA] p-2 px-4 rounded-[7px] overflow-y-auto">
                        <div className="grid grid-cols-3 gap-2 justify-items-center h-full">

                        <div className="flex flex-row justify-center items-center flex-wrap w-full h-full">
                            <div className={`value ${selectedPictureId === 1 ? 'selected' : ''}`} onClick={() => handlePictureClick(1)}>
                            <div className="flex flex-wrap justify-center items-center w-full">
                                <div className="dog"></div>
                                <div className="flex flex-wrap justify-center items-center w-full h-full mt-2">
                                {selectedPictureId === 1 ? (
                                    <p className='nauda ena2'>Izmanto</p>
                                ) : (
                                    <p className='nauda ena2'>{getPriceDisplay(1)}</p>
                                )}
                                </div>
                            </div>
                            </div>
                        </div>
                        
                        
                        <div className="flex flex-row justify-center items-center flex-wrap w-full h-full">
                            <div className={`value ${selectedPictureId === 2 ? 'selected' : ''}`} onClick={() => handlePictureClick(2)}>
                            <div className="flex flex-wrap justify-center items-center w-full">
                                <div className="cat"></div>
                                <div className="flex flex-wrap justify-center items-center w-full h-full mt-2">
                                {selectedPictureId === 2 ? (
                                    <p className='nauda ena2'>Izmanto</p>
                                ) : (
                                    <p className='nauda ena2'>{getPriceDisplay(2)}</p>
                                )}
                                </div>
                            </div>
                            </div>
                        </div>
                        

                        <div className="flex flex-row justify-center items-center flex-wrap w-full h-full">
                            <div className={`value ${selectedPictureId === 3 ? 'selected' : ''}`} onClick={() => handlePictureClick(3)}>
                            <div className="flex flex-wrap justify-center items-center w-full">
                                <div className="frog"></div>
                                <div className="flex flex-wrap justify-center items-center w-full h-full mt-2">
                                {selectedPictureId === 3 ? (
                                    <p className='nauda ena2'>Izmanto</p>
                                ) : (
                                    <p className='nauda ena2'>{getPriceDisplay(3)}</p>
                                )}
                                </div>
                            </div>                                 
                            </div>
                        </div>
                        
                        
                        <div className="flex flex-row justify-center items-center flex-wrap w-full h-full">
                            <div className={`value ${selectedPictureId === 4 ? 'selected' : ''}`} onClick={() => handlePictureClick(4)}>
                            <div className="flex flex-wrap justify-center items-center w-full">
                                <div className="antilope"></div>
                                <div className="flex flex-wrap justify-center items-center w-full h-full mt-2">
                                {selectedPictureId === 4 ? (
                                    <p className='nauda ena2'>Izmanto</p>
                                ) : (
                                    <p className='nauda ena2'>{getPriceDisplay(4)}</p>
                                )}
                                </div>
                            </div>
                            </div>
                        </div>


                        <div className="flex flex-row justify-center items-center flex-wrap w-full h-full">
                            <div className={`value ${selectedPictureId === 5 ? 'selected' : ''}`} onClick={() => handlePictureClick(5)}>
                            <div className="flex flex-wrap justify-center items-center w-full">
                                <div className="horse"></div>
                                <div className="flex flex-wrap justify-center items-center w-full h-full mt-2">
                                {selectedPictureId === 5 ? (
                                    <p className='nauda ena2'>Izmanto</p>
                                ) : (
                                    <p className='nauda ena2'>{getPriceDisplay(5)}</p>
                                )}
                                </div>
                            </div>
                            </div>
                        </div>

                        
                        <div className="flex flex-row justify-center items-center flex-wrap w-full h-full">
                            <div className={`value ${selectedPictureId === 6 ? 'selected' : ''}`} onClick={() => handlePictureClick(6)}>
                            <div className="flex flex-wrap justify-center items-center w-full">
                                <div className="lion"></div>
                                <div className="flex flex-wrap justify-center items-center w-full h-full mt-2">
                                {selectedPictureId === 6 ? (
                                    <p className='nauda ena2'>Izmanto</p>
                                ) : (
                                    <p className='nauda ena2'>{getPriceDisplay(6)}</p>
                                )}
                                </div>
                            </div>                                  
                            </div>
                        </div>

                        <div className="flex flex-row justify-center items-center flex-wrap w-full h-full">
                            <div className={`value ${selectedPictureId === 8 ? 'selected' : ''}`} onClick={() => handlePictureClick(8)}>
                            <div className="flex flex-wrap justify-center items-center w-full">
                                <div className="snake"></div>
                                <div className="flex flex-wrap justify-center items-center w-full h-full mt-2">
                                {selectedPictureId === 8 ? (
                                    <p className='nauda ena2'>Izmanto</p>
                                ) : (
                                    <p className='nauda ena2'>{getPriceDisplay(8)}</p>
                                )}
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="flex flex-row justify-center items-center flex-wrap w-full h-full">
                            <div className={`value ${selectedPictureId === 7 ? 'selected' : ''}`} onClick={() => handlePictureClick(7)}>
                            <div className="flex flex-wrap justify-center items-center w-full">
                                <div className="tiger"></div>
                                <div className="flex flex-wrap justify-center items-center w-full h-full mt-2">
                                {selectedPictureId === 7 ? (
                                    <p className='nauda ena2'>Izmanto</p>
                                ) : (
                                    <p className='nauda ena2'>{getPriceDisplay(7)}</p>
                                )}
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="flex flex-row justify-center items-center flex-wrap w-full h-full">
                            <div className={`value ${selectedPictureId === 9 ? 'selected' : ''}`} onClick={() => handlePictureClick(9)}>
                            <div className="flex flex-wrap justify-center items-center w-full">
                                <div className="deer"></div>
                                <div className="flex flex-wrap justify-center items-center w-full h-full mt-2">
                                {selectedPictureId === 9 ? (
                                    <p className='nauda ena2'>Izmanto</p>
                                ) : (
                                    <p className='nauda ena2'>{getPriceDisplay(9)}</p>
                                )}
                                </div>
                            </div>     
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                    {/* picture shop ends */}
                    <div className="col-span-1 w-full h-full flex flex-col rounded-md p-4">
                        <div className="grid grid-cols-3 gap-2 justify-items-center">
                            <div className="flex flex-col justify-center items-center">
                                <Leaderboard />
                                <p className="hana ena2 text-white  mt-2">
                                    Līderi
                                </p>
                            </div>

                            <div className="flex flex-col justify-center items-center">
                                <div 
                                    className="profile-pic w-24 h-24 bg-cover bg-center" 
                                    style={{ backgroundImage: `url(${profilePicUrl})` }}
                                ></div>
                                <p className="hana ena2 text-white text-3xl mt-2">
                                    {user.name}
                                </p>
                            </div>

                            <div className="flex flex-col justify-center items-center">
                                <History />
                                <p className="hana ena2 text-white mt-2">
                                    Vēsture
                                </p>
                            </div>
                        </div>

                        <div className="relative h-full bg-[#FFF5EA] rounded-lg p-2 mt-4">
                            <Missions 
                                missionProgress={missionProgress}
                                setMissionProgress={setMissionProgress}
                                containerHeight="20rem" 
                                setCoins={setCoins} 
                                coins={coins}
                            />
                            </div>

                 <div className="flex-grow flex items-center mt-3 justify-center">
                    <Link href={route('lobby')} 
                         className="relative inline-flex items-center justify-center ena2 px-10 py-2 bg-gradient-to-r from-[#00A3FF] to-[#0066FF] text-white font-bold text-2xl
                                rounded-xl shadow-lg cursor-pointer overflow-hidden group
                                hover:shadow-xl hover:bg-gradient-to-r hover:from-[#0085cc] hover:to-[#0044cc]
                                transition-all duration-300 transform hover:-translate-y-1 min-w-[120px]">

                        <span className="absolute inset-0 bg-gradient-to-r from-[#00C6FF] to-[#0072FF] opacity-0 
                                group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></span>
                        
                        <span className="absolute top-0 left-0 w-1/3 h-full bg-white opacity-10 -skew-x-12
                                transform -translate-x-full group-hover:translate-x-[400%] transition-all duration-700"></span>
                        
                        <span className="relative z-10 flex items-center justify-center w-full">
                        <span className="relative flex items-center">
                            <span className="transition-all duration-300 group-hover:mr-4">
                                Spēlēt
                            </span>
                            <svg className="absolute left-full w-6 h-6  opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                                fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </span>
                        </span>
                    </Link>
                    </div>
                </div>

                    <div className="col-span-1 w-full h-full flex flex-col rounded-md">
                        <div className="flex flex-row justify-center items-center flex-wrap w-full">
                            <div className="bg-[#FF5309] rounded-[7px] px-4">
                                <div className="flex flex-wrap justify-center items-center ">
                                    <div className="shop-title2">
                                        Privilēģijas
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow w-full bg-[#FFF5EA] rounded-lg shadow-lg shadow-black/30 flex justify-center items-center p-4 mb-4">
                            <div className="grid grid-cols-3 gap-2 w-full justify-items-center h-full">
                                
                                <div className="flex flex-col justify-center gap-10  items-center w-full h-full">
                                    <div className="hint h-1/2"></div>
                                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 cursor-pointer px-4 py-2 rounded-md flex justify-center items-center 
                                                hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105 ">
                                        <div className="nauda ena2 mt-1" onClick={() => handlePurchasePrivilege('flag', 100)}>
                                            100
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col justify-center gap-10  items-center w-full h-full">
                                    <div className="clock h-1/2"></div>
                                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 cursor-pointer px-4 py-2 rounded-md flex justify-center items-center 
                                                hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                        <div className="nauda ena2 mt-1" onClick={() => handlePurchasePrivilege('skip', 150)}>
                                            150
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center gap-10  items-center w-full h-full">
                                    <div className="freeze h-1/2"></div>
                                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 cursor-pointer px-4 py-2 rounded-md flex justify-center items-center 
                                                hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                        <div className="nauda ena2 mt-1" onClick={() => handlePurchasePrivilege('hint', 200)}>
                                            200
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* b */}
                        <div className="flex-grow w-full bg-[#FFF5EA] rounded-[7px] shadow-[0_10px_20px_rgba(0,_0,_0,_0.3)] p-4">
                            <div className="grid grid-cols-3 gap-2 w-full justify-items-center h-full">

                                <div className="flex flex-col justify-center gap-10 items-center w-full h-full">
                                    <div className="hint h-1/2"></div>
                                        <div className="py-2 px-5 bg-gradient-to-r from-[#615858] to-[#8a7e7e] rounded-full flex justify-center">
                                            <div className="nauda ena2 mt-1"> {privileges ? privileges.flag_quantity : 0}</div>
                                        </div>
                                    </div>
                            
                                <div className="flex flex-col justify-center gap-10 items-center w-full h-full">
                                    <div className="clock h-1/2"></div>
                                      <div className="py-2 px-5 bg-gradient-to-r from-[#615858] to-[#8a7e7e] rounded-full flex justify-center">
                                        <div className="nauda ena2 mt-1"> {privileges ? privileges.skip_quantity : 0}</div>
                                    </div>
                                </div>
                            
                                <div className="flex flex-col justify-center gap-10 items-center w-full h-full">
                                    <div className="freeze h-1/2"></div>
                                        <div className="py-2 px-5 bg-gradient-to-r from-[#615858] to-[#8a7e7e] rounded-full flex justify-center">
                                            <div className="nauda ena2 mt-1"> {privileges ? privileges.hint_quantity : 0}</div>
                                        </div>
                                 </div>
                            </div>
                        </div>
                    </div>


                </div>


            </div>
        </HomeLayout>
    );
};

export default Home;
