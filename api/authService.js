import { API_BASE_URL } from '../api/api'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginApi = async (mobile, password) => {
  const response = await fetch(`${API_BASE_URL}auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobile, password }),
  });

  return response.json();
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
