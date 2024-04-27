import React, { useEffect, useRef, useState } from 'react';
import { auth } from '../../../auth/config/firebase-config';
import Navbar from '../../../components/Navbar';
import BillingSection from '../../../widgets/BillingSection';
import Sidebar from '../../../widgets/sidebar';
import UserInfoPopup from '../../../widgets/userInfo';

const PaymentMenu = () => {
    const intervalRef = useRef(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);

    const [user, setUser] = useState({
        isAuthenticated: false,
        name: '',
        email: '',
        photoURL: ''
    });

    // Effect to set navbar height
    useEffect(() => {
        const navbar = document.getElementById("navbar");
        if (navbar) {
            const height = navbar.offsetHeight;
            setNavbarHeight(height);
        }
    }, []);

    // Theme check on mount
    useEffect(() => {
        themeCheck();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Theme check function
    const themeCheck = () => {
        const userTheme = localStorage.getItem("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (localStorage.theme === "dark" || (!userTheme && systemTheme)) {
            document.documentElement.classList.add("dark");
            setIsDarkTheme(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkTheme(false);
        }
    };

    // Theme switch function
    const themeSwitch = () => {
        if (isDarkTheme) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkTheme(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkTheme(true);
        }
    };

    // Function to toggle mobile menu
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Function to toggle profile widget
    const toggleProfileWidget = () => setIsProfileClicked(!isProfileClicked);

    // Effect to handle authentication state changes
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser({
                    isAuthenticated: true,
                    name: user.displayName || 'No Name',
                    email: user.email,
                    photoURL: user.photoURL || 'path/to/default/image.png'
                });
            } else {
                setUser({
                    isAuthenticated: false,
                    name: '',
                    email: '',
                    photoURL: ''
                });
            }
        });
    }, []);
    return (
        <>
            <div className="flex flex-col h-screen">
                {/* Profile Popup */}
                {isProfileClicked && (
                    <UserInfoPopup
                        onClose={() => setIsProfileClicked(false)}
                        userName={user.name}
                        userEmail={user.email}
                        userPhotoURL={user.photoURL}
                    />
                )}

                {/* Navbar */}
                <div className="top-0 w-full z-50">
                    <Navbar
                        isDarkTheme={isDarkTheme}
                        themeSwitch={themeSwitch}
                        toggleMobileMenu={toggleMobileMenu}
                        isMobileMenuOpen={isMobileMenuOpen}
                        onProfileClick={toggleProfileWidget}
                    />
                </div>

                {/* Main Content */}
                <div className="flex flex-grow overflow-hidden">
                    {/* Sidebar, shown only when the user is authenticated */}
                    <div className="sidebar flex-none w-64" style={{ backgroundColor: '#f8f9fa' }}> {/* Adjust width as needed */}
                        <Sidebar user={user} activeScreen="Wallet" />
                    </div>
                    {/* Main Content Area */}
                    <div className="content flex-grow min-w-0 overflow-y-auto bg-white dark:bg-slate-900">
                        <BillingSection />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentMenu