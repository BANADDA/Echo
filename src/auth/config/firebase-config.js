import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore'; // Import query and where


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

// Function to fetch all training jobs for the currently logged-in user
async function fetchTrainingJobsForUser() {
  const user = auth.currentUser;

  if (user) {
      try {
          // Query the 'training_jobs' collection for documents where 'userId' matches the user's ID
          const querySnapshot = await getDocs(query(collection(db, 'training_jobs'), where('userId', '==', user.uid)));

          // Initialize an array to store the fetched training jobs
          const trainingJobs = [];

          // Loop through the query snapshot and push each document to the 'trainingJobs' array
          querySnapshot.forEach((doc) => {
              trainingJobs.push({
                  id: doc.id,
                  ...doc.data()
              });
          });

          // Return the array of training jobs
          return trainingJobs;
      } catch (error) {
          console.error("Error fetching training jobs:", error);
          return []; // Return an empty array in case of an error
      }
  } else {
      console.log("No user is currently signed in.");
      return []; // Return an empty array if no user is signed in
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


// Get a reference to the auth service
export { addTrainingJob, auth, fetchTrainingJobsForUser };

