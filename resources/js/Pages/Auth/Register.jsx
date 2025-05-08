import GuestLayout from '@/Layouts/GuestLayout';
import '../../../css/css.css';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [inputErrors, setInputErrors] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [hasErrors, setHasErrors] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const validateField = (name, value) => {
        let error = '';
    
        if (name === 'name') {
            if (!value.trim()) {
                error = 'Lietotājvārds ir obligāts';
            } else if (!/^[a-zA-ZāčēģīķļņōŗšūžĀČĒĢĪĶĻŅŌŖŠŪŽ]+$/.test(value)) {
                error = 'Lietotājvārdam jāsatur burti bez atstarpēm un simboliem';
            } else if (value.length < 3 || value.length > 8) {
                error = 'Lietotājvārdam jābūt no 3 līdz 8 rakstzīmēm';
            }
        } else if (name === 'email') {
            if (!value.trim()) {
                error = 'E-pasts ir obligāts';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = 'Lūdzu ievadiet derīgu e-pasta adresi';
            }
        } else if (name === 'password') {
            if (!value.trim()) {
                error = 'Parole ir obligāta';
            } else if (value.length < 8) {
                error = 'Parolei jābūt vismaz 8 rakstzīmes garai';
            } else if (!/[A-ZĀČĒĢĪĶĻŅŠŪŽ]/.test(value)) {
                error = 'Parolei jāsatur vismaz viens lielais burts';
            } else if (!/[0-9]/.test(value)) {
                error = 'Parolei jāsatur vismaz viens cipars';
            }
        } else if (name === 'password_confirmation') {
            if (!value.trim()) {
                error = 'Lūdzu apstiprini paroli';
            } else if (value !== data.password) {
                error = 'Paroles nesakrīt';
            }
        }
    
        setInputErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        
        // Clear error when user starts typing
        if (inputErrors[name]) {
            setInputErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Validate all fields before submission
        const isNameValid = validateField('name', data.name);
        const isEmailValid = validateField('email', data.email);
        const isPasswordValid = validateField('password', data.password);
        const isConfirmValid = validateField('password_confirmation', data.password_confirmation);

        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
            setHasErrors(true);
            return;
        }

        setHasErrors(false);
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (errors) => {
                setHasErrors(true);
                setInputErrors({
                    name: errors.name || '',
                    email: errors.email || '',
                    password: errors.password || '',
                    password_confirmation: errors.password_confirmation || ''
                });
            }
        });
    };
    return (
        <GuestLayout>
            <Head title="Register" />

           
            <form className="signup-form  relative bg-cover bg-center bg-no-repeat p-[30px] rounded-[12px] w-full max-w-[450px] min-w-[320px] 
            box-border overflow-hidden transition-all duration-300 ease-in-out min-h-[50vh] max-h-[80vh] flex flex-col items-center 
            justify-center shadow-[0_0_15px_10px_rgba(0,0,0,0.5)] " style={{ backgroundImage: "url('/images/back2.jpg')" }} onSubmit={submit}>
            <h1 className="finish text-[3rem] text-white text-center ">Reģistrēties</h1>

                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Ievadi lietotājvārdu"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                  
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Ievadi e-Pastu"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                 
                 
                 <div className="relative w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Ievadi paroli"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full p-3 ml-[2.15rem] rounded-[8px] border border-gray-300 focus:outline-none"
                    />
                    <span className="absolute right-[4rem] top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600">
                        {showPassword ? (
                            <FaEye className='w-5 h-5' onClick={() => setShowPassword(false)} />
                        ) : (
                            <FaEyeSlash className='w-5 h-5' onClick={() => setShowPassword(true)} />
                        )}
                    </span>
                </div>

                {/*Confirm Password Input with Icon*/}
                <div className="relative w-full ">
                    <input
                        type={showPasswordConfirm ? "text" : "password"}
                        id="password_confirmation"
                        name="password_confirmation"
                        placeholder="Apstiprini paroli"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full p-3 pr-10 ml-[2.15rem] rounded-[8px] border border-gray-300 focus:outline-none"
                    />
                    <span className="absolute right-[4rem] top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600">
                        {showPasswordConfirm ? (
                            <FaEye className='w-5 h-5' onClick={() => setShowPasswordConfirm(false)} />
                        ) : (
                            <FaEyeSlash className='w-5 h-5' onClick={() => setShowPasswordConfirm(true)} />
                        )}
                    </span>
                </div>
                    
                  
                                
                  {hasErrors && (
                    <div className="error-messages">
                        {Object.entries(inputErrors)
                            .filter(([_, error]) => error) 
                            .map(([field, error], index) => (
                                <div key={`frontend-${field}-${index}`} className="error-message">
                                    {error}
                                </div>
                            ))}
                    </div>
                )}
                  <div className="action-container">
                    <Link
                        href={route('login')}
                        className="link"
                    >
                       Vai tev jau ir profils?
                    </Link>
                    <button className="button" disabled={processing}>
                        Saglabāt
                    </button>
                </div>

            </form>
        </GuestLayout>
    );
}
