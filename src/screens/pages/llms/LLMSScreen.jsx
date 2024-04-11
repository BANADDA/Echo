import { Alert, Button, Card, CardBody, Input, Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { addTrainingJob, auth } from "../../../auth/config/firebase-config";
import Navbar from "../../../components/Navbar";
import hardwareOptions from "../../../data/hardwareOptions";
import { LLMs_10B, LLMs_20B, LLMs_30B } from "../../../data/llms";
import ModelCard from "../../../widgets/models";
import CustomLoadingBar from "../../../widgets/progress";
import CustomSelect from "../../../widgets/select";
import UserInfoPopup from "../../../widgets/userInfo";

const LLMSScreen = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    const [newModelName, setNewModelName] = useState('');
    const [license, setLicense] = useState('Public');
    const [spaceHardware, setSpaceHardware] = useState('');
    const [huggingFaceDatasetID, setHuggingFaceDatasetID] = useState('');
    const [showProgress, setShowProgress] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const intervalRef = useRef(null);
    // Add state hooks for validation messages
    const [modelNameError, setModelNameError] = useState('');
    const [datasetIDError, setDatasetIDError] = useState('');
    const [hardwareError, setHardwareError] = useState('');
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const navigate = useNavigate();


    const toggleProfileWidget = () => setIsProfileClicked(!isProfileClicked);


    const validateForm = () => {
        let isValid = true;

        // Validate Model Name
        if (!newModelName.trim()) {
            setModelNameError('Model name is required.');
            isValid = false;
        } else {
            setModelNameError('');
        }

        // Validate Huggingface Dataset ID
        if (!huggingFaceDatasetID.trim()) {
            setDatasetIDError('Dataset ID is required.');
            isValid = false;
        } else {
            setDatasetIDError('');
        }

        // Validate Training Hardware Selection
        if (!spaceHardware) {
            setHardwareError('Training hardware is required.');
            isValid = false;
        } else {
            setHardwareError('');
        }

        return isValid;
    };

    // Initial Theme Check
    useEffect(() => {
        themeCheck();
        // Cleanup interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

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

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleModelSelect = (model) => {
        setSelectedModel(model);
    };

    // Define a separate function to handle the asynchronous operation
    const handleTrainingJobSubmission = async () => {
        try {
            console.log("Submitting training job...");
            console.log("Selected Model:", selectedModel);
            console.log("New Model Name:", newModelName);
            console.log("Huggingface Dataset ID:", huggingFaceDatasetID);
            console.log("Space Hardware:", spaceHardware);
            console.log("License:", license);
    
            // Add domain and job status values here
            const domain = "Large Language Models";
            const jobStatus = "Queued";
        
            await addTrainingJob(
                selectedModel.name,
                selectedModel.id, // Assuming you have an 'id' property in selectedModel
                huggingFaceDatasetID,
                spaceHardware,
                license,
                domain,
                jobStatus // Pass domain and job status
            );
            console.log("Training job submitted successfully!");
            navigate('/models');
            setShowSuccessAlert(true);
        } catch (error) {
            console.error("Failed to submit the model for training:", error);
        }
    
        // Clear the form fields after successful submission or in case of error
        setShowProgress(false);
        setNewModelName('');
        setHuggingFaceDatasetID('');
        setSelectedModel(null);
        setSpaceHardware('');
        setLicense('MIT'); // Reset to default or intended value
    };   

// Update the handleFineTune function to call the new function
const handleFineTune = async (e) => {
    e.preventDefault();

    // Perform validation
    if (!validateForm()) {
        return; // Stop form submission if validation fails
    }

    // Clear any previous interval
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }

    setShowProgress(true);
    setProgressValue(0);

    // Simulate progress
    intervalRef.current = setInterval(() => {
        setProgressValue((prevValue) => {
            const newValue = prevValue + 10;
            if (newValue >= 100) {
                clearInterval(intervalRef.current);
                setShowProgress(false);
                handleTrainingJobSubmission();
                return 100;
            }
            return newValue;
        });
    }, 300);
};


    // const handleFineTune = async (e) => {
    //     e.preventDefault();

    //     // Perform validation
    //     if (!validateForm()) {
    //         return; // Stop form submission if validation fails
    //     }

    //     // Clear any previous interval
    //     if (intervalRef.current) {
    //         clearInterval(intervalRef.current);
    //     }

    //     setShowProgress(true);
    //     setProgressValue(0);

    //     // Simulate progress
    //     intervalRef.current = setInterval(() => {
    //         setProgressValue(async (prevValue) => {
    //             const newValue = prevValue + 10;
    //             if (newValue >= 100) {
    //                 clearInterval(intervalRef.current);
    //                 setShowProgress(false);
        
    //                 // Show success alert
    //                 setShowSuccessAlert(true);
    //                 try {
    //                     await addTrainingJob(
    //                         selectedModel.name,
    //                         newModelName,
    //                         huggingFaceDatasetID,
    //                         spaceHardware,
    //                         license
    //                     );
    //                     navigate('/models');
    //                     setShowSuccessAlert(false);
    //                 } catch (error) {
    //                     console.error("Failed to submit the model for training:", error);
    //                     setShowProgress(false);
    //                     setShowSuccessAlert(false);
    //                 }
        
    //                 // Clear the form fields after successful submission
    //                 setNewModelName('');
    //                 setHuggingFaceDatasetID('');
    //                 setSelectedModel(null);
    //                 setSpaceHardware('');
    //                 setLicense('MIT'); // Reset to default or intended value
        
    //                 return 100;
    //             }
    //             return newValue;
    //         });
    //     }, 300);
        
    // };

    const [user, setUser] = useState({
        isAuthenticated: false,
        name: '',
        email: '',
        photoURL: ''
    });

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser({
                    isAuthenticated: true,
                    name: user.displayName || 'No Name',
                    email: user.email,
                    photoURL: user.photoURL || 'path/to/default/image.png'
                });
            } else {
                // User is signed out
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
            <div className="flex flex-col h-auto">
                {isProfileClicked && (
                    <UserInfoPopup
                        onClose={() => setIsProfileClicked(false)}
                        userName={user.name}
                        userEmail={user.email}
                        userPhotoURL={user.photoURL}
                    />
                )}

                <div className="fixed top-0 w-full z-50">
                    <Navbar
                        isDarkTheme={isDarkTheme}
                        themeSwitch={themeSwitch}
                        toggleMobileMenu={toggleMobileMenu}
                        isMobileMenuOpen={isMobileMenuOpen}
                        onProfileClick={toggleProfileWidget}
                    />
                </div>
                <div className="pt-[heightOfNavbar]">
                    <div className="h-full flex flex-col md:flex-row bg-slate-100 dark:bg-slate-900">
                        <div className="sticky top-0 w-full md:w-1/3 p-4 h-screen overflow-auto"
                            style={{
                                scrollbarWidth: 'none', /* For Firefox */
                                '-ms-overflow-style': 'none', /* For Internet Explorer and Edge */
                                'scrollbar-color': 'transparent transparent' /* For newer Firefox versions */
                            }}>                            {/* Column 1: Large Card */}
                            <div className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg py-6 pl-0 ml-0">
                                <h2 className="text-xl text-center font-bold py-5 pt-10 bg-black text-white">Select Language Model</h2>
                                <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 145px)" }}>
                                    <Card className="w-full bg-slate-200 dark:bg-gray-800 text-gray-800 dark:text-white shadow-none">
                                        <CardBody>
                                            {/* Display the cards for 10 billion parameters */}
                                            <Typography variant="h6" color="blue-gray" className="font-bold mb-2">
                                                {"< 10B"}
                                            </Typography>
                                            <div className="flex flex-wrap">
                                                {LLMs_10B.map((card, index) => (
                                                    <div key={index} className={`w-1/4 p-2 ${selectedModel === card ? 'bg-gray-100' : ''}`} onClick={() => handleModelSelect(card)}>
                                                        <ModelCard imageUrl={card.imageUrl} text={card.name} />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Display the cards for 20 billion parameters */}
                                            <Typography variant="h6" color="blue-gray" className="font-bold mt-6 mb-2">
                                                {"< 20B"}
                                            </Typography>
                                            <div className="flex flex-wrap">
                                                {LLMs_20B.map((card, index) => (
                                                    <div key={index} className={`w-1/4 p-2 ${selectedModel === card ? 'bg-gray-100 dark:text-black' : ''}`} onClick={() => handleModelSelect(card)}>
                                                        <ModelCard imageUrl={card.imageUrl} text={card.name} />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Display the cards for 30 billion parameters */}
                                            <Typography variant="h6" color="blue-gray" className="font-bold mt-6 mb-2">
                                                {"< 30B"}
                                            </Typography>
                                            <div className="flex flex-wrap">
                                                {LLMs_30B.map((card, index) => (
                                                    <div key={index} className={`w-1/4 p-2 ${selectedModel === card ? 'bg-gray-100' : ''}`} onClick={() => handleModelSelect(card)}>
                                                        <ModelCard imageUrl={card.imageUrl} text={card.name} />
                                                    </div>
                                                ))}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 p-4">
                            {/* Column 2: Block Content */}
                            <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg  p-6 mt-4 md:mt-0">
                                <h2 className="text-xl text-center font-bold">Selected Model</h2>
                                {selectedModel ? (
                                    <>
                                        <div className="flex flex-col md:flex-row pt-10">
                                            <div className="bg-white w-56 h-auto md:max-w-1/2 md:h-auto mb-4 md:mb-0 shadow-lg">
                                                <img
                                                    src={selectedModel.imageUrl}
                                                    alt="Selected Model"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex md:ml-4 flex-col">
                                                <span className="text-xl font-semibold">Model Name: {selectedModel.name}</span>
                                                <span><span className="font-bold text-sm">Parameters:</span> {selectedModel.parameters.toLocaleString()}</span>
                                                <span><span className="font-bold text-sm">Base:</span> {selectedModel.base}</span>
                                                <span><span className="font-bold text-sm">Training Data Size:</span> {selectedModel.trainingDataSize}</span>
                                                <span><span className="font-bold text-sm">Main Application:</span> {selectedModel.mainApplication}</span>
                                                <span><span className="font-bold text-sm">Unique Features:</span> {selectedModel.uniqueFeatures}</span>
                                            </div>
                                        </div>
                                        <div className="mt-8 w-full flex flex-col md:flex-row justify-center">
                                            <Card color="transparent" shadow={false} className="w-full md:w-4/5 lg:w-5/5">
                                                <Typography color={isDarkTheme ? "white" : "blue-gray"} className="text-xl font-bold text-left">
                                                    Fine-Tune your LLM model
                                                </Typography>
                                                <hr className={`border-${isDarkTheme ? 'white' : 'gray-950'} border-b-1 pb-2`} />
                                                <form className="mt-3 mb-10" onSubmit={handleFineTune}>
                                                    <div className="mb-6">
                                                        <Typography variant="h6" color={isDarkTheme ? "white" : "blue-gray"}>
                                                            Model Name
                                                        </Typography>
                                                        <Input
                                                            size="lg"
                                                            placeholder="Provide new model name"
                                                            value={newModelName}
                                                            onChange={(e) => setNewModelName(e.target.value)}
                                                            error={modelNameError}
                                                        />
                                                        {modelNameError && <div className="text-red-500 text-sm">{modelNameError}</div>}
                                                    </div>
                                                    <div className="mb-6">
                                                        <Typography variant="h6" color={isDarkTheme ? "white" : "blue-gray"}>
                                                            Huggingface Dataset Id
                                                        </Typography>
                                                        <Input
                                                            size="lg"
                                                            placeholder="Provide dataset id from hugging face"
                                                            value={huggingFaceDatasetID} // Add value prop
                                                            onChange={(e) => setHuggingFaceDatasetID(e.target.value)}
                                                            error={datasetIDError}
                                                        />
                                                        {datasetIDError && <div className="text-red-500 text-sm">{datasetIDError}</div>}
                                                    </div>
                                                    <div className="mb-6">
                                                        <Typography variant="h6" color={isDarkTheme ? "white" : "blue-gray"}>
                                                            Select Train Hardware
                                                        </Typography>
                                                        <CustomSelect
                                                            options={hardwareOptions}
                                                            value={spaceHardware} // Ensure you have a value prop if your component supports it
                                                            onChange={(selectedOptions) => setSpaceHardware(selectedOptions)}
                                                        />
                                                        {hardwareError && <div className="text-red-500 text-sm mt-2">{hardwareError}</div>}
                                                    </div>
                                                    <div className="mb-6">
                                                        <Typography variant="h6" color={isDarkTheme ? "white" : "blue-gray"}>
                                                            License
                                                        </Typography>
                                                        <div className="relative">
                                                            <select
                                                                className="block appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                                value={license}
                                                                onChange={(e) => setLicense(e.target.value)}
                                                            >
                                                                <option value="MIT">MIT</option>
                                                                <option value="GPL">GPL</option>
                                                                <option value="Apache">Apache</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-white">
                                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M13.348 7.681l3.864 5.662a1 1 0 0 1-1.664 1.105L12 10.158l-3.548 4.29a1 1 0 1 1-1.664-1.105l3.864-5.662a1 1 0 0 1 1.664 0zM10 4a1 1 0 0 0-1 1v9a1 1 0 1 0 2 0V5a1 1 0 0 0-1-1z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button type="submit" className="mt-6 bg-green-600" fullWidth>
                                                        Start training
                                                    </Button>
                                                </form>
                                            </Card>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-center items-center h-64">
                                        <p>No model selected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {
                    showProgress && (
                        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center backdrop-filter backdrop-blur-sm z-50">
                            <div className="w-full px-4 md:px-20 lg:max-w-4xl">
                                <CustomLoadingBar progress={progressValue} label="Submitting" />
                            </div>
                        </div>
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
        </>
    );
};

export default LLMSScreen;
