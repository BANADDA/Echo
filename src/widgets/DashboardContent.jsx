import { Delete, Visibility } from '@mui/icons-material';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../auth/AuthContext';
import { deleteFineTuningJob, fetchJobs as fetchJobsFromFirebase } from '../auth/config/firebase-config';
import ChartComponent from './ChartComponent';
import JobDetails from './JobDetails';

function DashboardContent({
  filteredJobs,
  searchTerm,
  setSearchTerm,
  handleDateFilterChange,
  dateFilter,
  currentJobs,
  getStatusColor,
  currentPage,
  jobsPerPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  changePage,
  fetchJobs, // You may have this passed as a prop from a parent component
  setActiveScreen // Add this prop
}) {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); // Get the current user from context
  const [models, setModels] = useState([]); // Add a state to hold models

  useEffect(() => {
    const loadJobs = async () => {
      if (currentUser) { // Ensure the user is authenticated
        try {
          setLoading(true);
          const jobs = await fetchJobsFromFirebase();
          const sortedJobs = jobs.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds); // Sort jobs by createdAt timestamp
          setActiveScreen(sortedJobs); // Use the appropriate function to set the jobs
        } catch (error) {
          console.error('Error fetching jobs:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No user is currently signed in.");
        setLoading(false);
      }
    };

    loadJobs();
  }, [currentUser]);

  useEffect(() => {
    const fetchDeployedModels = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'deployed_models'));
        const modelsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setModels(modelsData);
        console.log('Models fetched:', modelsData); // Debugging log
      } catch (error) {
        console.error('Failed to fetch deployed models:', error);
      }
    };

    fetchDeployedModels();
  }, []);

  const toggleRow = index => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const getRowStyle = index => ({
    backgroundColor: expandedRow === index ? '#ccffcc' : 'white',
    borderBottom: '1px solid #e0e0e0'
  });

  const handleSelectJob = (jobId) => {
    setSelectedJobs(prevSelected => {
      if (prevSelected.includes(jobId)) {
        return prevSelected.filter(id => id !== jobId);
      } else {
        return [...prevSelected, jobId];
      }
    });
  };

  const handleDeleteJob = async (jobIds) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete the selected models?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(jobIds.map(id => deleteFineTuningJob(id)));
        Swal.fire('Deleted!', 'Your jobs have been deleted.', 'success');
        setSelectedJobs([]);
        fetchJobs(); // Refresh the job list after deletion
      } catch (error) {
        console.error('Error deleting jobs:', error);
        Swal.fire('Error!', 'There was an error deleting your jobs.', 'error');
      }
    }
  };

  const handleDeleteSelectedJobs = () => {
    handleDeleteJob(selectedJobs);
  };

  const handleSelectAllJobs = () => {
    if (selectedJobs.length === currentJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(currentJobs.map(job => job.id));
    }
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredByStatusJobs = currentJobs.filter(job => {
    if (statusFilter === 'All') {
      return true;
    }
    return job.status === statusFilter;
  });

  const sortedJobs = filteredByStatusJobs.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  return (
    <div className="flex flex-col ml-64 bg-white dark:bg-slate-900 p-6 mt-16">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button
          className="bg-green-500 text-white font-semibold px-4 py-2 rounded shadow hover:bg-green-600"
          onClick={() => navigate('/jobs')}
        >
          Create New Job
        </button>
      </div>
      <div className="w-3/5">
        <p className="text-gray-600 pb-3 font-medium text-base">
          Manage your training jobs as well as creating new jobs.
          Click <span className='font-semibold'>Create New Job</span> to start a training job.
        </p>
      </div>
      <div className='mb-5'>
        <ChartComponent jobs={filteredJobs} models={models} />
      </div>
      <h1 className="text-xl mb-2 font-bold">Training Runs</h1>
      <div className="overflow-x-auto py-6 px-3 bg-slate-100">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div className="flex items-center">
            <button data-dropdown-toggle="dropdownRadio"
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
              </svg>
              <select onChange={handleDateFilterChange} value={dateFilter} className="...">
                <option value="All">All time</option>
                <option value="Last day">Last day</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="Last year">Last year</option>
              </select>
            </button>
            <div className="ml-4">
              <label htmlFor="status-filter" className="mr-2 text-gray-700 dark:text-gray-400">Status:</label>
              <select
                id="status-filter"
                onChange={handleStatusFilterChange}
                value={statusFilter}
                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <option value="All">All</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              placeholder="Search for items"
            />
          </div>
        </div>
        {selectedJobs.length > 0 && (
          <button
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded shadow hover:bg-red-600 mb-4"
            onClick={handleDeleteSelectedJobs}
            disabled={selectedJobs.length === 0}
          >
            Delete Selected
          </button>
        )}
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="p-4">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  checked={selectedJobs.length === currentJobs.length}
                  onChange={handleSelectAllJobs}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </th>
              <th className="px-6 py-3">Model name</th>
              <th className="px-6 py-3">Model Id</th>
              <th className="px-6 py-3">Job Type</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedJobs.length > 0 ? sortedJobs.map((job, index) => (
              <React.Fragment key={index}>
                <tr onClick={() => toggleRow(index)} style={getRowStyle(index)} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="w-4 p-4">
                    <input
                      id={`checkbox-table-search-${index}`}
                      type="checkbox"
                      checked={selectedJobs.includes(job.id)}
                      onChange={() => handleSelectJob(job.id)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{job.suffix}</td>
                  <td className="px-6 py-4">{job.baseModel}</td>
                  <td className="px-6 py-4">{job.fineTuningType}</td>
                  <td className="px-6 py-4">{moment.unix(job.createdAt.seconds).fromNow()}</td>
                  <td className={`px-6 py-4 font-medium ${getStatusColor(job.status)}`}>{job.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <a className="font-medium text-green-600 dark:text-green-500 hover:underline mr-4">
                        <Visibility />
                      </a>
                      <a
                        href="#"
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteJob([job.id]);
                        }}
                      >
                        <Delete />
                      </a>
                    </div>
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr className="bg-green-100 dark:bg-gray-700">
                    <td colSpan="7" className="p-4">
                      <JobDetails job={job} setActiveScreen={setActiveScreen} /> {/* Pass setActiveScreen here */}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )) : (
              <tr>
                <td colSpan="7" className="px-6 py-4">No jobs found</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
