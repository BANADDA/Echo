import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import React from "react";
import { FaChartBar, FaCog, FaFileAlt, FaHome, FaQuestionCircle, FaWallet } from "react-icons/fa";
import CustomSliderIcon from "./CustomSliderIcon";

const Sidebar = ({ user, activeScreen, onMenuClick }) => {
  const menuItems = [
    { name: "Home", icon: <FaHome />, active: false, screen: "Home" },
    { name: "Dashboard", icon: <CustomSliderIcon />, active: activeScreen === 'Dashboard', screen: "Dashboard" },
    { name: "Deployed Models", icon: <FaChartBar />, active: activeScreen === 'Models', screen: "Models" },
    { name: "Billing", icon: <FaWallet />, active: activeScreen === 'Billing', screen: "Billing" },
    { name: "Docs", icon: <FaFileAlt />, active: activeScreen === 'Docs', screen: "Docs" },
  ];

  const handleMenuClick = (screen) => {
    if (screen === "Home") {
      window.location.href = '/';
    } else {
      onMenuClick(screen);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-[#0e3517] text-white" style={{ fontFamily: 'Poppins', fontSize: '14px' }}>
      <Card className="bg-transparent shadow-none overflow-hidden w-full h-full">
        <CardBody className="flex flex-col justify-between h-full">
          <div className="flex flex-shrink-0 items-center p-4 pt-0 justify-center">
            <Typography
              variant="h3"
              className="text-white font-bold tracking-wide"
            >
              YOGPT
            </Typography>
          </div>
          <nav className="mt-4">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {index !== 0 && <hr className="my-2 border-t border-gray-700" />}
                <Button
                  color="transparent"
                  className={`flex items-center gap-4 w-full px-4 py-4 rounded-lg text-left ${item.active ? "bg-green-500 text-white" : "hover:bg-green-600"}`}
                  ripple={false}
                  onClick={() => handleMenuClick(item.screen)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Button>
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
