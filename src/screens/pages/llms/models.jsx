import {
    Button,
    Card,
    CardBody,
    Typography
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { auth } from "../../../auth/config/firebase-config";
import Navbar from "../../../components/Navbar";
import { TransactionsTable } from "../../../widgets/data_table";
import UserInfoPopup from "../../../widgets/userInfo";

const ModelsScreen = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const intervalRef = useRef(null);
    const [isProfileClicked, setIsProfileClicked] = useState(false);

    const toggleProfileWidget = () => setIsProfileClicked(!isProfileClicked);
    const [navbarHeight, setNavbarHeight] = useState(0);

    useEffect(() => {
        const navbar = document.getElementById("navbar");
        if (navbar) {
            const height = navbar.offsetHeight;
            setNavbarHeight(height);
        }
    }, []);


    // Initial Theme Check
    useEffect(() => {
        themeCheck();
        // Cleanup interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

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

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);


    const [user, setUser] = useState({
        isAuthenticated: false,
        name: '',
        email: '',
        photoURL: ''
    });

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser({
                    isAuthenticated: true,
                    name: user.displayName || 'No Name',
                    email: user.email,
                    photoURL: user.photoURL || 'path/to/default/image.png'
                });
            } else {
                // User is signed out
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
                {isProfileClicked && (
                    <UserInfoPopup
                        onClose={() => setIsProfileClicked(false)}
                        userName={user.name}
                        userEmail={user.email}
                        userPhotoURL={user.photoURL}
                    />
                )}

                <div className="fixed top-0 w-full z-50">
                    <Navbar
                        isDarkTheme={isDarkTheme}
                        themeSwitch={themeSwitch}
                        toggleMobileMenu={toggleMobileMenu}
                        isMobileMenuOpen={isMobileMenuOpen}
                        onProfileClick={toggleProfileWidget}
                    />
                </div>

                {/* Main Content Area */}
                <div style={{ paddingTop: navbarHeight }} className="flex-grow flex md:flex-row bg-slate-100 dark:bg-slate-900">

                    {/* Fixed Sidebar */}
                    <div className="md:relative md:flex-none md:w-1/5 h-screen md:h-auto p-4 pl-0 overflow-auto"
                        style={{
                            scrollbarWidth: 'none', /* For Firefox */
                            '-ms-overflow-style': 'none', /* For Internet Explorer and Edge */
                            'scrollbar-color': 'transparent transparent' /* For newer Firefox versions */
                        }}>
                        <div className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg py-6 h-full">
                            {/* User Details Section */}
                            {user.isAuthenticated && (
                                <><Card className="bg-gray-200 pt-2 dark:bg-gray-800 text-gray-800 dark:text-white mt-0 w-full shadow-none border-none rounded-none"> {/* Added utility classes */}
                                    <CardBody>
                                        <div className="py-4 pt-6">
                                            <img src={user.photoURL} alt="User Avatar" className="mx-auto h-28 w-h-28 rounded-full object-cover" />
                                        </div>
                                        <Typography variant="h5" color="blue-gray" className="mb-2">
                                            {user.name}
                                        </Typography>
                                        <Typography color=" blue-gray" className="font-medium mb-2">
                                            {user.email}
                                        </Typography>
                                        <Typography variant="h6" color="blue-gray" className="mb-2 text-left">
                                            <span className="filter-icon">&#128269;</span> Filters
                                        </Typography>
                                        {/* Domain Filter Buttons */}
                                        <div className="mb-5 text-left">
                                            <Button fullWidth disabled className="mb-5">Domain</Button>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <Button variant="text" className="mb-1 px-5 text-gray-800 dark:text-white" style={{ minWidth: '120px', fontWeight: '600' }}>Computer Vision</Button>
                                                <Button variant="text" className="mb-1 px-5 text-gray-800 dark:text-white" style={{ minWidth: '120px', fontWeight: '600' }}>Large Language Model</Button>
                                                <Button variant="text" className="mb-1 px-5 text-gray-800 dark:text-white" style={{ minWidth: '120px', fontWeight: '600' }}>Language Processing</Button>
                                                <Button variant="text" className="mb-1 px-5 text-gray-800 dark:text-white" style={{ minWidth: '120px', fontWeight: '600' }}>Regression Models</Button>
                                            </div>
                                        </div>
                                        {/* Status Filter Buttons */}
                                        <div className="mb-5 text-left">
                                            <Button fullWidth disabled className="mb-5">Status</Button>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <Button variant="text" className="mb-1 px-5 text-gray-800 dark:text-white" style={{ minWidth: '120px', fontWeight: '600' }}>Completed</Button>
                                                <Button variant="text" className="mb-1 px-5 text-gray-800 dark:text-white" style={{ minWidth: '120px', fontWeight: '600' }}>Running</Button>
                                                <Button variant="text" className="mb-1 px-5 text-gray-800 dark:text-white" style={{ minWidth: '120px', fontWeight: '600' }}>Queued</Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card></>
                            )}

                        </div>
                    </div>


                    {/* Scrollable Content Section */}
                    <div className="flex-grow ml-0 md:ml-[sidebarWidth] md:pr-10 overflow-auto h-full flex justify-center items-center">
    <TransactionsTable/>
</div>


                </div>
            </div>
        </>
    );
};


export default ModelsScreen;
