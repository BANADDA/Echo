import { Delete as DeleteIcon, FilterList as FilterListIcon, Search as SearchIcon } from '@mui/icons-material';
import { Alert, Box, Card, CardContent, CardMedia, Grid, IconButton, InputAdornment, MenuItem, Snackbar, TextField, Typography } from '@mui/material';
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
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        marginTop:10,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          fontFamily: 'Poppins',
          fontSize: '12px',
          width: { xs: '100%', sm: '80%', md: '75%', lg: '70%' },
          padding: { xs: 2, sm: 3, md: 4 },
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h4" gutterBottom>Deployed Models</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
          <TextField
            variant="outlined"
            placeholder="Search models..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            variant="outlined"
            value={dateFilter}
            onChange={handleDateFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
            <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
          </TextField>
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredModels.map((model) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={model.id}>
                <Card
                  onClick={() => handleCardClick(model)}
                  sx={{ 
                    backgroundColor: '#0e3517', 
                    color: '#fff',
                    transform: 'scale(1)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    cursor: 'pointer',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={model.imageUrl || 'https://www.geeky-gadgets.com/wp-content/uploads/2023/11/How-to-build-knowledge-graphs-with-large-language-models-LLMs.webp'}
                    alt={model.modelName}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{model.modelName}</Typography>
                    <Typography variant="body2" color="white">Updated {formatTimestamp(model.deployedAt)}</Typography>
                    <Typography variant="body2" gutterBottom>{model.description || ''}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{model.tags || 'No tags'}</Typography>
                      <Typography variant="body2" component="a" href={model.serverUrl} target="_blank" rel="noopener noreferrer">View</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l5-5H5l5 5z"/></svg>
                        <Typography variant="body2">{model.upvotes || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={userPhotoURL} alt="User" style={{ width: '16px', height: '16px', borderRadius: '50%', marginRight: '4px' }} />
                        <Typography variant="body2">{userName}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); handleDeleteModel(model.id); }}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
      </Box>
    </Box>
  );
};

export default ModelsComponent;
