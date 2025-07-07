// components/layouts/MainLayout.js
import React from 'react';
import FloatingWidgets from '../components/FloatingWidgets';

const MainLayout = ({ children }) => {
    return (
        <>
            {/* <Header /> */}
            {children}
            <FloatingWidgets />
        </>
    );
};

export default MainLayout;
