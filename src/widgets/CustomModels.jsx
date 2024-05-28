import React from 'react';
import { Grid} from '@mui/material';
import CustomModalCard from './CustomModalCard';
import { useNavigate } from 'react-router-dom';

const CustomModels = ({ models }) => {
    const navigate  = useNavigate()
  const handleStartChat = () => {
    // navigate(`/chat/${url}`);
    navigate(`/chat`);
  };

  const handleVisibilityClick = (id) => {
    console.log(`Visibility icon clicked for Audio ID: ${id}`);
    navigate(`/dashboard/video/${id}`);
  };
  return (
    <Box>
        <banner></banner>
    <Box> 
    <Grid container spacing={3} justifyContent="center" py={3}>
      {models.map((model, index) => (
        <Grid item key={index}>
          <CustomModalCard
            modelName={model.modelName}
            modelIcon={model.modelIcon}
            description={model.description}
            onStartChat={() => handleStartChat()}
            
          />
        </Grid>
      ))}
    </Grid>
    </Box> 
    </Box>
  );
};

export default CustomModels;
