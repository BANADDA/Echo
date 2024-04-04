import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import {
//   FaMoon,
//   FaSun
// } from "react-icons/fa";
import AuthModal from "./auth/AuthModal";
import { auth } from "./auth/config/firebase-config";
import Alert from "./components/Alert";
import MainContent from "./components/MainContent";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { menus } from "./data/menus";
import SignIn from "./screens/sign-in";
import SignUp from "./screens/sign-up";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAuthModel, setShowAuthModel] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');

  // Listen for changes in the authentication state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setIsAuthenticated(true);
      } else {
        // User is signed out.
        setIsAuthenticated(false);
      }
    });
    themeCheck();
  }, []);

  
const handleExploreClick = (title) => {
    if(isAuthenticated){
    setCurrentTitle(title);
    setShowAlert(true);
    }
    else {
      setShowAuthModel(true)
    }
  };


  // Initial Theme Check
  useEffect(() => {
    themeCheck();
  }, []);

  const themeCheck = () => {
    const userTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (localStorage.theme === "dark" || (!userTheme && systemTheme)) {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    } else {
      document.documentElement.classList.add("light");
      setIsDarkTheme(false);
    }
  };

  // Manual Theme Switch
  const themeSwitch = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setIsDarkTheme(true);
    }
  };

  // const onClick = () => {
  //   setIsDarkTheme(!isDarkTheme);
  //   themeSwitch();
  // };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // const toggleProfileDropdown = () =>
  //   setIsProfileDropdownOpen(!isProfileDropdownOpen);

  return (
    <BrowserRouter> {/* Wrap your app content with BrowserRouter */}
      <div className="flex flex-col">
        {/* Conditionally render components based on route */}
        <Routes>
          <Route path="/" element={
            <>
      {showAlert && (
        <Alert currentTitle={currentTitle} onClose={() => setShowAlert(false)} />
      )}
      {showAuthModel && (
        <AuthModal onClose={() => setShowAuthModel(false)} />
      )}
      {/* Navbar */}
      <Navbar
        isDarkTheme={isDarkTheme}
        themeSwitch={themeSwitch}
        toggleMobileMenu={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      {/* Content Below Navbar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isDarkTheme={isDarkTheme} Menus={menus} />
        {/* Main Content */}
        <div className="flex-1 p-10 px-8 bg-slate-100 dark:bg-slate-900">
          <MainContent handleExploreClick={handleExploreClick} />
        </div>
      </div>
            </>
          } />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
