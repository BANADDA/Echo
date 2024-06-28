import {
    Card,
    CardBody,
    CardFooter,
    Typography
} from "@material-tailwind/react";
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Grid, Card as MUICard, CardContent, Button, Typography as MUITypography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '50px',
    backgroundColor: 'mediumseagreen',
    color: 'white',
    fontSize: '12px',
    fontFamily: 'Poppins',
    marginTop: 'auto', // Ensure the button stays at the bottom of the card
    '&:hover': {
        backgroundColor: 'seagreen',
    },
}));

const StyledCardContent = styled(CardContent)({
    fontSize: '12px',
    fontFamily: 'Poppins',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Align content to the start
    height: '100%',
    padding: '16px',
});

const plans = [
    {
        title: 'Free',
        buttonText: 'Your Current Plan',
        description: 'Access to basic features and limited resources:',
        features: [
            'Access custom LLaMA2 and OpenELM270 models',
            'Ability to download and share your chats',
        ],
    },
    {
        title: 'Training/Finetuning',
        buttonText: 'SUBSCRIBE ($25 - $80)',
        description: 'Enhance and personalize models with additional training data and Huggingface Datasets:',
        features: [
            'Train and fine-tune LLaMA2, LLaMA3, OpenELM 270M, 450M, 3B models',
            'Minimum cost: $25',
            'Maximum cost: $80 (depending on the model class)',
        ],
    },
    {
        title: 'Model Inferencing',
        buttonText: 'SUBSCRIBE ($20 - $56/month)',
        description: 'High performance inference for production use:',
        features: [
            'Inference LLaMA2, LLaMA3, OpenELM 270M, 450M, 3B models',
            'Minimum cost: $20/month',
            'Maximum cost: $56/month (depending on the model class)',
        ],
    },
];

const BillingSection = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/payment');
    };

    return (
        <div className="flex flex-col lg:ml-64 bg-white dark:bg-slate-900 p-6 mt-16">
            <Card className="m-5 mt-16 mb-8">
                <CardBody>
                    <Typography variant="h4" color="blue-gray" style={{ fontFamily: 'Poppins', marginBottom: '20px' }}>
                        Subscribe, Train, and Inference Model
                    </Typography>
                    <Grid container spacing={3} className="mt-4">
                        {plans.map((plan, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <MUICard style={{ height: '100%' }}>
                                    <StyledCardContent>
                                        <MUITypography variant="h5" component="div" style={{ fontFamily: 'Poppins', marginBottom: '8px' }}>
                                            {plan.title}
                                        </MUITypography>
                                        <MUITypography variant="body2" color="text.secondary" style={{ fontFamily: 'Poppins', fontSize: '12px', marginBottom: '16px' }}>
                                            {plan.description}
                                            <ul className="list-none ml-4 mt-2" style={{ padding: '0' }}>
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} style={{ padding: '8px 0' }}>
                                                        <FaCheckCircle className="inline mr-2" /> {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </MUITypography>
                                        <StyledButton onClick={handleButtonClick}>{plan.buttonText}</StyledButton>
                                    </StyledCardContent>
                                </MUICard>
                            </Grid>
                        ))}
                    </Grid>
                </CardBody>
                <CardFooter className="flex items-center gap-4 pt-0">
                    <Typography variant="body2" color="text.secondary" style={{ fontFamily: 'Poppins', fontSize: '12px' }}>
                        Select the plan that best fits your needs and upgrade to unlock additional features.
                    </Typography>
                </CardFooter>
            </Card>
        </div>
    );
};

export default BillingSection;
