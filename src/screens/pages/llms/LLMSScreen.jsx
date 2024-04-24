import { Alert, Button, ButtonGroup, Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { addTrainingJob, auth, userJobs } from "../../../auth/config/firebase-config";
import Navbar from "../../../components/Navbar";
import NewJobModal from "../../../widgets/NewJobModal";
import FineTuningJobContainer from "../../../widgets/job_container";
import CustomLoadingBar from "../../../widgets/progress";
import Sidebar from "../../../widgets/sidebar";
import UserInfoPopup from "../../../widgets/userInfo";

const LLMSScreen = () => {
    // State variables and hooks
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [newModelName, setNewModelName] = useState('');
    const [license, setLicense] = useState('');
    const [spaceHardware, setSpaceHardware] = useState('');
    const [huggingFaceModelID, setHuggingFaceModelID] = useState('');
    const [huggingFaceDatasetID, setHuggingFaceDatasetID] = useState('');
    const [showProgress, setShowProgress] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [modelNameError, setModelNameError] = useState('');
    const [modelIDError, setModelIDError] = useState('');
    const [datasetIDError, setDatasetIDError] = useState('');
    const [hardwareError, setHardwareError] = useState('');
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const [groupedModels, setGroupedModels] = useState({});
    const [selectedModel, setSelectedModel] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [navbarHeight, setNavbarHeight] = useState(0);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [validationCriteria, setValidationCriteria] = useState('');
    const [performanceBenchmarks, setPerformanceBenchmarks] = useState('');
    const [modelDescription, setModelDescription] = useState('');
    const [datasetDescription, setDatasetDescription] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [activeButton, setActiveButton] = useState("All");
    const [fineTuningJobs, setFineTuningJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showNewJobModal, setShowNewJobModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const [user, setUser] = useState({
        isAuthenticated: false,
        name: '',
        email: '',
        photoURL: ''
    });

    // Ref for interval
    const intervalRef = useRef(null);

    const location = useLocation(); // This reacts to changes in the route

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const jobs = await userJobs();
            setFineTuningJobs(jobs);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleJobSubmission = async () => {
        setShowProgress(true); // Show the loading indicator
        try {
            await fetchJobs(); // Fetch updated list of jobs
            setShowSuccessAlert(true); // Show the success message
            setTimeout(() => {
                setShowSuccessAlert(false); // Hide the success message after 2 seconds
            }, 2000); // 2000 milliseconds = 2 seconds
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        }
        setShowProgress(false); // Hide the loading indicator
    };
    

    // Fetch models from Hugging Face API
    useEffect(() => {
        setIsLoading(true);
        fetch("https://huggingface.co/api/models")
            .then(response => response.json())
            .then(data => {
                const groups = data.reduce((acc, model) => {
                    const tag = model.pipeline_tag || 'unknown';
                    if (!acc[tag]) {
                        acc[tag] = [];
                    }
                    acc[tag].push(model);
                    return acc;
                }, {});
                setGroupedModels(groups);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch models:", error);
                setIsLoading(false);
            });
    }, []);

    // Effect to set navbar height
    useEffect(() => {
        const navbar = document.getElementById("navbar");
        if (navbar) {
            const height = navbar.offsetHeight;
            setNavbarHeight(height);
        }
    }, []);

    // Theme check on mount
    useEffect(() => {
        themeCheck();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Theme check function
    const themeCheck = () => {
        const userTheme = localStorage.getItem("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (localStorage.theme === "dark" || (!userTheme && systemTheme)) {
            document.documentElement.classList.add("dark");
            setIsDarkTheme(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkTheme(false);
        }
    };

    // Theme switch function
    const themeSwitch = () => {
        if (isDarkTheme) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkTheme(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkTheme(true);
        }
    };

    // Function to toggle mobile menu
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Function to toggle profile widget
    const toggleProfileWidget = () => setIsProfileClicked(!isProfileClicked);

    // Function to select a job
    const selectJob = (job) => setSelectedJob(job);

    // Function to handle button clicks
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    // Function to handle file change
    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setHuggingFaceDatasetID('');
        }
    };

    // Function to validate form
    const validateForm = () => {
        let isValid = true;

        if (!newModelName.trim()) {
            setModelNameError('Model name is required.');
            isValid = false;
        } else {
            setModelNameError('');
        }

        if (!modelIDError.trim()) {
            setModelIDError('Model id is required.');
            isValid = false;
        } else {
            setModelIDError('');
        }

        if (!huggingFaceDatasetID.trim()) {
            setDatasetIDError('Dataset ID is required.');
            isValid = false;
        } else {
            setDatasetIDError('');
        }

        if (!spaceHardware) {
            setHardwareError('Training hardware is required.');
            isValid = false;
        } else {
            setHardwareError('');
        }

        return isValid;
    };

    // Function to handle fine-tune
    const handleFineTune = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setShowProgress(true);
        setProgressValue(0);

        intervalRef.current = setInterval(() => {
            setProgressValue((prevValue) => {
                const newValue = prevValue + 10;
                if (newValue >= 100) {
                    clearInterval(intervalRef.current);
                    handleTrainingJobSubmission(newModelName);
                    setShowProgress(false);
                    return 100;
                }
                return newValue;
            });
        }, 300);
    };

    // Function to handle training job submission
    const handleTrainingJobSubmission = async (newModelName) => {
        try {
            console.log("Submitting training job...");
            console.log("New Model Name:", newModelName);
            console.log("Huggingface Dataset ID:", huggingFaceDatasetID);
            console.log("Space Hardware:", spaceHardware);
            console.log("License:", license);

            const domain = "Large Language Models";
            const jobStatus = "Queued";

            await addTrainingJob(
                newModelName,
                selectedModel,
                huggingFaceDatasetID,
                spaceHardware,
                license,
                domain,
                jobStatus
            );
            console.log("Training job submitted successfully!");
            setShowSuccessAlert(true);
            navigate('/models');
        } catch (error) {
            console.error("Failed to submit the model for training:", error);
        }

        setShowProgress(false);
        setNewModelName('');
        setHuggingFaceModelID('');
        setHuggingFaceDatasetID('');
        setSelectedModel(null);
        setSpaceHardware('');
        setLicense('MIT');

        setShowProgress(true);
        setProgressValue(0);

        // Simulate progress
        intervalRef.current = setInterval(() => {
            setProgressValue((prevValue) => {
                const newValue = prevValue + 10;
                if (newValue >= 100) {
                    clearInterval(intervalRef.current);
                    handleTrainingJobSubmission(newModelName);
                    setShowProgress(false);// Pass newModelName as argument
                    return 100;
                }
                return newValue;
            });
        }, 300);
    };

    // Effect to handle authentication state changes
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

    // Filter models by search term
    const getFilteredModelsByGroup = (models) => {
        return models.filter(model => {
            const searchQuery = searchTerm.toLowerCase();
            const matchesTag = model?.pipeline_tag?.toLowerCase().includes(searchQuery);
            const matchesModelId = model?.modelId?.toLowerCase().includes(searchQuery);
            return searchTerm ? matchesTag || matchesModelId : true;
        });
    };

    function chunkArray(myArray, chunk_size) {
        const results = [];
        while (myArray.length) {
            results.push(myArray.splice(0, chunk_size));
        }
        return results;
    }

    return (
        <>
            <div className="flex flex-col h-screen">
                {/* Profile Popup */}
                {isProfileClicked && (
                    <UserInfoPopup
                        onClose={() => setIsProfileClicked(false)}
                        userName={user.name}
                        userEmail={user.email}
                        userPhotoURL={user.photoURL}
                    />
                )}

                {/* Navbar */}
                <div className="top-0 w-full z-50">
                    <Navbar
                        isDarkTheme={isDarkTheme}
                        themeSwitch={themeSwitch}
                        toggleMobileMenu={toggleMobileMenu}
                        isMobileMenuOpen={isMobileMenuOpen}
                        onProfileClick={toggleProfileWidget}
                    />
                </div>

                {/* New Job Modal */}
                <NewJobModal
                    isOpen={showNewJobModal}
                    closePopup={() => setShowNewJobModal(false)}
                    onJobSubmit={handleJobSubmission} // Ensure this is triggered after job creation
                />


                {/* Main Content */}
                <div className="flex flex-grow overflow-hidden">
                    {/* Sidebar, shown only when the user is authenticated */}
                    <div className="sidebar flex-none w-64" style={{ backgroundColor: '#f8f9fa' }}> {/* Adjust width as needed */}
                        <Sidebar user={user} activeScreen="Fine-tuning" />
                    </div>
                    {/* Main Content Area */}
                    <div className="content flex-grow min-w-0 overflow-y-auto bg-white dark:bg-slate-900">
                        <div className="m-5 mt-16 mb-8 ">
                            <Typography variant="h5" color="initial" className="dark:text-white px-5">Echo Train</Typography>
                            <div className="flex justify-between px-5 items-center">
                                <ButtonGroup flex w-max flex-col>
                                    <Button
                                        className={`p-3 rounded-none ${activeButton === "All" ? "bg-green-500" : ""}`}
                                        onClick={() => handleButtonClick("All")}
                                    >
                                        All
                                    </Button>
                                    <Button
                                        className={`p-3 rounded-none ${activeButton === "Running" ? "bg-green-500" : ""}`}
                                        onClick={() => handleButtonClick("pending")}
                                    >
                                        Pending
                                    </Button>
                                    <Button
                                        className={`p-3 rounded-none ${activeButton === "Completed" ? "bg-green-500" : ""}`}
                                        onClick={() => handleButtonClick("Completed")}
                                    >
                                        Completed
                                    </Button>
                                    <Button
                                        className={`p-3 rounded-none ${activeButton === "Failed" ? "bg-green-500" : ""}`}
                                        onClick={() => handleButtonClick("Failed")}
                                    >
                                        Failed
                                    </Button>
                                </ButtonGroup>
                                <Button
                                    className="p-3 bg-green-800 hover:bg-green-600 text-white"
                                    onClick={() => setShowNewJobModal(true)}
                                >
                                    + New Job
                                </Button>
                            </div>
                        </div>

                        {/* Job Cards */}
                        <div className="h-full mt-5 mb-16 grid grid-cols-2 gap-5 px-10 relative">
                            {/* First Column - Scrollable */}
                            <div className="overflow-y-auto">
                                <div className="bg-white dark:bg-gray-200 p-5">
                                    {fineTuningJobs.length > 0 ? (
                                        chunkArray([...fineTuningJobs], 2).map((jobPair, index) => (
                                            <div key={index} className="grid grid-cols-2 gap-10">
                                                {jobPair.map((job) => (
                                                    <FineTuningJobContainer
                                                        key={job.id}
                                                        modelName={job.suffix}
                                                        modelId={job.baseModel}
                                                        creationDate={job.createdAt}
                                                        jobType={job.fineTuningType}
                                                        status={job.status}
                                                        stars={job.stars}
                                                        forks={job.forks}
                                                        onClick={() => selectJob(job)}
                                                    />
                                                ))}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex-grow bg-white dark:bg-gray-300 shadow rounded-lg p-4 flex flex-col justify-center items-center">
                                            <Typography variant="h6" color="gray" className="mb-2 dark:text-white">
                                                No fine-tuning jobs found
                                            </Typography>
                                            <Typography variant="body2" color="gray" className="dark:text-white">
                                                Create a fine-tuning job below.
                                            </Typography>
                                            <Button
                                                className="bg-green-700 p-3"
                                                ripple={true}
                                                onClick={() => setShowNewJobModal(true)}
                                            >
                                                + New Job
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Second Column - Fixed */}
                            <div className="bg-white dark:bg-gray-300 shadow rounded-lg p-4 sticky top-0">
                                {selectedJob ? (
                                    <div>
                                        <h3>Selected Job Details</h3>
                                        <p>Model Name: {selectedJob.suffix}</p>
                                        <p>Model ID: {selectedJob.modelId}</p>
                                        {/* <p>Creation Date: {format(new Date(selectedModel.creationDate), 'MMM d, yyyy')}</p> */}
                                        <p>Job Type: {selectedJob.jobType}</p>
                                        <p>Status: {selectedJob.status}</p>
                                    </div>
                                ) : (
                                    <Typography variant="body2" color="gray" className="h-full flex justify-center items-center dark:text-white">
                                        Select a training job to view details.
                                    </Typography>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {
                        showProgress && (
                            // When showProgress is true, show the loading overlay
                            showProgress && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                    <CustomLoadingBar progress={progressValue} label="Submitting" />
                                </div>
                            )

                        )
                    }{
                        showSuccessAlert && (
                            <div className="fixed inset-0 flex justify-center items-center backdrop-filter backdrop-blur-sm px-4">
                                <div className="w-full max-w-md mx-auto">
                                    <Alert color="green">Model submitted for training successfully!</Alert>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default LLMSScreen;
