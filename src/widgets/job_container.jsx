import { format } from 'date-fns'; // Import date-fns for date formatting
import PropTypes from 'prop-types';
import React from 'react';

const FineTuningJobContainer = ({ modelName, modelId, creationDate, jobType, status, onClick }) => {
    const formattedDate = creationDate instanceof Date ? format(creationDate, 'MMM d, yyyy') : 'Invalid Date';
    const statusColorClass = status === 'pending' ? 'text-green-500' : 'text-red-500';
  
    return (
      <div className="p-2 rounded bg-white shadow mb-4 cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold truncate">{modelName}</h2>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-600">
          <div>
            <p>Model Id: {modelId}</p>
            <p>Job Type: {jobType}</p>
          </div>
          <span className={`${statusColorClass}`}>{status}</span>
        </div>
      </div>
    );
  };
  
// Define the prop types
FineTuningJobContainer.propTypes = {
    modelName: PropTypes.string.isRequired,
    modelId: PropTypes.string.isRequired,
    creationDate: PropTypes.instanceOf(Date).isRequired,
    jobType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    // If stars and forks are optional you can provide a default value or make them not required
  };
  
  export default FineTuningJobContainer;  
