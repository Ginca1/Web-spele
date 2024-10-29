
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSuccessMessage('Parole atjaunota veiksmīgi.');
                setIsVisible(true); 
            },
            onError: (errors) => {
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
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000); // 3 seconds

            return () => clearTimeout(timer); 
        }
    }, [isVisible]);

    return (
        <section className={className}>
            

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                <div className="rowL">
                        <div className="lable1">
                           Tava parole
                        </div>
                    </div>


                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="inputs"
                        autoComplete="current-password"
                    />

                    
                </div>

                <div>
                <div className="rowL">
                        <div className="lable1">
                            Jaunā parole
                        </div>
                    </div>


                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="inputs"
                        autoComplete="new-password"
                    />

                   
                </div>

                <div>
                <div className="rowL">
                        <div className="lable1">
                            Apstiprini jauno paroli
                        </div>
                    </div>


                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="inputs"
                        autoComplete="new-password"
                    />

                    
                </div>

                <div className="row">
                    <PrimaryButton disabled={processing}>Saglabāt</PrimaryButton>
                    </div>

                   
                    <div className={`success-message ${isVisible ? 'fade-in' : 'fade-out'}`}>
                        {successMessage}
                    </div>

                    {Object.values(errors).length > 0 && (
                    <div className="error-messages">
                        {Object.values(errors)
                            .filter(error => error) 
                            .reverse() 
                            .map((error, index) => (
                                <div key={index} className="error-message">{error}</div>
                            ))}
                    </div>
                )}
               
            </form>
        </section>
    );
}
