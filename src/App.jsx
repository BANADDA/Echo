import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';
import AuthModal from "./auth/AuthModal";
import { auth } from "./auth/config/firebase-config";
import Alert from "./components/Alert";
import MainContent from "./components/MainContent";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { menus } from "./data/menus";
import LLMSScreen from "./screens/pages/llms/LLMSScreen";
import ModelsScreen from "./screens/pages/llms/models";
import SignIn from "./screens/sign-in";
import SignUp from "./screens/sign-up";
import UserInfoPopup from "./widgets/userInfo";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAuthModel, setShowAuthModel] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [isProfileClicked, setIsProfileClicked] = useState(false);

  const toggleProfileWidget = () => setIsProfileClicked(!isProfileClicked);


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

  const navigate = useNavigate(); // Define useNavigate hook here

  const handleExploreClick = (title, link) => {
    if (isAuthenticated) {
      setCurrentTitle(title);
      setShowAlert(true);
      // Navigate to the provided link
      if (link) {
        navigate(link);
      }
    } else {
      setShowAuthModel(true);
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
    <div className="flex flex-col">
      <Routes>
        <Route path="/" element={
          <>
            {showAlert && (
              <Alert currentTitle={currentTitle} onClose={() => setShowAlert(false)} />
            )}
            {showAuthModel && (
              <AuthModal onClose={() => setShowAuthModel(false)} />
            )}
            {isProfileClicked && (
              <UserInfoPopup
                onClose={() => setIsProfileClicked(false)}
                userName={user.name}
                userEmail={user.email}
                userPhotoURL={user.photoURL}
              />
            )}

            <Navbar
              isDarkTheme={isDarkTheme}
              themeSwitch={themeSwitch}
              toggleMobileMenu={toggleMobileMenu}
              isMobileMenuOpen={isMobileMenuOpen}
              onProfileClick={toggleProfileWidget} // Passing the function as a prop
            />
            <div className="flex flex-1">
              <Sidebar isDarkTheme={isDarkTheme} Menus={menus} />
              <div className="flex-1 p-10 px-8 bg-slate-100 dark:bg-slate-900">
                <MainContent handleExploreClick={handleExploreClick} />
              </div>
            </div>
          </>
        } />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/llms" element={<LLMSScreen />} />
        <Route path="/models" element={<ModelsScreen />}/>
      </Routes>
    </div>
  );
}

export default App;
