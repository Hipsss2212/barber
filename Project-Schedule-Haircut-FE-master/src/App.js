import React from "react";
import { RouterProvider } from 'react-router-dom';
import router from "./routers/routes";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './stores/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
    return (
        <GoogleOAuthProvider clientId="528064981157-fu7mkbnv65snsdenm00ecche49rf2tsh.apps.googleusercontent.com">
            <div className="App">
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
                <ToastContainer position="bottom-right" autoClose={3000} pauseOnHover={false} />
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
