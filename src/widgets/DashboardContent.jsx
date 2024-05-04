import { Delete, Visibility } from '@mui/icons-material';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChartComponent from './ChartComponent';

function DashboardContent({
  showNewJobModal,
  setShowNewJobModal,
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
  changePage
}) {
    
    const navigate = useNavigate();

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
            Click <span className='font-semibold'>Create New Job</span>  to start a training job.
        </p>
    </div>
    <div className='mb-5'>
    <ChartComponent jobs={filteredJobs} />
    </div>
    <h1 className="text-xl mb-2 font-bold">Training Runs</h1>
    <div className="overflow-x-auto py-6 px-3 bg-slate-100">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
            <div>
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
            </div>
            <label htmlFor="table-search" className="sr-only">
                Search
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
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
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="p-4">
                        <div className="flex items-center">
                            <input
                                id="checkbox-all-search"
                                type="checkbox"
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="checkbox-all-search" className="sr-only">
                                checkbox
                            </label>
                        </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Model name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Model Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Job Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Last Updated
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                {currentJobs.length > 0 ? currentJobs.map((job, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input
                                    id={`checkbox-table-search-${index}`}
                                    type="checkbox"
                                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">
                                    checkbox
                                </label>
                            </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {job.suffix}
                        </td>
                        <td className="px-6 py-4">
                            {job.baseModel}
                        </td>
                        <td className="px-6 py-4">
                            {job.fineTuningType}
                        </td>
                        <td className="px-6 py-4">
                            {moment.unix(job.createdAt.seconds).fromNow()}
                        </td>
                        <td className={`px-6 py-4 font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                <a href="#" className="font-medium text-green-600 dark:text-green-500 hover:underline mr-4">
                                    <Visibility /> {/* View Icon */}
                                </a>
                                <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                    <Delete /> {/* Delete Icon */}
                                </a>
                            </div>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="7" className="text-center py-4">
                            No data available
                        </td>
                    </tr>
                )}
            </tbody>

        </table>
        <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
            <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min((currentPage - 1) * jobsPerPage + 1, filteredJobs.length)}-
                {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length}
            </span>
            <ul className="inline-flex items-center">
                <li>
                    <button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-3 py-1 m-1 rounded hover:bg-gray-200 disabled:opacity-50">
                        Previous
                    </button>
                </li>
                {[...Array(totalPages).keys()].map((x) => (
                    <li key={x + 1}>
                        <button onClick={() => changePage(x + 1)} className={`px-3 py-1 m-1 rounded ${currentPage === x + 1 ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`}>
                            {x + 1}
                        </button>
                    </li>
                ))}
                <li>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-3 py-1 m-1 rounded hover:bg-gray-200 disabled:opacity-50">
                        Next
                    </button>
                </li>
            </ul>
        </nav>

    </div>
</div>
  );
}

export default DashboardContent;
