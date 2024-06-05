import { Delete as DeleteIcon, FilterList as FilterListIcon, Search as SearchIcon } from '@mui/icons-material';
import { Alert, IconButton, InputAdornment, MenuItem, Snackbar, TextField } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { auth } from '../../../auth/config/firebase-config';

const ModelsComponent = ({ setActiveScreen, setSelectedModel }) => {
    const [models, setModels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [userPhotoURL, setUserPhotoURL] = useState('default_user_image.png');
    const [userName, setUserName] = useState('Unknown User');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('All');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUserPhotoURL(user.photoURL || 'default_user_image.png');
                setUserName(user.displayName || 'No Name');
            } else {
                setIsAuthenticated(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const fetchDeployedModels = async () => {
        const db = getFirestore();
        try {
            const querySnapshot = await getDocs(collection(db, 'deployed_models'));
            const models = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setModels(models);
            setSnackbarMessage('Models fetched successfully.');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error('Failed to fetch deployed models:', error);
            setSnackbarMessage('Failed to fetch deployed models.');
            setSnackbarSeverity('error');
        } finally {
            setIsLoading(false);
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchDeployedModels();
    }, []);

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const handleDeleteModel = async (modelId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const db = getFirestore();
                await deleteDoc(doc(db, 'deployed_models', modelId));
                setModels(models.filter(model => model.id !== modelId));
                Swal.fire('Deleted!', 'Your model has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting model:', error);
                Swal.fire('Error!', 'There was an error deleting your model.', 'error');
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDateFilterChange = (event) => {
        setDateFilter(event.target.value);
    };

    const handleCardClick = (model) => {
        setSelectedModel(model);
        setActiveScreen('Inference');
    };

    const filteredModels = models.filter(model => {
        const matchesSearchTerm = model.modelName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDateFilter = dateFilter === 'All' || formatTimestamp(model.deployedAt).includes(dateFilter);
        return matchesSearchTerm && matchesDateFilter;
    });

    return (
        <div className="flex flex-col ml-64 bg-white dark:bg-slate-900 p-6 mt-16">
            <h1 className="text-xl font-bold mb-4">Deployed Models</h1>
            <div className="flex mb-4">
                <TextField
                    variant="outlined"
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    className="flex-grow mr-2"
                />
                <TextField
                    select
                    variant="outlined"
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                    className="flex-shrink-0"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FilterListIcon />
                            </InputAdornment>
                        ),
                    }}
                >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Today">Today</MenuItem>
                    <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                    <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                </TextField>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {filteredModels.map((model) => (
                        <div key={model.id} 
                            className="bg-green-900 text-white rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 w-52 h-56 cursor-pointer" 
                            onClick={() => handleCardClick(model)}
                        >
                            <div className="bg-gray-700 h-20 flex justify-center items-center">
                                <img src={model.imageUrl || 'https://www.geeky-gadgets.com/wp-content/uploads/2023/11/How-to-build-knowledge-graphs-with-large-language-models-LLMs.webp'} alt={model.modelName} className="h-full w-full object-cover" />
                            </div>
                            <div className="p-2">
                                <h3 className="text-sm font-semibold mb-1">{model.modelName}</h3>
                                <p className="text-gray-400 text-xs mb-1">Updated {formatTimestamp(model.deployedAt)}</p>
                                <p className="mb-4 text-xs">{model.description || ''}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-400">{model.tags || 'No tags'}</div>
                                    <a href={model.serverUrl} target="_blank" rel="noopener noreferrer" className="text-blue-100 text-xs">View</a>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <div className="flex items-center text-xs">
                                        <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l5-5H5l5 5z"/></svg>
                                        <span>{model.upvotes || 0}</span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <img src={userPhotoURL} alt="User" className="w-4 h-4 rounded-full" />
                                        <span className="ml-1">{userName}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteModel(model.id); }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ModelsComponent;
