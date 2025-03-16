import axios from 'axios';
import { auth } from '@/config/firebase';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.LOCAL_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// automatically attach Firebase Auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await getFirebaseToken(); // Get the user's auth token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getFirebaseToken() {
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
}
