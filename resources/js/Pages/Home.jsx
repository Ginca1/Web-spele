import HomeLayout from '@/Layouts/HomeLayout'; 
import { Head, usePage } from '@inertiajs/react'; 
import Dropdown from '@/Components/Dropdown';
import Settings from '../Components/Settings'; // Import Settings component
import { useState } from 'react';


    const Home = () => {
        const user = usePage().props.auth.user; // Get the authenticated user
        const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    
    return (
        <HomeLayout>
            <Head title="Homepage" />
            <div className="main">
                <div className="header">
                    {/* Column 1: Game title */}
                    <div className="rowL-">
                    <div class="game2">
    <span>P</span><span>r</span><span>ā</span><span>t</span><span>a</span>
    <span>&nbsp;</span>
     <span>D</span><span>u</span><span>e</span><span>ļ</span><span>i</span>
</div>

                    </div>
                  
                    


                    {/* Column 3: User Dropdown */}
                    
                    <div className="rowR">
                        <div className="score-box">
                            <div className="row">
                            <p className='score-text'> 0</p>
                            </div>
                        </div>
                    <Settings />
                    </div>
                </div>

                <div className="mid">
                    <div className="shop">
                        <div className="rowW">
                            <div className="shop-title">
                                <div className="row">
                                <div className="shop-text">
                                    Veikals
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className="shop-content">
                        <div className="mid3">
                                <div className="row">
                                    <div className="value">
                                        <div className="rowW">
                                            <div className="dog">

                                            </div>
                                            <div className="rowH-M">
                                                <p className='nauda'>Brīvs</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className="value">
                                        <div className="rowW">
                                            <div className="cat">
                                                
                                            </div>

                                            <div className="rowH-M">
                                                <p className='nauda'>Brīvs</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className="value">
                                        <div className="rowW">
                                            <div className="frog">
                                                
                                            </div>
                                            <div className="rowH-M">
                                                <p className='nauda'>Brīvs</p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    </div>
                                
                        </div>
                        <div className="mid3">
                                <div className="row">
                                    <div className="value">
                                        <div className="rowW">
                                            <div className="antilope">

                                            </div>
                                            <div className="rowH-M">
                                                <p className='nauda'>50</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className="value">
                                        <div className="rowW">
                                            <div className="horse">
                                                
                                            </div>

                                            <div className="rowH-M">
                                                <p className='nauda'>75</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className="value">
                                        <div className="rowW">
                                            <div className="lion">
                                                
                                            </div>
                                            <div className="rowH-M">
                                                <p className='nauda'>100</p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    </div>
                                
                        </div>
                        <div className="mid3">
                                <div className="row">
                                    <div className="value">
                                        <div className="rowW">
                                            <div className="snake">

                                            </div>
                                            <div className="rowH-M">
                                                <p className='nauda'>125</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className="value">
                                        <div className="rowW">
                                            <div className="tiger">
                                                
                                            </div>

                                            <div className="rowH-M">
                                                <p className='nauda'>150</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className="value">
                                        <div className="rowW">
                                            <div className="deer">
                                                
                                            </div>
                                            <div className="rowH-M">
                                                <p className='nauda'>200</p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    </div>
                                
                        </div>
                        </div>
                    </div>
                    <div className="type">
                        <div className="mid">
                            <div className="row">
                            <div className="leaderboard"> </div>
                            <div className="row">
                                <div className="small-T">
                                    Līderi
                                </div>
                            </div>
                            </div>
                            
                            <div className="row">
                                <div className="profile-pic"></div>
                                <div className="row">
                                    <div className="name-T">
                                    {user.name}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="history">

                                </div>
                                <div className="row">
                                <div className="small-T">
                                    Vēsture
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="mid2">
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
                                            Valsts
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="rowW-M">
                            <button className='vs'>1 pret 1</button>
                        </div>
                    </div>
                    <div className="priv">
                    <div className="rowW">
                        <div className="priv-title">
                            <div className="row">
                            <div className="shop-text">
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
                                    <div className="nauda">
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
                                    <div className="nauda">
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
                                    <div className="nauda">
                                        200
                                    </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="priv-content2">
                        <div className="mid">
                        <div className="row">
                                <div className="hint"></div>
                                <div className="row">
                                <div className="priv-value">
                                <div className="rowH-M">
                                    <div className="nauda">
                                        1
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
                                        4
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
                                        3
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
