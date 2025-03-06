import axios from 'axios';
import { Movie, UserPreference } from '../types/movie';

const API_BASE_URL = 'http://localhost:5000/api';
const API_KEY = 'WRS8BCT5F9CUAITM'; // Updated API Key

export const api = {
  async getPopularMovies(): Promise<Movie[]> {
    try {
      const response = await axios.get<Movie[]>(`${API_BASE_URL}/movies`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      console.log("Fetched movies:", response.data); // Debugging step
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      throw error;
    }
  },

  async savePreference(userId: string, movieId: number, rating: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/preferences`, 
        { userId, movieId, rating }, 
        { headers: { 'Authorization': `Bearer ${API_KEY}` } }
      );
    } catch (error) {
      console.error('Error saving preference:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      throw error;
    }
  },

  async getUserPreferences(userId: string): Promise<UserPreference[]> {
    try {
      const response = await axios.get<UserPreference[]>(`${API_BASE_URL}/preferences/${userId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      throw error;
    }
  }
};