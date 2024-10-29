import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
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

    const [successMessage, setSuccessMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false); 

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            onSuccess: (response) => {
                setSuccessMessage(response.props.success || 'Profils atjaunots veiksmīgi.');
                setIsVisible(true); 
            },
            onError: () => {
                
            }
        });
    };

    
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false); 
            }, 3000); 
            return () => clearTimeout(timer); 
        }
    }, [isVisible]);

    return (
        <section className={className}>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <div className="rowL">
                        <div className="lable1">
                            Vārds
                        </div>
                    </div>

                    <TextInput
                        id="name"
                        className="inputs"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        isFocused
                        autoComplete="name"
                    />
                </div>

                <div>
                    <div className="rowL">
                        <div className="lable1">
                            e-Pasts
                        </div>
                    </div>

                    <TextInput
                        id="email"
                        type="email"
                        className="inputs"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                    />
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
