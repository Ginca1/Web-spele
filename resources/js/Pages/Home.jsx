import HomeLayout from '@/Layouts/HomeLayout'; 
import { Head, usePage, Link } from '@inertiajs/react'; 
import Settings from '../Components/Settings'; 
import Leaderboard from '../Components/Leaderboard';
import History from '../Components/History';
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

const Home = () => {
    const user = usePage().props.auth.user; 
    const [privileges, setPrivileges] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(pictureMap[user.picture_id] || '/images/dog.png'); 
    const [selectedPictureId, setSelectedPictureId] = useState(null); 
    const [coins, setCoins] = useState(user.coins);
    const [purchasedPictures, setPurchasedPictures] = useState([]);

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
                    <div className="rowR">
                        <div className="score-box">
                           <div className="rowL">
                                <div className="fire"></div>
                                <p className='score-text'>{coins}</p>
                            </div>
                        </div>
                    <Settings />
                    </div>
                </div>
            <div className="kop">
                <div className="mid">
                    {/* picture shop starts */}
                    <div className="shop">
                        <div className="rowW">
                            <div className="shop-title">
                                <div className="row">
                               
                                <div className="shop-title2">
                                    Veikals
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="shop-content">
                        <div className="mid3">
                                <div className="row">
                                <div className={`value ${selectedPictureId === 1 ? 'selected' : ''}`} onClick={() => handlePictureClick(1)}>
                                        <div className="rowW">
                                            <div className="dog"></div>
                                            <div className="rowH-M6">
                                            {selectedPictureId === 1 ? (
                                                    <p className='nauda'>Izmanto</p>
                                                ) : (
                                                    <p className='nauda'>{getPriceDisplay(1)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className={`value ${selectedPictureId === 2 ? 'selected' : ''}`} onClick={() => handlePictureClick(2)}>
                                        <div className="rowW">
                                            <div className="cat">
                                                
                                            </div>

                                            <div className="rowH-M6">
                                            {selectedPictureId === 2 ? (
                                                    <p className='nauda'>Izmanto</p>
                                                ) : (
                                                    <p className='nauda'>{getPriceDisplay(2)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className={`value ${selectedPictureId === 3 ? 'selected' : ''}`} onClick={() => handlePictureClick(3)}>
                                        <div className="rowW">
                                            <div className="frog">                                               
                                            </div>
                                            <div className="rowH-M6">
                                            {selectedPictureId === 3 ? (
                                                    <p className='nauda'>Izmanto</p>
                                                ) : (
                                                    <p className='nauda'>{getPriceDisplay(3)}</p>
                                                )}
                                            </div>
                                        </div>                                      
                                    </div>
                                    </div>
                        </div>
                        <div className="mid3">
                                <div className="row">
                                     <div className={`value ${selectedPictureId === 4 ? 'selected' : ''}`} onClick={() => handlePictureClick(4)}>
                                        <div className="rowW">
                                            <div className="antilope">
                                            </div>
                                            <div className="rowH-M6">
                                            {selectedPictureId === 4 ? (
                                                    <p className='nauda'>Izmanto</p>
                                                ) : (
                                                    <p className='nauda'>{getPriceDisplay(4)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className={`value ${selectedPictureId === 5 ? 'selected' : ''}`} onClick={() => handlePictureClick(5)}>
                                        <div className="rowW">
                                            <div className="horse">                                               
                                            </div>
                                            <div className="rowH-M6">
                                            {selectedPictureId ===5 ? (
                                                    <p className='nauda'>Izmanto</p>
                                                ) : (
                                                    <p className='nauda'>{getPriceDisplay(5)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className={`value ${selectedPictureId === 6 ? 'selected' : ''}`} onClick={() => handlePictureClick(6)}>
                                        <div className="rowW">
                                            <div className="lion">
                                                
                                            </div>
                                            <div className="rowH-M6">
                                            {selectedPictureId === 6 ? (
                                                    <p className='nauda'>Izmanto</p>
                                                ) : (
                                                    <p className='nauda'>{getPriceDisplay(6)}</p>
                                                )}
                                            </div>
                                        </div>                                      
                                    </div>
                                    </div>                     
                        </div>
                        <div className="mid3">
                                <div className="row">
                                <div className={`value ${selectedPictureId === 8 ? 'selected' : ''}`} onClick={() => handlePictureClick(8)}>
                                        <div className="rowW">
                                            <div className="snake">

                                            </div>
                                            <div className="rowH-M6">
                                            {selectedPictureId === 8 ? (
                                                    <p className='nauda'>Izmanto</p>
                                                ) : (
                                                    <p className='nauda'>{getPriceDisplay(8)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className={`value ${selectedPictureId === 7 ? 'selected' : ''}`} onClick={() => handlePictureClick(7)}>
                                        <div className="rowW">
                                            <div className="tiger">                                              
                                            </div>
                                            <div className="rowH-M6">
                                            {selectedPictureId === 7 ? (
                                                    <p className='nauda'>Izmanto</p>
                                                ) : (
                                                    <p className='nauda'>{getPriceDisplay(7)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className={`value ${selectedPictureId === 9 ? 'selected' : ''}`} onClick={() => handlePictureClick(9)}>
                                        <div className="rowW">
                                            <div className="deer">                                               
                                            </div>
                                            <div className="rowH-M6">
                                            {selectedPictureId === 9 ? (
                                                    <p className='nauda'>Izmanto</p>
                                                ) : (
                                                    <p className='nauda'>{getPriceDisplay(9)}</p>
                                                )}
                                            </div>
                                        </div>     
                                    </div>
                                    </div>
                        </div>
                        </div>
                    </div>
                    {/* picture shop ends */}
                    <div className="type">
                        <div className="mid">
                            <div className="row">           
                            <Leaderboard />
                            <div className="row">
                                <div className="small-T">
                                    Līderi
                                </div>
                            </div>
                            </div>
                            
                            <div className="row">                               
                            <div 
                        className="profile-pic"
                        style={{ backgroundImage: `url(${profilePicUrl})` }}  
                    ></div>
                                <div className="row">
                                    <div className="name-T">
                                    {user.name}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <History/>
                                <div className="row">
                                <div className="small-T">
                                    Vēsture
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="mid2T">
                            <div className="row">
                                <div className="math">
                                    <div className="rowH">
                                        <div className="small-T">
                                            Matemātika
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="sport">
                                <div className="rowH">
                                        <div className="small-T">
                                           Sports
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="country">
                                <div className="rowH">
                                        <div className="small-T">
                                            Valstis
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link href={route('lobby')} className="vs">Spēlēt</Link>      
                    </div>
                    <div className="priv">
                    <div className="rowW">
                        <div className="priv-title">
                            <div className="row">
                            <div className="shop-title2">
                                   Privilēģijas
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="priv-content">
                        <div className="mid">
                            <div className="row">
                                <div className="hint"></div>
                                <div className="row">
                                <div className="priv-price">
                                <div className="rowH-M">
                                    <div className="nauda"  onClick={() => handlePurchasePrivilege('hint', 100)}>
                                        100
                                    </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            
                            <div className="row">
                                <div className="clock"></div>
                                <div className="row">
                                <div className="priv-price">
                                    <div className="rowH-M">
                                    <div className="nauda"  onClick={() => handlePurchasePrivilege('skip', 150)}>
                                        150
                                    </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="row">
                                <div className="freeze"></div>
                                <div className="row">
                                <div className="priv-price">
                                <div className="rowH-M">
                                    <div className="nauda"  onClick={() => handlePurchasePrivilege('flag', 200)}>
                                        200
                                    </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    {/* buy box ends */}
                    <div className="priv-content2">
                        <div className="mid">
                            <div className="row">
                                <div className="hint"></div>
                                <div className="row">
                                    <div className="priv-value">
                                        <div className="rowH-M">
                                            <div className="nauda">
                                            {privileges ? privileges.hint_quantity : 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="clock"></div>
                                <div className="row">
                                    <div className="priv-value">
                                        <div className="rowH-M">
                                            <div className="nauda">
                                            {privileges ? privileges.skip_quantity : 0} 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="freeze"></div>
                                <div className="row">
                                    <div className="priv-value">
                                        <div className="rowH-M">
                                            <div className="nauda">
                                            {privileges ? privileges.flag_quantity : 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
