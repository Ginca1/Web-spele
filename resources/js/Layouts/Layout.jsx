// resources/js/Layouts/Layout.jsx
import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="background-container">
            {children}
        </div>
    );
};

export default Layout;
