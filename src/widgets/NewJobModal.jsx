import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, newTrainingJob } from '../auth/config/firebase-config';
import ModelService from '../data/ModelList';

const NewJobModal = () => {
  const [trainingDataOption, setTrainingDataOption] = useState('selectExisting');
  const [validationDataOption, setValidationDataOption] = useState('none');
  const [suffix, setSuffix] = useState('');
  const [seed, setSeed] = useState('Random');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [huggingFaceId, setHuggingFaceId] = useState('');
  const [validationCriteria, setValidationCriteria] = useState(['']);
  const [batchSize, setBatchSize] = useState(0); // Assuming a scale of 0-100 for slider
  const [batchSizeAuto, setBatchSizeAuto] = useState(true);
  const [learningRateMultiplier, setLearningRateMultiplier] = useState(0); // Assuming a scale of 0-100 for slider
  const [learningRateAuto, setLearningRateAuto] = useState(true);
  const [numberOfEpochs, setNumberOfEpochs] = useState(0); // Assuming a scale of 0-100 for slider
  const [numberOfEpochsAuto, setNumberOfEpochsAuto] = useState(true);
  const [fineTuningType, setFineTuningType] = useState('text-generation'); // Default value can be the first option
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [validationFile, setValidationFile] = useState(null);
  const user = auth.currentUser;
  const [models, setModels] = useState([]);  // State to store models
  const [modelParams, setModelParams] = useState('');
  const [baseModel, setBaseModel] = useState('');
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModelSelectModal, setShowModelSelectModal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Fetch models from ModelService when the modal is about to be shown
    if (showModelSelectModal) {
      const fetchedModels = ModelService.fetchAll();
      setModels(fetchedModels);
    }
  }, [showModelSelectModal]);

  useEffect(() => {
    if (showModelSelectModal) {
      const fetchedModels = ModelService.fetchAll();
      const groupedModels = fetchedModels.reduce((acc, model) => {
        const paramSize = `${model.numParameters} Params`;
        if (!acc[paramSize]) acc[paramSize] = [];
        acc[paramSize].push(model);
        return acc;
      }, {});
      setModels(groupedModels);
      setFilteredModels(groupedModels);
    }
  }, [showModelSelectModal]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (!term) {
      setFilteredModels(models);
      return;
    }
    const filtered = Object.keys(models).reduce((acc, key) => {
      const matchedModels = models[key].filter(model =>
        model.modelId.toLowerCase().includes(term.toLowerCase())
      );
      if (matchedModels.length > 0) {
        acc[key] = matchedModels;
      }
      return acc;
    }, {});
    setFilteredModels(filtered);
  };

  const toggleModelSelectModal = () => setShowModelSelectModal(!showModelSelectModal);

  const handleCriteriaChange = (index, event) => {
    const newCriteria = [...validationCriteria];
    newCriteria[index] = event.target.value;
    setValidationCriteria(newCriteria);
  };

  const handleAddCriteria = () => {
    setValidationCriteria([...validationCriteria, '']);
  };

  const handleRemoveCriteria = (index) => {
    const newCriteria = [...validationCriteria];
    newCriteria.splice(index, 1);
    setValidationCriteria(newCriteria);
  };

  const handleFileChange = (event, fileType) => {
    const file = event.target.files[0];
    if (file) {
      if (fileType === 'training') {
        setUploadedFile(file);
      } else if (fileType === 'validation') {
        setValidationFile(file);
      }
    }
  };

  const handleHuggingFaceIdChange = (event) => {
    setHuggingFaceId(event.target.value);
  };

  const handleModelSelection = (modelId, params) => {
    console.log("Model Id and params: ", modelId, params);
    setBaseModel(modelId);
    setModelParams(params); // Set parameter size when selecting a model
    toggleModelSelectModal();
  };

  const resetForm = () => {
    setTrainingDataOption('selectExisting');
    setValidationDataOption('none');
    setSuffix('');
    setSeed('Random');
    setUploadedFile(null);
    setHuggingFaceId('');
    setValidationCriteria(['']);
    setBatchSize(0);
    setBatchSizeAuto(true);
    setLearningRateMultiplier(0);
    setLearningRateAuto(true);
    setNumberOfEpochs(0);
    setNumberOfEpochsAuto(true);
    setFineTuningType('text-generation');
    setExpectedOutcome('');
    setValidationFile(null);
    setBaseModel('');
    setModelParams('');
  };

  const isFormValid = () => {
    let errors = [];
    if (baseModel.trim() === '') {
      errors.push('Base model ID is required.');
    }
    if (huggingFaceId.trim() === '') {
      errors.push('Hugging Face ID is required.');
    }
  }

  const handleSubmit = async () => {
    console.log("Submitting training job...");
    // if (!isFormValid()) {
    //   return;
    // }
    setShowProgress(true);
    // if (baseModel.trim() === '' || !modelParams) {
    //   console.error('Model ID or parameter size is missing');
    //   return;
    // }

    const jobData = {
      userId: user.uid,
      baseModel,
      modelParams,
      trainingDataOption,
      validationDataOption,
      suffix,
      seed,
      huggingFaceId,
      validationCriteria,
      batchSize,
      batchSizeAuto,
      learningRateMultiplier,
      learningRateAuto,
      numberOfEpochs,
      numberOfEpochsAuto,
      fineTuningType,
      expectedOutcome,
      status: 'pending'
    };

    try {
      await newTrainingJob(jobData);
      console.log('Job submitted successfully');
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        resetForm();
        navigate('/llms');
      }, 2000);
    } catch (error) {
      console.error('Error submitting the job:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    } finally {
      setShowProgress(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col ml-64 bg-white dark:bg-slate-900 p-6 mt-16">
      {
        formError && (
          <div className="fixed inset-0 flex justify-center items-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-md mx-auto">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline">{formError}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setFormError('')}>
                  <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 1 1-1.697 1.697l-2.651-2.65-2.651 2.65a1.2 1.2 0 1 1-1.697-1.697l2.651-2.651-2.651-2.651a1.2 1.2 0 1 1 1.697-1.697l2.651 2.651 2.651-2.651a1.2 1.2 0 1 1 1.697 1.697l-2.651 2.651 2.651 2.651z" /></svg>
                </span>
              </div>
            </div>
          </div>
        )
      }

      {
        showProgress && (
          <div className="fixed inset-0 flex justify-center items-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <h2>Submitting...</h2>
              <div style={{
                border: '4px solid #f3f3f3', /* Light grey */
                borderTop: '4px solid #3498db', /* Blue */
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'spin 2s linear infinite'
              }}></div>
            </div>
          </div>
        )
      }
      {
        showSuccessAlert && (
          <div className="fixed inset-0 flex justify-center items-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-md mx-auto">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline">Training job submitted for training successfully!</span>
              </div>
            </div>
          </div>
        )
      }

      {
        showError && (
          <div className="fixed inset-0 flex justify-center items-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-md mx-auto">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline">Failed to submit the model for training. Please try again.</span>
              </div>
            </div>
          </div>
        )
      }


      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard / NewJob</h1>
      </div>
      <div className="bg-white  p-5 rounded-lg w-full overflow-y-auto">
        {/* Header */}

        <div className="space-y-1">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fine-Tuning Job Type</label>
            <select
              className="block w-full mt-1 border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={fineTuningType}
              onChange={(e) => setFineTuningType(e.target.value)}
            >
              <option value="text-generation">Text Generation</option>
              <option value="language-modeling">Language Modeling</option>
              <option value="translation">Translation</option>
              <option value="summarization">Summarization</option>
              {/* Add more fine-tuning types as needed */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Outcome</label>
            <textarea
              className="block w-full mt-1 border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              placeholder="Describe what you expect to achieve after fine-tuning..."
            />
          </div>
        </div>

        {/* Base Model */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="flex-1 pr-4">
              <label className="block text-sm font-medium text-gray-700">Base Model</label>
              <p className="mt-2 text-sm text-gray-600">Provide baseline model ID, used as the starting point for training.</p>
              <div className="flex items-center"> {/* Flex container for input and button */}
                <input
                  type="text"
                  className="mt-1 block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Provide baseline model ID"
                  value={baseModel}
                  onChange={(e) => setBaseModel(e.target.value)}
                />
                <button
                  className="ml-4 py-2 px-4 bg-indigo-500 text-white font-medium rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  type="button"
                  onClick={toggleModelSelectModal} // Toggle model select modal
                >
                  Select Model
                </button>
              </div>
            </div>
          </div>
        </div>

        {showModelSelectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
            <div className="bg-white p-4 rounded-lg shadow-lg" style={{ width: '600px', maxHeight: '80%', overflowY: 'auto' }}>
              <h4 className="text-lg font-semibold">Select a Hugging Face Model ID</h4>
              <input
                type="text"
                placeholder="Search model..."
                value={searchTerm}
                onChange={handleSearch}
                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="my-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {Object.keys(filteredModels).length > 0 ? Object.keys(filteredModels).map((group) => (
                  <div key={group}>
                    <h5 className="text-gray-600 text-sm uppercase mt-4 mb-2">{group}</h5>
                    <ul>
                      {filteredModels[group].map((model, index) => (
                        <li key={index} className="text-blue-500 hover:text-blue-700 cursor-pointer p-1"
                          onClick={() => handleModelSelection(model.modelId, group)}>
                          {model.modelId}
                        </li>
                      ))}
                    </ul>
                  </div>
                )) : <p className="text-gray-600">No models found.</p>}
              </div>
              <button
                onClick={toggleModelSelectModal}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Training Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Training Data</label>
          <p className="text-sm text-gray-500">Add a JSON file to use for training or provide hugging face dataset id.</p>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="trainingData"
                value="uploadNew"
                checked={trainingDataOption === 'uploadNew'}
                onChange={() => setTrainingDataOption('uploadNew')}
              />
              <span className="ml-2">Upload new</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                className="form-radio"
                name="trainingData"
                value="selectExisting"
                checked={trainingDataOption === 'selectExisting'}
                onChange={() => setTrainingDataOption('selectExisting')}
              />
              <span className="ml-2">Hugging face dataset Id</span>
            </label>
          </div>
          {trainingDataOption === 'uploadNew' ? (
            <div className="mt-4">
              <div className="flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-800">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    {/* Your custom SVG here */}
                    <path fillRule="evenodd" d="M18.032 5.024C17.75 5 17.377 5 16.8 5h-5.3c-.2 1-.401 1.911-.61 2.854-.131.596-.247 1.119-.523 1.56a2.998 2.998 0 0 1-.953.954c-.441.275-.964.39-1.56.522l-.125.028-2.512.558A1.003 1.003 0 0 1 5 11.5v5.3c0 .577 0 .949.024 1.232.022.272.06.372.085.422a1 1 0 0 0 .437.437c.05.025.15.063.422.085C6.25 19 6.623 19 7.2 19H10a1 1 0 1 1 0 2H7.161c-.527 0-.981 0-1.356-.03-.395-.033-.789-.104-1.167-.297a3 3 0 0 1-1.311-1.311c-.193-.378-.264-.772-.296-1.167A17.9 17.9 0 0 1 3 16.838V11c0-2.075 1.028-4.067 2.48-5.52C6.933 4.028 8.925 3 11 3h5.838c.528 0 .982 0 1.357.03.395.033.789.104 1.167.297a3 3 0 0 1 1.311 1.311c.193.378.264.772.296 1.167.031.375.031.83.031 1.356V10a1 1 0 1 1-2 0V7.2c0-.577 0-.949-.024-1.232-.022-.272-.06-.373-.085-.422a1 1 0 0 0-.437-.437c-.05-.025-.15-.063-.422-.085ZM5.28 9.414l2.015-.448c.794-.177.948-.225 1.059-.294a1 1 0 0 0 .318-.318c.069-.11.117-.265.294-1.059l.447-2.015c-.903.313-1.778.874-2.518 1.615-.741.74-1.302 1.615-1.615 2.518ZM17 15a1 1 0 1 1 2 0v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2Z" clip-rule="evenodd"></path>
                  </svg>
                  <div className="flex text-sm text-gray-300">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-200 hover:text-indigo-100 focus-within:outline-none">
                      <span>{uploadedFile ? uploadedFile.name : 'Upload a file or drag and drop here'}</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'training')} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">(JSON files, csv, xlsx, zip)</p>
                </div>
              </div>
            </div>


          ) : (
            <div className="mt-4">
              {/* Hugging Face dataset ID input */}
              <label htmlFor="hugging-face-id" className="block text-sm font-medium text-gray-700">Hugging Face Dataset ID</label>
              <input
                type="text"
                name="hugging-face-id"
                id="hugging-face-id"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                placeholder="Enter Hugging Face dataset ID"
                value={huggingFaceId}
                onChange={handleHuggingFaceIdChange}
              />
            </div>
          )}
        </div>



        {/* Validation Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Validation Criteria</label>
          <p className="text-sm text-gray-500">Provide the criteria that will be used to evaluate the performance of your model.</p>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="validationData"
                value="uploadNew"
                checked={validationDataOption === 'uploadNew'}
                onChange={() => setValidationDataOption('uploadNew')}
              />
              <span className="ml-2">Upload new</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                className="form-radio"
                name="validationData"
                value="multiSelect"
                checked={validationDataOption === 'multiSelect'}
                onChange={() => setValidationDataOption('multiSelect')}
              />
              <span className="ml-2">Multi select criteria</span>
            </label>
          </div>

          {validationDataOption === 'uploadNew' ? (
            <div className=" bg-blackmt-4">
              <div className="flex justify-center bg-black items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-800">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    {/* Your custom SVG here */}
                    <path className='text-white' fillRule="evenodd" d="M18.032 5.024C17.75 5 17.377 5 16.8 5h-5.3c-.2 1-.401 1.911-.61 2.854-.131.596-.247 1.119-.523 1.56a2.998 2.998 0 0 1-.953.954c-.441.275-.964.39-1.56.522l-.125.028-2.512.558A1.003 1.003 0 0 1 5 11.5v5.3c0 .577 0 .949.024 1.232.022.272.06.372.085.422a1 1 0 0 0 .437.437c.05.025.15.063.422.085C6.25 19 6.623 19 7.2 19H10a1 1 0 1 1 0 2H7.161c-.527 0-.981 0-1.356-.03-.395-.033-.789-.104-1.167-.297a3 3 0 0 1-1.311-1.311c-.193-.378-.264-.772-.296-1.167A17.9 17.9 0 0 1 3 16.838V11c0-2.075 1.028-4.067 2.48-5.52C6.933 4.028 8.925 3 11 3h5.838c.528 0 .982 0 1.357.03.395.033.789.104 1.167.297a3 3 0 0 1 1.311 1.311c.193.378.264.772.296 1.167.031.375.031.83.031 1.356V10a1 1 0 1 1-2 0V7.2c0-.577 0-.949-.024-1.232-.022-.272-.06-.373-.085-.422a1 1 0 0 0-.437-.437c-.05-.025-.15-.063-.422-.085ZM5.28 9.414l2.015-.448c.794-.177.948-.225 1.059-.294a1 1 0 0 0 .318-.318c.069-.11.117-.265.294-1.059l.447-2.015c-.903.313-1.778.874-2.518 1.615-.741.74-1.302 1.615-1.615 2.518ZM17 15a1 1 0 1 1 2 0v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2Z" clip-rule="evenodd"></path>
                  </svg>
                  <div className="flex text-sm text-white">
                    <label htmlFor="validation-file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-200 hover:text-indigo-100 focus-within:outline-none">
                      <span>{validationFile ? validationFile.name : 'Upload a file or drag and drop here'}</span>
                      <input id="validation-file-upload" name="validation-file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'validation')} />
                    </label>
                  </div>
                  <p className="text-xs text-white">(JSON files)</p>
                </div>
              </div>
            </div>
          ) : validationDataOption === 'multiSelect' ? (
            <div className="mt-4">
              <label htmlFor="validation-criteria" className="block text-sm font-medium text-gray-700">
                Validation Criteria
              </label>
              {validationCriteria.map((criteria, index) => (
                <div key={index} className="flex mt-2 items-center">
                  <input
                    type="text"
                    name={`validation-criteria-${index}`}
                    className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={criteria}
                    onChange={(e) => handleCriteriaChange(index, e)}
                    placeholder="Enter a criteria"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCriteria(index)}
                    className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCriteria}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
              >
                Add Criteria
              </button>
            </div>

          ) : null}
        </div>
        {/* Suffix and Seed */}
        <div className="space-y-4 bg-gray-800 p-4 rounded-lg mt-10">
          <div>
            <label className="block text-sm font-medium text-gray-300">Suffix</label>
            <p className="text-sm text-gray-500">Add a custom suffix that will be appended to the output model name.</p>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="my-project"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Seed</label>
            <p className="text-sm text-gray-500">A seed value for the random number generator, ensuring consistent results across runs for reproducibility.</p>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Random"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
          </div>
        </div>

        {/* Hyperparameters Section */}

        <div className="space-y-4 bg-slate-200 p-4 rounded-lg mt-10">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Hyperparameter Tunning</h4>

            {/* Batch Size */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Batch size</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={batchSizeAuto}
                    onChange={() => setBatchSizeAuto(!batchSizeAuto)}
                  />
                  <span className="ml-2 text-sm">{batchSizeAuto ? 'Auto' : batchSize}</span>
                </div>
              </div>
              <input
                type="range"
                className="slider"
                min="1"
                max="100"
                value={batchSize}
                disabled={batchSizeAuto}
                onChange={(e) => setBatchSize(e.target.value)}
              />
            </div>

            {/* Learning Rate Multiplier */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Learning rate multiplier</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={learningRateAuto}
                    onChange={() => setLearningRateAuto(!learningRateAuto)}
                  />
                  <span className="ml-2 text-sm">{learningRateAuto ? 'Auto' : learningRateMultiplier}</span>
                </div>
              </div>
              <input
                type="range"
                className="slider"
                min="0.1"
                max="10"
                step="0.1"
                value={learningRateMultiplier}
                disabled={learningRateAuto}
                onChange={(e) => setLearningRateMultiplier(e.target.value)}
              />
              <p className="text-sm text-gray-500">In most cases, range of 0.1-10 is recommended.</p>
            </div>

            {/* Number of Epochs */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Number of epochs</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={numberOfEpochsAuto}
                    onChange={() => setNumberOfEpochsAuto(!numberOfEpochsAuto)}
                  />
                  <span className="ml-2 text-sm">{numberOfEpochsAuto ? 'Auto' : numberOfEpochs}</span>
                </div>
              </div>
              <input
                type="range"
                className="slider"
                min="1"
                max="100"
                value={numberOfEpochs}
                disabled={numberOfEpochsAuto}
                onChange={(e) => setNumberOfEpochs(e.target.value)}
              />
              <p className="text-sm text-gray-500">In most cases, range of 1-10 is recommended.</p>
            </div>
          </div>
        </div>
      </div>


      {/* Footer with Cancel and Submit buttons */}
      <div className="mt-4 mx-5 flex justify-center w-full space-x-3">
        <button
          type="button"
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
          onClick={() => navigate('/llms')}
        >
          Cancel
        </button>
        <button
          type="button"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
          onClick={handleSubmit}
        // disabled={!isFormValid()}
        >
          Submit
        </button>
      </div>

    </div>
  );
};

NewJobModal.propTypes = {
};

export default NewJobModal;
