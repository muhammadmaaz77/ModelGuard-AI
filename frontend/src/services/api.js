import axios from 'axios'

const BASE = 'http://localhost:8000'
const api = axios.create({ baseURL: BASE, timeout: 10000 })

export const getHealth = () => api.get('/health').then(r => r.data)
export const getMetrics = () => api.get('/metrics').then(r => r.data)
export const getLogs = () => api.get('/logs').then(r => r.data)
export const predict = (data) => api.post('/predict', data).then(r => r.data)
export const uploadModel = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
}).then(r => r.data)

export const getStatus = () => api.get('/status').then(r => r.data)
export const loadDemo  = () => api.post('/demo').then(r => r.data)
export const getDrift  = () => api.get('/drift-summary').then(r => r.data)