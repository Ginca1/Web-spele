import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Valstis = () => {
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
                    <div className="bg-[#fdfdfb] w-[90vw] max-w-[1250px] h-auto p-5 rounded-lg min-h-[75vh] shadow-md 
                         relative text-center overflow-hidden flex flex-col z-[2001]">
                        <Head title={`Valstis`} />
                        <div className="flex items-center justify-center relative border-b-2 border-gray-300">
                            <Link href={route('lobby')} className="absolute left-[10px] top-[45%] text-[56px] text-[#084fd3] transform -translate-y-1/2">
                                <IoArrowBackCircleSharp /> 
                            </Link>
                            <h1 className="room-title1">Izvēlies Kontinentu</h1>
                        </div>
                      
                        <div className="flex flex-row items-center justify-center w-full flex-wrap pt-[2.5rem] gap-2 max-h-[394px] overflow-y-auto pr-4">
                            {/* Europe */}
                            <Link 
                                href={route('continent.europe')} // Navgte 
                                className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
                            >
                                <img
                                    src="/images/Continent/europe.jpg"
                                    alt="Europe"
                                    className="w-[17rem] h-[22rem] object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
                                <div className="absolute top-3 right-3">
                                    <div className=" bg-[#aaa9ab] flex items-center bg-opacity-70 px-2 py-1 justify-center diff text-md text-[#5de400] font-semibold rounded">
                                        Viegls
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="font-nunito continent text-3xl font-bold">Eiropa</p>
                                </div>
                            </Link>

                            {/* Americas */}
                            <Link 
                                href={route('continent.americas')} // Navigate
                                className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
                            >
                                <img
                                    src="/images/Continent/americas.jpg"
                                    alt="Americas"
                                    className="w-[17rem] h-[22rem] object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
                                <div className="absolute top-3 right-3">
                                    <div className=" bg-[#aaa9ab] flex items-center bg-opacity-70 px-2 py-1 justify-center diff text-md text-[#ffbd00] font-semibold rounded">
                                        Vidējs
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="font-nunito continent text-3xl font-bold">Amerika</p>
                                </div>
                            </Link>

                            {/* Asia */}
                            <Link 
                                href={route('continent.asia')} // Navigato thee Asia page
                                className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
                            >
                                <img
                                    src="/images/Continent/asia.jpg"
                                    alt="Asia"
                                    className="w-[17rem] h-[22rem] object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
                                <div className="absolute top-3 right-3">
                                    <div className=" bg-[#aaa9ab] flex items-center bg-opacity-70 px-2 py-1 justify-center diff text-md text-[#ff0000] font-semibold rounded">
                                        Grūts
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="font-nunito continent text-3xl font-bold">Āzija</p>
                                </div>
                            </Link>

                            {/* Africa */}
                            <Link 
                                href={route('continent.africa')} // Navigate to the Africa page
                                className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
                            >
                                <img
                                    src="/images/Continent/africa.jpg"
                                    alt="Africa"
                                    className="w-[17rem] h-[22rem] object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
                                <div className="absolute top-3 right-3">
                                    <div className=" bg-[#aaa9ab] flex items-center bg-opacity-70 px-2 py-1 justify-center diff text-md text-[#bd00ff] font-semibold rounded">
                                        Ļoti grūts
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="font-nunito continent text-3xl font-bold">Āfrika</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Valstis;