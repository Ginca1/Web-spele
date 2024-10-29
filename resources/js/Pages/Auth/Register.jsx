
import GuestLayout from '@/Layouts/GuestLayout';
import '../../../css/css.css';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
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
            <Head title="Register" />

           
            <form className="signup-form" onSubmit={submit}>
            <h1 className="signIn">Reģistrēties</h1>

                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Ievadi vārdu"
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
                 
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Ievadi paroli"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
            
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        placeholder="Apstiprini paroli"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                  
                                
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

                  <div className="action-container">
                    <Link
                        href={route('login')}
                        className="link"
                    >
                       Vai tev jau ir profils?
                    </Link>
                    <button className="button" disabled={processing}>
                        Sūtīt
                    </button>
                </div>

            </form>
        </GuestLayout>
    );
}
