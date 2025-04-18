import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const PrimaryButton = ({ className, children, ...props }) => {
        return (
            <button className={`primary-button ${className}`} {...props}>
                {children}
            </button>
        );
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

          

            <form  className="login-form"onSubmit={submit}>
            <h1 className="signIn">Pieslēgties</h1>

                <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Ievadi epastu"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Ievadi paroli"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                        <div className="remember-container">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="checkbox" 
                            />
                            <span className="remember">
                                Remember me
                            </span>
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


                    <div className="remember-container">
                    <Link
                        href={route('register')}
                        className="link"
                    >
                       Izveidot profilu šeit!
                    </Link>
                    </div>

                <div className="action-container2">
                
                    {/* {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="link"
                        >
                           Aizmirsi paroli?
                        </Link>
                    )} */}




                    <button className="button" disabled={processing}>
                       Ienākt
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
