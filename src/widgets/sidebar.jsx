import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import React from "react";
import { FaChartBar, FaCog, FaFileAlt, FaHome, FaQuestionCircle, FaUserCircle, FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";
import CustomSliderIcon from "./CustomSliderIcon";

const Sidebar = ({ user, activeScreen }) => {
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, active: activeScreen === 'Dashboard', path: "/" },
    { name: "Models", icon: <FaUserCircle />, active: activeScreen === 'Models', path: "/models" },
    { name: "Fine-tuning", icon: <CustomSliderIcon />, active: activeScreen === 'Fine-tuning', path: "/llms" },
    { name: "Billing", icon: <FaWallet />, active: activeScreen === 'Wallet', path: "/payment" },
    { name: "Settings", icon: <FaCog />, active: activeScreen === 'Settings', path: "" },
    { name: "Deployment", icon: <FaChartBar />, active: activeScreen === 'Usage', path: "" },
    { name: "Docs", icon: <FaFileAlt />, active: activeScreen === 'Docs', path: "" },
  ];

  return (
<div className="fixed top-0 left-0 h-full w-64 bg-[#1F2937] text-white">
      <Card className="bg-transparent shadow-none overflow-hidden w-full h-full">
        <CardBody className="flex flex-col justify-between h-full">
          <a href='/' className="flex flex-shrink-0 items-center p-4 pt-0">
            <img
              className="h-11 w-auto"
              src="./static/img/echo_1.png"
              alt="Echo"
            />
          </a>
          <nav className="mt-4">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {index !== 0 && <hr className="my-2 border-t border-gray-700" />}
                <Link to={item.path}>
                  <Button
                    color="transparent"
                    className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg text-left ${item.active ? "bg-green-500 text-white" : "hover:bg-green-600"}`}
                    ripple={false}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Button>
                </Link>
              </React.Fragment>
            ))}
          </nav>
          <div className="flex flex-col items-start p-4 pb-0 gap-2 mt-auto">
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
