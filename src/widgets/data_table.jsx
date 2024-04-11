import { Button } from "@material-tailwind/react";
import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { fetchTrainingJobsForUser } from "../auth/config/firebase-config";

const TABLE_HEAD = ["Model Name", "Domain", "Model ID", "Dataset ID", "GPU Selected", "Job Status", "Action"];

ModelTable.propTypes = {
  domainFilter: PropTypes.any,
  statusFilter: PropTypes.any,
};

export function ModelTable({ domainFilter, statusFilter }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [trainingJobs, setTrainingJobs] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const modelsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      const fetchedJobs = await fetchTrainingJobsForUser();
      setTrainingJobs(fetchedJobs);
    };
    fetchJobs();
  }, []); // Fetch jobs on component mount

  // Apply filters to trainingJobs if filter is set
  const filteredModels = trainingJobs.filter(row => {
    return (!domainFilter || row.domain === domainFilter) && (!statusFilter || row.jobStatus === statusFilter);
  }).filter(row => row.modelName.toLowerCase().includes(searchValue.toLowerCase()));

  // Calculate the range of page numbers to display
  const rangeStart = Math.max(1, currentPage - 2);
  const rangeEnd = Math.min(currentPage + 2, Math.ceil(filteredModels.length / modelsPerPage));

  // Function to handle pagination click
  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle action click
  const handleActionClick = (rowIndex) => {
    setActiveRow(activeRow === rowIndex ? null : rowIndex);
  };

  return (
    <div className="h-auto mt-10 p-5 bg-gray-200 pt-2 dark:bg-gray-800 text-gray-800 dark:text-white w-full relative">
      <div className="mb-4 flex p-5 flex-col justify-between bg-gray-200 pt-2 dark:bg-gray-600 text-gray-800 dark:text-white gap-8 md:flex-row md:items-center">
        <div>
          <h5 className="text-xl font-bold">Model Repositories</h5>
          <p className="mt-1 text-gray-800 dark:text-white font-normal">
            Monitor your fine-tuned ML models
          </p>
        </div>
        <div className="flex w-full shrink-0 gap-2 md:w-max">
          <input
            type="text"
            placeholder="Search by model name"
            className="border border-gray-300 rounded-md text-gray-800 dark:text-black px-3 py-1 focus:outline-none focus:ring focus:border-blue-300"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <span className="text-blue-gray font-normal leading-none opacity-70">
                    {head}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredModels.slice((currentPage - 1) * modelsPerPage, currentPage * modelsPerPage).map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border-b border-blue-gray-50 p-4">
                  <span className="text-blue-gray font-normal">{row.modelName}</span>
                </td>
                <td className="border-b border-blue-gray-50 p-4">
                  <span className="text-blue-gray font-normal">{row.domain}</span>
                </td>
                <td className="border-b border-blue-gray-50 p-4">
                  <span className="text-blue-gray font-normal">{row.modelId}</span>
                </td>
                <td className="border-b border-blue-gray-50 p-4">
                  <span className="text-blue-gray font-normal">{row.datasetId}</span>
                </td>
                <td className="border-b border-blue-gray-50 p-4">
                  <span className="text-blue-gray font-normal">{row.gpu}</span>
                </td>
                <td className="border-b border-blue-gray-50 p-4">
                  <span className="text-blue-gray font-normal">{row.jobStatus}</span>
                </td>
                <td className="border-b border-blue-gray-50 p-4">
                  <div className="relative">
                    <Button
                      size="sm"
                      onClick={() => handleActionClick(rowIndex)}
                      buttonType="link"
                      ripple="dark"
                      className="flex items-center"
                    >
                      <span>{row.jobStatus === 'Running' ? 'Stop Training' : 'Start Training'}</span>
                      {/* {activeRow === rowIndex ? <BsChevronUp className="ml-1" /> : <BsChevronDown className="ml-1" />} */}
                    </Button>

                    {/* {activeRow === rowIndex && (
    <div className="absolute top-0 right-0 mt-10 bg-white dark:bg-green-800 shadow-md rounded-md z-50">
      <Menu
        placement="bottom-start"
        onClick={() => setActiveRow(null)}
      >
        {row.jobStatus === 'Running' ? (
          <MenuItem className="text-gray-800 dark:text-white" ripple="light">
            Stop Training
          </MenuItem>
        ) : (
          <MenuItem className="text-gray-800 dark:text-white" ripple="light">
            Start Training
          </MenuItem>
        )}
        <MenuItem className="text-gray-800 dark:text-white" ripple="light">
          Delete Model
        </MenuItem>
      </Menu>
    </div>
  )} */}
                  </div>


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button
          onClick={() => handlePaginationClick(currentPage - 1)}
          disabled={currentPage === 1}
          color="gray"
          buttonType="link"
          size="sm"
          rounded={false}
          iconOnly
          ripple="light"
        >
          <BsArrowLeft strokeWidth={2} className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          {[...Array(rangeEnd - rangeStart + 1).keys()].map((pageNumber) => (
            <Button
              key={pageNumber + rangeStart}
              onClick={() => handlePaginationClick(pageNumber + rangeStart)}
              color={currentPage === pageNumber + rangeStart ? "lightBlue" : "gray"}
              buttonType="link"
              size="sm"
              rounded={false}
              ripple="light"
            >
              {pageNumber + rangeStart}
            </Button>
          ))}
        </div>
        <Button
          onClick={() => handlePaginationClick(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredModels.length / modelsPerPage)}
          color="gray"
          buttonType="link"
          size="sm"
          rounded={false}
          iconOnly
          ripple="light"
        >
          <BsArrowRight strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
