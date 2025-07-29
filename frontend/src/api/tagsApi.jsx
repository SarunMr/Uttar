import axios from "axios";

const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
// Get token from localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all tags (for users - will exclude admin tag in backend)
export const fetchUserTags = () => {
  return axios.get(`${API_BASE}/tags/user`, getAuthConfig());
};

export const fetchTags = () => {
  return axios.get(`${API_BASE}/tags`, axiosConfig);
};

export const createTag = (tag) => {
  return axios.post(`${API_BASE}/tags`, tag, axiosConfig);
};

export const updateTag = (id, tag) => {
  return axios.put(`${API_BASE}/tags/${id}`, tag, axiosConfig);
};

export const deleteTag = (id) => {
  return axios.delete(`${API_BASE}/tags/${id}`, axiosConfig);
};
