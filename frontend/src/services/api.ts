// src/services/api.ts
import axios from 'axios';
import type { Task, TaskCreate } from '../types';

const API_URL = 'http://localhost:8000/tasks/';

export const getTasks = async (completed?: boolean, search?: string): Promise<Task[]> => {
  const params = new URLSearchParams();
  if (completed !== undefined) params.append('completed', completed.toString());
  if (search) params.append('search', search);
  
  const response = await axios.get<Task[]>(`${API_URL}?${params.toString()}`);
  return response.data;
};

export const createTask = async (task: TaskCreate): Promise<Task> => {
  const response = await axios.post<Task>(API_URL, task);
  return response.data;
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const response = await axios.put<Task>(`${API_URL}${id}`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}${id}`);
};