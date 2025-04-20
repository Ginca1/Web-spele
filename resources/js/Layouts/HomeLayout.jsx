
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import '../../css/css.css';

export default function Authenticated({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen relative">
            {/* Fixed background that covers entire screen */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-black bg-[url('../../public/images/back.jpg')] bg-cover bg-center bg-no-repeat" />
            </div>

            {/* Scrollable content container */}
            <div className="relative z-10">
                {/* Navigation dropdown (existing code) */}
                <div className={showingNavigationDropdown ? 'block' : 'hidden' + ' sm:hidden'}>
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>

                {/* Header and main content */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="min-h-[calc(100vh-200px)]">{children}</main>
            </div>
        </div>
    );
}