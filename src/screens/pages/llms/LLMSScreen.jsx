import { Button, Card, CardBody, Input, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import hardwareOptions from "../../../data/hardwareOptions";
import { LLMs_10B, LLMs_20B, LLMs_30B } from "../../../data/llms";
import ModelCard from "../../../widgets/models";
import CustomSelect from "../../../widgets/select";

const LLMSScreen = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    const [newModelName, setNewModelName] = useState('');
    const [modelID, setModelID] = useState('');
    const [license, setLicense] = useState('Public');
    const [spaceHardware, setSpaceHardware] = useState('');
    const [huggingFaceDatasetID, setHuggingFaceDatasetID] = useState('');

    // Initial Theme Check
    useEffect(() => {
        themeCheck();
    }, []);

    const themeCheck = () => {
        const userTheme = localStorage.getItem("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (localStorage.theme === "dark" || (!userTheme && systemTheme)) {
            document.documentElement.classList.add("dark");
            setIsDarkTheme(true);
        } else {
            document.documentElement.classList.add("light");
            setIsDarkTheme(false);
        }
    };

    // Manual Theme Switch
    const themeSwitch = () => {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
            localStorage.setItem("theme", "light");
            setIsDarkTheme(false);
        } else {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
            localStorage.setItem("theme", "dark");
            setIsDarkTheme(true);
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleModelSelect = (model) => {
        setSelectedModel(model);
    };

    const handleFineTune = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        // Capture all the fields entered
        const fineTuneData = {
            modelName: newModelName,
            modelID: selectedModel.id,
            huggingFaceDatasetID,
            spaceHardware,
            license
        };
        console.log("Fine-tune data:", fineTuneData);
        // Reset the form fields if needed
        setNewModelName('');
        setModelID('');
        setHuggingFaceDatasetID('');
        setSpaceHardware('');
    };

    return (
        <>
            <div className="flex flex-col h-auto">
                <Navbar
                    isDarkTheme={isDarkTheme}
                    themeSwitch={themeSwitch}
                    toggleMobileMenu={toggleMobileMenu}
                    isMobileMenuOpen={isMobileMenuOpen}
                />
                <div className="h-full flex flex-col md:flex-row bg-slate-100 dark:bg-slate-900">
                    <div className="w-full md:w-1/3 p-4">
                        {/* Column 1: Large Card */}
                        <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg py-6">
                            <h2 className="text-xl text-center font-bold py-5">Select Language Model</h2>
                            <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 145px)" }}>
                                <Card className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-none">
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
                                                    />
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
                                                    />
                                                </div>
                                                <div className="mb-6">
                                                    <Typography variant="h6" color={isDarkTheme ? "white" : "blue-gray"}>
                                                        Select Train Hardware
                                                    </Typography>
                                                    <CustomSelect
                                                        options={hardwareOptions}
                                                        onChange={(selectedOptions) => setSpaceHardware(selectedOptions)}
                                                    />
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
        </>
    );
};

export default LLMSScreen;
