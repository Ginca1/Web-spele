// resources/js/Layouts/Layout.jsx

import LogoutHandler from '@/Components/LogoutHandler';
import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="background-container">
             <LogoutHandler />
            {children}
        </div>
    );
};

export default Layout;
