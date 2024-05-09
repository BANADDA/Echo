import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { auth } from '../auth/config/firebase-config';
import { dataCards } from '../data/cards';
import CardComponent from "./CardComponent";

const MainContent = ({ handleExploreClick }) => {  
   const [user, setUser] = useState({
  isAuthenticated: false,
  name: '',
  email: '',
  photoURL: ''
});

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
    <div className="flex-1 px-8 bg-slate-100 dark:bg-slate-900">
      <div className="flex flex-col justify-between h-full rounded-lg bg-white dark:bg-slate-700 p-6">
        <div className="pl-10">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Jervis...</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 font-medium">
              Jervis is a cutting-edge MLOps system designed to streamline and optimize the machine learning lifecycle, from model development to deployment and monitoring. By leveraging Echo, teams can ensure their machine learning models are not only developed with precision but also deployed efficiently and maintained effectively in production environments.
              Learn how Echo integrates seamlessly with your workflows to not only enhance model performance but also contribute towards a sustainable future in AI.
            </p>
          </div>
        </div>

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
        {dataCards.map((card, index) => (
          <div key={index} className="flex-auto min-w-0" style={{ flexBasis: 'calc(25% - 1rem)' }}>
            <CardComponent
              card={card}
              onExplore={handleExploreClick}
              isComingSoon={card.title !== "Large Language Models"} />
          </div>
        ))}
      </div>

    </div></>
  );
};

MainContent.propTypes = {
  handleExploreClick: PropTypes.func.isRequired
};

export default MainContent;
