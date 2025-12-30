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


export const uploadDriverDocumentsApi = async ({
  aadhaar,
  panCard,
  licenseFront,
  licenseBack,
}) => {
  const token = await AsyncStorage.getItem('driverToken');

  const formData = new FormData();

  if (aadhaar) {
    formData.append('aadhaar', {
      uri: aadhaar.uri,
      name: 'aadhaar.jpg',
      type: 'image/jpeg',
    });
  }

  if (panCard) {
    formData.append('panCard', {
      uri: panCard.uri,
      name: 'pan.jpg',
      type: 'image/jpeg',
    });
  }

  if (licenseFront) {
    formData.append('licenseFront', {
      uri: licenseFront.uri,
      name: 'license_front.jpg',
      type: 'image/jpeg',
    });
  }

  if (licenseBack) {
    formData.append('licenseBack', {
      uri: licenseBack.uri,
      name: 'license_back.jpg',
      type: 'image/jpeg',
    });
  }

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
