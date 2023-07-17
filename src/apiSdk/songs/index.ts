import axios from 'axios';
import queryString from 'query-string';
import { SongInterface, SongGetQueryInterface } from 'interfaces/song';
import { GetQueryInterface } from '../../interfaces';

export const getSongs = async (query?: SongGetQueryInterface) => {
  const response = await axios.get(`/api/songs${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSong = async (song: SongInterface) => {
  const response = await axios.post('/api/songs', song);
  return response.data;
};

export const updateSongById = async (id: string, song: SongInterface) => {
  const response = await axios.put(`/api/songs/${id}`, song);
  return response.data;
};

export const getSongById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/songs/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSongById = async (id: string) => {
  const response = await axios.delete(`/api/songs/${id}`);
  return response.data;
};
