import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import api from '../api/api';
import axios from 'axios';
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
import * as SecureStore from 'expo-secure-store';

export const getCitiesApi = async () => {
  const res = await axios.get(`${API_BASE_URL}driver/active-City`);
  return res.data;
};

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
   lat: lat,
  lng: lng,
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

export const startTripApi = async (bookingId) => {
  const token = await AsyncStorage.getItem('token');

  return axios.post(
    `${API_BASE_URL}driver/trips/start`,
    { bookingId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const completeTripApi = async (bookingId) => {
  const token = await AsyncStorage.getItem('token');

  return axios.post(
    `${API_BASE_URL}driver/trips/complete`,
    { bookingId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getDriverEarningsApi = async () => {
  const token = await AsyncStorage.getItem('token');

  return axios.get(
    `${API_BASE_URL}driver/Driver-earnings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getCompletedTrips = async (page = 1, limit = 10) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const res = await axios.get(
      `${API_BASE_URL}driver/trips/history`,
      {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;

  } catch (error) {
    // console.log('SERVICE ERROR 👉', error.response?.data || error.message);
    throw error;
  }
};

export const getDriverProfileApi = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}driver/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return res.json();
};

export const updateDriverProfileApi = async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');

    console.log('📡 UPDATE PROFILE PAYLOAD 👉', payload);

    const response = await fetch(
      `${API_BASE_URL}driver/profile/update`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    console.log('✅ UPDATE PROFILE RESPONSE 👉', data);

    return data;
  } catch (error) {
    console.log('❌ UPDATE PROFILE SERVICE ERROR 👉', error);
    throw error;
  }
};

export const logoutDriverApi = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}driver/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await AsyncStorage.clear(); // 🔑 clear session
  return res.json();
};

export const getCustomerProfileApi = async () => {
  const token = await AsyncStorage.getItem('customerToken');
  // ⚠️ must be CUSTOMER token, not driver token

  if (!token) {
    throw new Error('Customer token not found');
  }

  return axios.get(
    `${API_BASE_URL}customer/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getCustomerByIdForDriverApi = async (customerId) => {
  const token = await AsyncStorage.getItem('token'); // DRIVER token

  if (!customerId) throw new Error('Customer ID missing');

  return axios.get(
    `${API_BASE_URL}driver/customer/${customerId}`, // already exposed OR proxy route
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Request withdrawal
export const requestWithdrawalApi = async (amount) => {
  if (!amount || amount <= 0) {
    throw new Error('Invalid withdrawal amount');
  }

  const token = await AsyncStorage.getItem('token'); // DRIVER token

  return axios.post(
    `${API_BASE_URL}driver/Request-withdraw`,
    { amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Get withdrawal history
export const getWithdrawalHistoryApi = async () => {
  const token = await AsyncStorage.getItem('token'); // DRIVER token

  return axios.get(
    `${API_BASE_URL}driver/withdrawals-history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const addBankDetailsApi = async (payload) => {
  const token = await AsyncStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}driver/bank-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

};

export const getDriverDashboardApi = async () => {
  const token = await AsyncStorage.getItem('token');
  return axios.get(
    `${API_BASE_URL}driver/driver-dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// update docs of driver
export const updateDriverDocumentsApi = async (formData) => {
  const token = await AsyncStorage.getItem('token'); // ✅ FIX HERE
  console.log('🪪 TOKEN 👉', token);

  const res = await fetch(
    `${API_BASE_URL}driver/profile/documents`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return res.json();
};

// delete account
export const deleteDriverAccountApi = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}driver/delete-account`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete account');
  }

  return data;
};

export const getDriverBankDetailsApi = async () => {
  const token = await SecureStore.getItemAsync('token');

  const res = await api.get(`/driver/bank-details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// digilocker

export const initDigiLockerApi = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}driver/digilocker/init`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return res.json();
};

