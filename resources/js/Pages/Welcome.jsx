import '../../css/css.css';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Cau" />
            <div className="background-container">
                <div className="flex-center">
                    <div className="content-wrapper content-wrapper-lg">
                        <header className="header header-lg">
                            <div className="logo-container">
                                <svg
                                    className="logo logo-lg"
                                    viewBox="0 0 62 65"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* SVG paths */}
                                </svg>
                            </div>
                            <nav className="nav">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="nav-link dark">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="nav-link dark">
                                            Log in
                                        </Link>
                                        <Link href={route('register')} className="nav-link dark">
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        {/* Footer */}
                        <footer className="footer dark">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
