import {
    Card,
    CardBody,
    CardFooter,
    Typography
} from "@material-tailwind/react";
import React ,{useState}from 'react';
import { FaCheckCircle, FaCreditCard, FaBitcoin } from 'react-icons/fa';
import { Grid, Box,Card as MUICard, CardContent, Button, Typography as MUITypography, IconButton,Paper , Link} from '@mui/material';
import { styled } from '@mui/material/styles';
import StripeForm from "./StripeForm";
import BittensorForm from "./BittensorForm";
const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'mediumseagreen',
    color: 'white',
    fontSize: '12px',
    fontFamily: 'Poppins',
    '&:hover': {
        backgroundColor: 'seagreen',
    },
}));

const SubscriptionComponent = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');

    const handlePaymentMethodClick = (method) => {
        setSelectedPaymentMethod(method);
    };

    const handleFormSubmit = (data) => {
        console.log("Form data submitted:", data);
        // Handle the form submission logic here
    };
    return (
        <Box className="flex flex-col bg-white dark:bg-slate-900 p-6 mt-16">
            <Typography variant="h4" color="blue-gray" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                Subscribe to YOGPT 
            </Typography>
            <MUICard className="mt-8 p-6">
                <CardContent>
                    <Typography variant="h5" color="blue-gray" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                        Payment Methods
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{padding:4}}>
                        <Box sx={{ marginBottom: '16px' ,mb:10, padding:4}}>
                                <Typography variant="h6" color="blue-gray" style={{ fontFamily: 'Poppins', marginBottom: '8px' }}>
                                    Pay with Stripe
                                </Typography>
                                <Typography variant="body2" color="textSecondary" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                                        YOGPT follows Stripe's conditions. Stripe is a global online payment processing platform that provides secure and easy-to-use payment options. 
                                        You can read more about Stripe's services and terms <Link href="https://stripe.com/" target="_blank" rel="noopener" style={{ fontFamily: 'Poppins', marginTop: '8px' }}>here</Link>.
                                    </Typography>
                                <StyledButton
                                    startIcon={<FaCreditCard />}
                                    onClick={() => handlePaymentMethodClick('stripe')}
                                >
                                    Pay with Stripe
                                </StyledButton>
                            </Box>
                            <hr></hr>

                            <Box sx={{ marginBottom: '16px' ,mb:10, padding:4}}>
                            <Typography variant="body2" color="textSecondary" style={{ fontFamily: 'Poppins', marginBottom: '16px' }}>
                                        TAO Bittensor is a decentralized, open-source protocol that provides secure and transparent payment options using blockchain technology. 
                                        Learn more about TAO Bittensor <Link href="https://bittensor.com/" target="_blank" rel="noopener" style={{ fontFamily: 'Poppins', marginTop: '8px' }}>here</Link>.
                                    </Typography>
                               
                                <StyledButton
                                    startIcon={<FaBitcoin />}
                                    onClick={() => handlePaymentMethodClick('bittensor')}
                                >
                                    Pay with Tao Bittensor
                                </StyledButton>
                            </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{padding:4}}>
                        {selectedPaymentMethod === 'stripe' && <StripeForm onSubmit={handleFormSubmit} />}
                        {selectedPaymentMethod === 'bittensor' && <BittensorForm onSubmit={handleFormSubmit} />}
                        </Paper>
                        </Grid>
                        
                    </Grid>
                    
                    
                </CardContent>
            </MUICard>
        </Box>
    );
};

export default SubscriptionComponent;
