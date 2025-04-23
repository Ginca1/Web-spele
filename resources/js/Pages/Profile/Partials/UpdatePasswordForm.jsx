import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [showMessage, setShowMessage] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    const [hasErrors, setHasErrors] = useState(false);

    const checkCurrentPassword = async (currentPassword) => {
        try {
            const response = await fetch('/validate-current-password', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ current_password: currentPassword })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            return result.isValid;
        } catch (error) {
            console.error("Error validating current password", error);
            return false;
        }
    };

    // Validation rules
    const validateField = async (name, value) => {
        let error = '';
    
        if (name === 'current_password') {
            if (!value.trim()) {
                error = 'Pašreizējā parole ir obligāta';
            } else {
                const isValidCurrentPassword = await checkCurrentPassword(value);
                if (!isValidCurrentPassword) {
                    error = 'Pašreizējā parole ir nepareiza';
                }
            }
        } else if (name === 'password') {
            if (!value.trim()) {
                error = 'Jaunā parole ir obligāta';
            } else if (value.length < 8) {
                error = 'Parolei jābūt vismaz 8 rakstzīmes garai';
            } else if (!/[A-ZĀČĒĢĪĶĻŅŠŪŽ]/.test(value)) {
                error = 'Parolei jāsatur vismaz viens lielais burts';
            } else if (!/[0-9]/.test(value)) {
                error = 'Parolei jāsatur vismaz viens cipars';
            } else if (value === data.current_password) {
                error = 'Jaunā parole nedrīkst būt tāda pati kā pašreizējā';
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
        
        if (inputErrors[name]) {
            setInputErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();

        const isCurrentValid = await validateField('current_password', data.current_password);
        const isPasswordValid = validateField('password', data.password);
        const isConfirmValid = validateField('password_confirmation', data.password_confirmation);

        if (!isCurrentValid || !isPasswordValid || !isConfirmValid) {
            setHasErrors(true);
            return;
        }

        setHasErrors(false);
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSuccessMessage('Parole atjaunota veiksmīgi!');
                setIsVisible(true);
                setInputErrors({
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                });
            },
            onError: (errors) => {
                setHasErrors(true);
                setInputErrors({
                    current_password: errors.current_password || '',
                    password: errors.password || '',
                    password_confirmation: errors.password_confirmation || ''
                });

                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    useEffect(() => {
        if (isVisible) {
            const fadeOutTimer = setTimeout(() => {
                setShowMessage(false);  
            }, 2000);  
    
            const hideTimer = setTimeout(() => {
                setIsVisible(false);  
                setShowMessage(true);
            }, 3000);  
    
            return () => {
                clearTimeout(fadeOutTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [isVisible]);

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                {/* Current Password */}
                <div className="relative mt-6">
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        name="current_password"
                        value={data.current_password}
                        onChange={handleChange}
                        onBlur={() => validateField('current_password', data.current_password)}
                        type="password"
                        className={`floating-input block px-1 w-full border-0 border-b-2 ${inputErrors.current_password ? 'border-red-500 error' : 'border-gray-800'} bg-transparent focus:border-green-500 p-0 focus:ring-0 focus:outline-none placeholder-transparent`}
                        autoComplete="current-password"
                        placeholder=" "
                    />
                    <label htmlFor="current_password" className="floating-label font-semibold absolute text-gray-400 transition-all duration-200 ease-in-out top-2 left-0 pointer-events-none">
                        Tava parole
                    </label>
                </div>

                {/* New Password */}
                <div className="relative mt-6">
                    <input
                        id="password"
                        ref={passwordInput}
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        onBlur={() => validateField('password', data.password)}
                        type="password"
                        className={`floating-input block px-1 w-full border-0 border-b-2 ${inputErrors.password ? 'border-red-500 error' : 'border-gray-800'} bg-transparent focus:border-green-500 p-0 focus:ring-0 focus:outline-none placeholder-transparent`}
                        autoComplete="new-password"
                        placeholder=" "
                    />
                    <label htmlFor="password" className="floating-label font-semibold absolute text-gray-400 transition-all duration-200 ease-in-out top-2 left-0 pointer-events-none">
                        Jaunā parole
                    </label>
                </div>

                {/* Confirm Password */}
                <div className="relative mt-6">
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={handleChange}
                        onBlur={() => validateField('password_confirmation', data.password_confirmation)}
                        type="password"
                        className={`floating-input block px-1 w-full border-0 border-b-2 ${inputErrors.password_confirmation ? 'border-red-500 error' : 'border-gray-800'} bg-transparent focus:border-green-500 p-0 focus:ring-0 focus:outline-none placeholder-transparent`}
                        autoComplete="new-password"
                        placeholder=" "
                    />
                    <label htmlFor="password_confirmation" className="floating-label font-semibold absolute text-gray-400 transition-all duration-200 ease-in-out top-2 left-0 pointer-events-none">
                        Apstiprini jauno paroli
                    </label>
                </div>

                <div className="row">
                    <PrimaryButton disabled={processing}>Saglabāt</PrimaryButton>
                </div>

                {/* Message container */}
                <div className="message-container space-y-2">
                    {isVisible && (
                        <div className={`text-green-700 bg-green-100 text-sm p-2.5 text-left rounded-md mb-5 font-semibold shadow-md transition-opacity duration-500 ease-out ${showMessage ? 'opacity-100' : 'opacity-0'}`}>
                            {successMessage}
                        </div>
                    )}

                    {(hasErrors || Object.values(errors).length > 0) && (
                        <div className="fade-in space-y-1 text-left">
                            {Object.values({...inputErrors, ...errors})
                                .filter(error => error)
                                .map((error, index) => (
                                    <div key={index} className="text-red-700 bg-red-100 text-sm p-2.5 text-left rounded-md font-semibold shadow-md transition-opacity duration-500 ease-out">
                                        {error}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
}