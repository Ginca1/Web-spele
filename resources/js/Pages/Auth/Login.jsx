import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { initializeUserMissions } from '@/Utilities/missionStorage';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [inputErrors, setInputErrors] = useState({
        email: '',
        password: '',
    });
    const [hasErrors, setHasErrors] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    

    const { auth } = usePage().props;

    useEffect(() => {
        if (auth?.user?.id) {
            initializeUserMissions(auth.user.id);
        }
    }, [auth?.user]);

    const validateField = (name, value) => {
        let error = '';

        if (name === 'email') {
            if (!value.trim()) {
                error = 'E-pasts ir obligāts';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = 'Lūdzu ievadiet derīgu e-pasta adresi';
            }
        } else if (name === 'password') {
            if (!value.trim()) {
                error = 'Parole ir obligāta';
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
        const isEmailValid = validateField('email', data.email);
        const isPasswordValid = validateField('password', data.password);

        if (!isEmailValid || !isPasswordValid) {
            setHasErrors(true);
            return;
        }

        setHasErrors(false);
        post(route('login'), {
            onFinish: () => reset('password'),
            onError: (errors) => {
                setHasErrors(true);
                setInputErrors({
                    email: errors.email || '',
                    password: errors.password || ''
                });
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <form className="login-form" onSubmit={submit}>
                <h1 className="finish text-[3rem] text-white text-center">Pieslēgties</h1>

                <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    placeholder="Ievadi epastu"
                    autoComplete="username"
                    isFocused={true}
                    onChange={handleChange}
                />

                

                <div className="relative w-full">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={data.password}
                        placeholder="Ievadi paroli"
                        autoComplete="current-password"
                        onChange={handleChange}
                        className="w-full p-3 pr-10 ml-[2.15rem] rounded-[8px] border border-gray-300 focus:outline-none"
                    />
                    <span
                        className="absolute right-[4rem]  top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ?  <FaEye className='w-5 h-5' /> : <FaEyeSlash className='w-5 h-5' />}
                    </span>
                </div>

                <div className="remember-container">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="checkbox" 
                    />
                    <span className="remember">
                        Atcerēties mani
                    </span>
                </div>

                {/* Frontend validation errors */}
                {hasErrors && (
                    <div className="error-messages">
                        {['email', 'password']
                            .map(field => ({
                                field,
                                error: inputErrors[field]
                            }))
                            .filter(({ error }) => error)
                            .map(({ field, error }, index) => (
                                <div key={`frontend-${field}-${index}`} className="error-message">
                                    {error}
                                </div>
                            ))}
                    </div>
                )}

                <div className="remember-container">
                    <Link
                        href={route('register')}
                        className="link"
                    >
                        Izveidot profilu šeit!
                    </Link>
                </div>

                <div className="action-container2">
                    <button className="button" disabled={processing}>
                        Ienākt
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}