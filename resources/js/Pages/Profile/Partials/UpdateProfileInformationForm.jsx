import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing } = useForm({
        name: user.name,
        email: user.email,
    });

    const [showMessage, setShowMessage] = useState(true);

    const [successMessage, setSuccessMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({
        name: '',
        email: ''
    });
    const [hasErrors, setHasErrors] = useState(false);

    const checkNameExists = async (name) => {
        try {
            const response = await fetch('/check-name-exists', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ name })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error checking name:', error);
            return { exists: false }; // Default to false if there's an error
        }
    };
    
    const checkEmailExists = async (email) => {
        try {
            const response = await fetch('/check-email-exists', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ email })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error checking email:', error);
            return { exists: false }; // Default to false if there's an error
        }
    };

    // Validation rules
    const validateField = async (name, value) => {
        let error = '';
    
        if (name === 'name') {
            if (!value.trim()) {
                error = 'Lietotājvārds ir obligāts';
            } else if (!/^[a-zA-ZāčēģīķļņōŗšūžĀČĒĢĪĶĻŅŌŖŠŪŽ]+$/.test(value)) {
                error = 'Lietotājvārdam jāsatur burti bez atstarpēm un simboliem';
            } else if (value.length < 3 || value.length > 8) {
                error = 'Lietotājvārdam jābūt no 3 līdz 8 rakstzīmēm';
            } else if (value !== user.name) {
                const { exists } = await checkNameExists(value);
                if (exists) {
                    error = 'Šāds lietotājvārds jau eksistē';
                }
            }
        } else if (name === 'email') {
            if (!value.trim()) {
                error = 'E-pasts ir obligāts';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = 'Lūdzu ievadiet derīgu e-pasta adresi';
            } else if (value !== user.email) {
                const { exists } = await checkEmailExists(value);
                if (exists) {
                    error = 'Šis e-pasts jau ir aizņemts';
                }
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

    const submit = async (e) => {
        e.preventDefault();
    
        // Validate all fields before submission
        const isNameValid = await validateField('name', data.name);
        const isEmailValid = await validateField('email', data.email);
    
        if (!isNameValid || !isEmailValid) {
            setHasErrors(true);
            return;
        }
    
        setHasErrors(false);
        patch(route('profile.update'), {
            onSuccess: (response) => {
                setSuccessMessage(response.props.success || 'Profils atjaunots veiksmīgi.');
                setIsVisible(true);
            },
            onError: (errors) => {
                setHasErrors(true);
                setInputErrors(prev => ({
                    ...prev,
                    name: errors.name || '',
                    email: errors.email || ''
                }));
            }
        });
    };

    useEffect(() => {
        if (isVisible) {
            const fadeOutTimer = setTimeout(() => {
                setShowMessage(false);  
            }, 2000);  
    
            const hideTimer = setTimeout(() => {
                setIsVisible(false);  
            }, 3000);  
    
            return () => {
                clearTimeout(fadeOutTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [isVisible]);

    return (
        <section className={className}>
            

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Name Input */}
                <div className="relative mt-6">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className={`floating-input block font-semibold px-1 w-full border-0 border-b-2 ${inputErrors.name ? 'border-red-500 error' : 'border-gray-800'} bg-transparent focus:border-green-500 p-0 focus:ring-0 focus:outline-none placeholder-transparent`}
                        value={data.name}
                        onChange={handleChange}
                        onBlur={() => validateField('name', data.name)}
                        isFocused
                        autoComplete="name"
                        placeholder=" "
                    />
                    <label htmlFor="name" className="floating-label font-semibold absolute text-gray-400 transition-all duration-200 ease-in-out top-2 left-0 pointer-events-none">
                        Lietotājvārds
                    </label>
                </div>

                {/* Email Input */}
                <div className="relative mt-6">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className={`floating-input block font-semibold px-1 w-full border-0 border-b-2 ${inputErrors.email ? 'border-red-500 error' : 'border-gray-300'} bg-transparent focus:border-green-500 p-0 focus:ring-0 focus:outline-none placeholder-transparent`}
                        value={data.email}
                        onChange={handleChange}
                        onBlur={() => validateField('email', data.email)}
                        autoComplete="username"
                        placeholder=" "
                    />
                    <label htmlFor="email" className="floating-label font-semibold absolute text-gray-400 transition-all duration-200 ease-in-out top-2 left-0 pointer-events-none">
                        e-Pasts
                    </label>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                    </div>
                )}

                <div className="row">
                    <PrimaryButton disabled={processing}>Saglabāt</PrimaryButton>
                </div>

                {/* Message container for both success and error messages */}
                <div className="message-container space-y-2">
                        {/* Success message */}
                        {isVisible && (
                            <div
                                className={`text-green-700 bg-green-100 text-sm p-2.5 text-left rounded-md mb-5 font-semibold shadow-md transition-opacity duration-500 ease-out
                                ${showMessage ? 'opacity-100' : 'opacity-0'}`}
                            >
                                {successMessage}
                            </div>
                        )}

                        {/* Error messages */}
                        {hasErrors && (
                            <div className="fade-in space-y-1 text-left">
                                {Object.values(inputErrors)
                                    .filter(error => error)
                                    .map((error, index) => (
                                        <div key={index} className="text-red-700 bg-red-100 text-sm p-2.5 text-left rounded-md mb-5 font-semibold shadow-md transition-opacity duration-500 ease-out">
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