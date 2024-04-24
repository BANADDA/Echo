import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyD1w5Q5sN1rrwOq8lHPtmVg_pqalwYrLEE",
    authDomain: "echo-fe663.firebaseapp.com",
    projectId: "echo-fe663",
    storageBucket: "echo-fe663.appspot.com",
    messagingSenderId: "242213821849",
    appId: "1:242213821849:web:9061001fa288c50249c708",
    measurementId: "G-22D29K0Y6C"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app, provider);
const db = getFirestore(app);
const storage = getStorage(app);  // Initialize storage

// Function to fetch all training jobs for the currently logged-in user
async function fetchTrainingJobsForUser() {
    const user = auth.currentUser;
    if (user) {
        try {
            const querySnapshot = await getDocs(query(collection(db, 'training_jobs'), where('userId', '==', user.uid)));
            const trainingJobs = querySnapshot.docs.map(doc => ({
                docId: doc.id, // Include the document ID here
                ...doc.data()
            }));
            return trainingJobs;
        } catch (error) {
            console.error("Error fetching training jobs:", error);
            return [];
        }
    } else {
        console.log("No user is currently signed in.");
        return [];
    }
}

// Function to add a new training job metadata
async function addTrainingJobMetadata(docId, modelId, datasetId, imageTag, computeRequirements) {
    try {
        const docRef = await addDoc(collection(db, 'trainingJobs'), {
            modelId: modelId,
            datasetId: datasetId,
            imageTag: imageTag,
            computeRequirements: computeRequirements,
            trainingStatus: 'Pending', // Initial status
            createdAt: new Date() // Client-side timestamp
        });
        console.log("Metadata document written with ID: ", docRef.id);
        return docRef.id; // return the document ID
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Failed to add training job metadata.");
    }
}


// Function to add a new training job
async function addTrainingJob(modelName, modelId, datasetId, gpu, licenseSelected, domain, jobStatus) {
    const user = auth.currentUser;

    console.log('User', user.uid);

    if (user) {
        try {
            // Add a new document with a generated ID to the 'training_jobs' collection
            const docRef = await addDoc(collection(db, 'training_jobs'), {
                userId: user.uid, // Use the UID of the signed-in user
                modelName: modelName,
                modelId: modelId,
                datasetId: datasetId,
                gpu: gpu,
                licenseSelected: licenseSelected,
                domain: domain,
                jobStatus: jobStatus
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    } else {
        console.log("No user is currently signed in.");
    }
}


// Inside firebase-config.js or a relevant module
async function updateTrainingJobStatus(docId, status) {
    try {
        const docRef = doc(db, 'training_jobs', docId); // Use the docId directly
        await updateDoc(docRef, { jobStatus: status });
        console.log('Job status updated to', status);
    } catch (error) {
        console.error('Error updating job status:', error);
    }
}

// Function to handle the submission of a new fine-tuning job
async function submitFineTuningJob(jobData, uploadedTrainingFile, uploadedValidationFile) {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user is currently signed in.");
        return;
    }

    try {
        // Adding the job data to Firestore
        const docRef = await addDoc(collection(db, 'fine_tuning_jobs'), {
            ...jobData,
            userId: user.uid,  // Linking the job to the current user
            createdAt: new Date(),  // Timestamp for when the job is created
            status: "pending" // Default status
        });

        console.log("Fine-tuning job submitted with ID:", docRef.id);

        // If there's an uploaded training file, handle the file upload
        if (uploadedTrainingFile) {
            const trainingStorageRef = ref(storage, `uploads/${user.uid}/${uploadedTrainingFile.name}`);
            await uploadBytes(trainingStorageRef, uploadedTrainingFile);
            console.log("Uploaded training file:", uploadedTrainingFile.name);
            // Save the training file path after successful upload
            await updateDoc(docRef, { trainingFilePath: trainingStorageRef.fullPath });
        }

        // If there's an uploaded validation file, handle the file upload
        if (uploadedValidationFile) {
            const validationStorageRef = ref(storage, `uploads/${user.uid}/${uploadedValidationFile.name}`);
            await uploadBytes(validationStorageRef, uploadedValidationFile);
            console.log("Uploaded validation file:", uploadedValidationFile.name);
            // Save the validation file path after successful upload
            await updateDoc(docRef, { validationFilePath: validationStorageRef.fullPath });
        }
    } catch (error) {
        console.error("Error submitting fine-tuning job:", error);
    }
}

async function userJobs() {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user is currently signed in.");
        return [];
    }

    try {
        // Query Firestore collection for fine-tuning jobs belonging to the current user
        const querySnapshot = await getDocs(query(collection(db, 'fine_tuning_jobs'), where('userId', '==', user.uid)));

        const jobsData = [];
        querySnapshot.forEach((doc) => {
            // Get data of each job
            const job = doc.data();
            // Include document ID for reference if needed
            job.id = doc.id;
            jobsData.push(job);
        });

        return jobsData;
    } catch (error) {
        console.error("Error fetching fine-tuning jobs:", error);
        return [];
    }
}


// Get a reference to the auth service
export { addTrainingJob, addTrainingJobMetadata, auth, fetchTrainingJobsForUser, submitFineTuningJob, updateTrainingJobStatus, userJobs };

