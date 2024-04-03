import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  FaChartPie,
  FaCog,
  FaFileAlt,
  FaHome,
  FaMoon,
  FaProjectDiagram,
  FaSun,
  FaTools,
} from "react-icons/fa";

function App() {
  const [open, setOpen] = useState(false); // Changed default to false for sidebar
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Menu items for the sidebar
  const Menus = [
    { title: "Dashboard", Icon: FaHome }, // Example: using FaHome for Dashboard
    { title: "Tools", Icon: FaTools, gap: true },
    { title: "ML Flows", Icon: FaProjectDiagram },
    { title: "Analytics", Icon: FaChartPie },
    { title: "Model Files", Icon: FaFileAlt, gap: true },
    { title: "Setting", Icon: FaCog },
  ];

  const cards = [
    {
      imgSrc: "./src/assets/multimodal.png",
      title: "Generative AI",
      description: "Because it's about motivating the doers. Because I'm here to follow my dreams and inspire others.",
      link: "#link1"
    },
    {
      imgSrc: "./src/assets/llms.png",
      title: "NLP/LLMs",
      description: "Exploring the intersection of design and technology. Pushing boundaries for a better user experience.",
      link: "#link2"
    },
    {
      imgSrc: "./src/assets/cv.png",
      title: "Computer Vision",
      description: "Design is not just what it looks like and feels like. Design is how it works.",
      link: "#link3"
    },
    {
      imgSrc: "./src/assets/voice.png",
      title: "Speech/Voice",
      description: "Great design is a multi-layered relationship between human life and its environment.",
      link: "#link4"
    }
  ];

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

  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <nav className="bg-green-900">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={toggleMobileMenu}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                {/*
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          */}
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                {/*
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          */}
                <svg
                  className="hidden h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="./src/assets/echo_1.png"
                  alt="Echo"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                  <a
                    href="#"
                    className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                    aria-current="page"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Projects
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Community
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Pricing
                  </a>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Theme Switch Button */}
              <div onClick={themeSwitch} className="cursor-pointer">
                {isDarkTheme ? (
                  <FaSun className="text-2xl text-white" />
                ) : (
                  <FaMoon className="text-2xl text-yellow-400" />
                )}
              </div>
              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={toggleProfileDropdown}
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                </div>
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    {/* Active: "bg-gray-100", Not Active: "" */}
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Mobile menu, show/hide based on menu state. */}
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
            <a
              href="#"
              className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
              aria-current="page"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
            >
              Projects
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
            >
              Community
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
            >
              Pricing
            </a>
          </div>
        </div>
      </nav>

      {/* Content Below Navbar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`${open ? "w-72" : "w-20"
            } h-screen p-5 pt-8 relative duration-300 ${isDarkTheme ? "dark:bg-gray-800" : "bg-dark-purple"
            }`}
        >
          <img
            src="./src/assets/control.png"
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
       border-2 rounded-full  ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />
          <div className="flex gap-x-4 items-center">
            <img
              src="./src/assets/logo.png"
              className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"
                }`}
            />
            <h1
              className={`text-gray-400 origin-left font-medium text-xl duration-200 ${!open && "scale-0"
                }`}
            >
              Echo
            </h1>
          </div>
          {/* Sidebar Menu Items */}
          <ul className="pt-6">
            {Menus.map((Menu, index) => (
              <li
                key={index}
                className={`flex rounded-md p-2 cursor-pointer ${isDarkTheme
                  ? "hover:bg-gray-700 text-gray-200"
                  : "hover:bg-light-white text-gray-900"
                  } items-center gap-x-4 ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 &&
                  (isDarkTheme ? "bg-gray-700" : "bg-light-white")
                  }`}
              >
                <Menu.Icon className="text-xl" /> {/* Use the Icon component */}
                <span
                  className={`${!open && "hidden"} origin-left duration-200 ${isDarkTheme ? "text-gray-200" : "text-gray-900"
                    }`}
                >
                  {Menu.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 px-8 bg-slate-100 dark:bg-slate-900">

          <div className="flex-1 px-8 bg-slate-100 dark:bg-slate-900">
            <div className="flex flex-col justify-between h-full rounded-lg bg-white dark:bg-slate-700 p-6">
              <div className="pl-10"> {/* Adjust left padding to push content slightly right */}
                {/* Container for the text details */}
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Echo</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 font-medium">
                    Echo is a cutting-edge MLOps system designed to streamline and optimize the machine learning lifecycle, from model development to deployment and monitoring. By leveraging Echo, teams can ensure their machine learning models are not only developed with precision but also deployed efficiently and maintained effectively in production environments.
                    Learn how Echo integrates seamlessly with your workflows to not only enhance model performance but also contribute towards a sustainable future in AI.
                  </p>
                </div>
              </div>

              {/* "Learn More" button at the bottom right */}
              <div className="self-end mt-auto">
                <button className="inline-flex items-center justify-center px-4 py-2 bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-white text-sm font-medium rounded-md transition-all duration-150 group">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-14">
  {cards.map((card, index) => (
    <div key={index} className="flex-auto min-w-0" style={{ flexBasis: 'calc(25% - 1rem)' }}>
      {/* Add transition and transform utilities to Card component */}
      <Card className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white overflow-hidden transform transition duration-500 ease-in-out hover:scale-105">
        <img
          src={card.imgSrc}
          alt={card.title}
          className="w-full h-auto bg-slate-500"
        />
        <CardBody>
          <Typography variant="h5" className="mb-2 text-blue-gray-900 dark:text-blue-gray-50">
            {card.title}
          </Typography>
          <Typography className="text-gray-900 dark:text-gray-50">
            {card.description}
          </Typography>
        </CardBody>
        <CardFooter className="pt-0">
          <a href={card.link} className="inline-block">
            <Button size="sm" variant="text" className="flex items-center gap-2 text-gray-900 dark:text-white relative group">
              Explore
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4 transition-transform duration-200 ease-in-out transform group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  ))}
</div>



          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
