import axios from 'axios';
import queryString from 'query-string';
import { AdministrationInterface, AdministrationGetQueryInterface } from 'interfaces/administration';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getAdministrations = async (
  query?: AdministrationGetQueryInterface,
): Promise<PaginatedInterface<AdministrationInterface>> => {
  const response = await axios.get('/api/administrations', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createAdministration = async (administration: AdministrationInterface) => {
  const response = await axios.post('/api/administrations', administration);
  return response.data;
};

export const updateAdministrationById = async (id: string, administration: AdministrationInterface) => {
  const response = await axios.put(`/api/administrations/${id}`, administration);
  return response.data;
};

export const getAdministrationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/administrations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAdministrationById = async (id: string) => {
  const response = await axios.delete(`/api/administrations/${id}`);
  return response.data;
};
