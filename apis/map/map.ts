"use server"
// actions/map/map.ts
import { NextApiRequest, NextApiResponse } from 'next';

// Function to fetch golf-related places
export const fetchGolfPlaces = async (latitude: number, longitude: number) => {
  console.log(latitude)
  console.log(longitude)
  const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/golf.json?proximity=${longitude},${latitude}&types=poi&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN_PUBLIC_KEY}`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch golf places');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching golf places:', error);
    return null;
  }
};

// API route handler for server-side use
export const handlerForFetchGolfPlaces = async (req: NextApiRequest, res: NextApiResponse) => {
  const { latitude, longitude } = req.query;

  if (typeof latitude !== 'string' || typeof longitude !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const data = await fetchGolfPlaces(parseFloat(latitude), parseFloat(longitude));
  return res.status(200).json(data);
};

// IPアドレス取得
export const getUserIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error('Failed to fetch IP address');
    }
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null;
  }
};

export const fetchUserIpLocation = async(ip:string) => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    if (data.latitude && data.longitude) {
      return { latitude: data.latitude, longitude: data.longitude };
    }
    return { latitude: 35.6809591, longitude: 139.7673068 }; // Default: Tokyo Station
  } catch (error) {
    console.error('Error fetching location data:', error);
    return { latitude: 35.6809591, longitude: 139.7673068 }; // Default: Tokyo Station
  }
}