// import { API_BASE_URL } from '../api/api'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import api from '../api/api';

const GOOGLE_API_KEY = 'AIzaSyCe-FeBbj44cBU0lnDPbcL-w0fTKRp_HVo';
const API_BASE_URL = 'http://192.168.31.89:3000/'

export const loginApi = async (mobile, password) => {
  try {
    // console.log('📡 LOGIN REQUEST 👉', mobile);

    const res = await api.post('/auth/login', {
      mobile,
      password,
    });

    // console.log('✅ LOGIN RESPONSE 👉', res.data);

    // 🔑 SAVE TOKEN (CRITICAL)
    await AsyncStorage.setItem('token', res.data.token);

    // console.log(
    //   '💾 TOKEN STORED 👉',
    //   await AsyncStorage.getItem('token')
    // );

    return res.data;
  } catch (e) {
    // console.log('❌ LOGIN ERROR 👉', e.response?.data || e.message);
    throw e;
  }
};

export const ownerRegisterApi = async (payload) => {
  const response = await fetch(
    `${API_BASE_URL}owner/register`, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return response.json();
};

export const registerDriverApi = async (payload) => {
  const ownerId = await AsyncStorage.getItem('ownerId');

  const response = await fetch(`${API_BASE_URL}driver/register/personal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      ownerId,
    }),
  });

  return response.json();
};

export const addVehicleApi = async (payload) => {
  const token = await AsyncStorage.getItem('driverToken');

  const response = await fetch(`${API_BASE_URL}driver/register/vehicle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const uploadDriverDocumentsApi = async (formData) => {
  const token = await AsyncStorage.getItem('driverToken');

  const response = await fetch(
    `${API_BASE_URL}driver/register/documents`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return response.json();
};

export const verifyOtpApi = async (payload) => {
  const response = await fetch(`${API_BASE_URL}auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const updateDriverLocation = async () => {
  // console.log('📍 Updating driver location...');

  const { status } = await Location.requestForegroundPermissionsAsync();
  // console.log('📍 Location permission 👉', status);

  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const lat = location.coords.latitude;
  const lng = location.coords.longitude;

  // console.log('📍 GPS COORDS 👉', lat, lng);

  const res = await api.post('/driver/location', {
    lat,
    lng,
  });

  console.log('📍 LOCATION SAVED 👉', res.data);

  return { lat, lng };
};

export const getAddressFromLatLng = async (lat, lng) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    // console.log('🌍 GOOGLE GEO RESPONSE 👉', lat, lng, data.status);

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    return 'Location not available';
  } catch (err) {
    // console.log('❌ GEO ERROR 👉', err.message);
    return 'Location not available';
  }
};

