import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import React from "react";
import { FaChartBar, FaCog, FaFileAlt, FaHome, FaPlus, FaQuestionCircle, FaUserCircle, FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";
import CustomSliderIcon from "./CustomSliderIcon";

const Sidebar = ({ user, activeScreen }) => {
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, active: activeScreen === 'Dashboard', path: "/" },
    { name: "Models", icon: <FaUserCircle />, active: activeScreen === 'Models', path: "/models" },
    { name: "Fine-tuning", icon: <CustomSliderIcon />, active: activeScreen === 'Fine-tuning', path: "/llms" },
    { name: "Crypto Wallet", icon: <FaWallet />, active: activeScreen === 'Wallet', path: "/payment" },
    { name: "Usage", icon: <FaChartBar />, active: activeScreen === 'Usage', path: "" },
    { name: "Settings", icon: <FaCog />, active: activeScreen === 'Settings', path: "" },
    { name: "Docs", icon: <FaFileAlt />, active: activeScreen === 'Docs', path: "" },
    // ... add other menu items with paths here
  ];

  return (
    <div className="fixed top-14 bottom-5 left-0 h-screen w-64 bg-[#1F2937] text-white">
      <Card className="bg-transparent shadow-none overflow-hidden w-full h-full">
        <CardBody className="flex flex-col justify-between h-full">
          <div>
            <Button
              className="flex items-center bg-green-700 gap-2 px-4 py-1 rounded-lg text-left hover:bg-[#328839]"
              ripple={false}
            >
              <FaPlus className="text-xl" />
              <span>New Project</span>
            </Button>
            <nav className="mt-4">
              {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                  {index !== 0 && <hr className="my-2 border-t border-gray-700" />}
                  <Link to={item.path}>
                    <Button
                      color="transparent"
                      className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg text-left ${item.active ? "bg-green-500 text-white" : "hover:bg-[#374151]"}`}
                      ripple={false}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>
          <div className="flex flex-col items-start p-4 gap-2 mt-auto mb-10">
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL}
                alt="User Avatar"
                className="h-5 w-5 rounded-full object-cover"
              />
              <Typography variant="small" className="capitalize text-gray-400 text-sm font-semibold">{user.name}</Typography>
            </div>
            <div className="flex items-center gap-2">
              <FaQuestionCircle className="text-gray-400" />
              <Typography variant="small" className="text-gray-400">Need Help?</Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Sidebar;
