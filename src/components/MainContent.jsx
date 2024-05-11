import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { auth } from '../auth/config/firebase-config';
import { servicesData } from '../data/dataCards';
import { ServiceCard } from '../screens/services/cards/ServiceCard';

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
      <div className="flex-1 bg-slate-100 dark:bg-slate-900">
        <div className="flex flex-col bg-green-50 py-10 justify-center h-full rounded-lg dark:bg-slate-700 p-6">
          <div className="pl-10">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">Jarvis</h2>
              <p className="text-gray-600 py-6 dark:text-gray-300 mb-4 font-medium">
                Jervis is a cutting-edge MLOps system designed to streamline and optimize the machine learning lifecycle, from model development to deployment and monitoring. By leveraging Jarvis, teams can ensure their machine learning models are not only developed with precision but also deployed efficiently and maintained effectively in production environments.
                Learn how Jarvis integrates seamlessly with your workflows to not only enhance model performance but also contribute towards a sustainable future in AI.
              </p>
            </div>
          </div>

          <div className="self-center mt-auto">
            <button className="inline-flex items-center justify-center px-10 py-4 bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 text-white text-xl font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out group">
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
          <div className="pt-14">
            <h2 className="text-center text-3xl font-bold mb-8">Services</h2>
        <p className='text-center mb-8 text-xl font-bold'>No Cost For Token Holders (min holding $100)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-4">
              {servicesData.map((service, index) => (
                <ServiceCard key={index} {...service}
                isComingSoon={service.title !== "Fine-Tune Models"} />
              ))}
            </div>
          </div>
        {/* <div className="flex flex-wrap gap-4 pt-14">
          {dataCards.map((card, index) => (
            <div key={index} className="flex-auto min-w-0" style={{ flexBasis: 'calc(25% - 1rem)' }}>
              <CardComponent
                card={card}
                onExplore={handleExploreClick}
                isComingSoon={card.title !== "Large Language Models"} />
            </div>
          ))}
        </div> */}

      </div>
      </>
  );
};

MainContent.propTypes = {
  handleExploreClick: PropTypes.func.isRequired
};

export default MainContent;
