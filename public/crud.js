// crud.js – Centralized API calls for all admin CRUD operations
import { showConfirmModal, showToast } from './admin-helpers.js'; // or use global functions

const API_BASE = '/api';

// Generic fetch with auth (assumes token in localStorage)
async function authFetch(url, options = {}) {
  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ========== GENERIC CRUD ==========
export async function addItem(type, defaultData) {
  let url = '';
  switch (type) {
    case 'trainer': url = `${API_BASE}/trainers`; break;
    case 'member': url = `${API_BASE}/members`; break;
    case 'product': url = `${API_BASE}/products`; break;
    case 'transformation': url = `${API_BASE}/transformations`; break;
    case 'dietPlan': url = `${API_BASE}/dietplans`; break;
    case 'workoutPlan': url = `${API_BASE}/workoutplans`; break;
    case 'membership': url = `${API_BASE}/memberships`; break;
    case 'reel': url = `${API_BASE}/reels`; break;
    case 'review': url = `${API_BASE}/reviews`; break;
    default: throw new Error(`Unknown type: ${type}`);
  }
  const data = await authFetch(url, { method: 'POST', body: JSON.stringify(defaultData) });
  console.log(`New ${type} added`, data);
  return data;
}

export async function updateItem(type, id, data) {
  let url = '';
  switch (type) {
    case 'trainer': url = `${API_BASE}/trainers/${id}`; break;
    case 'member': url = `${API_BASE}/members/${id}`; break;
    case 'product': url = `${API_BASE}/products/${id}`; break;
    case 'transformation': url = `${API_BASE}/transformations/${id}`; break;
    case 'dietPlan': url = `${API_BASE}/dietplans/${id}`; break;
    case 'workoutPlan': url = `${API_BASE}/workoutplans/${id}`; break;
    case 'membership': url = `${API_BASE}/memberships/${id}`; break;
    case 'reel': url = `${API_BASE}/reels/${id}`; break;
    case 'review': url = `${API_BASE}/reviews/${id}`; break;
    default: throw new Error(`Unknown type: ${type}`);
  }
  const result = await authFetch(url, { method: 'PUT', body: JSON.stringify(data) });
  console.log(`${type} updated`, result);
  return result;
}

export async function deleteItem(type, id) {
  let url = '';
  switch (type) {
    case 'trainer': url = `${API_BASE}/trainers/${id}`; break;
    case 'member': url = `${API_BASE}/members/${id}`; break;
    case 'product': url = `${API_BASE}/products/${id}`; break;
    case 'transformation': url = `${API_BASE}/transformations/${id}`; break;
    case 'dietPlan': url = `${API_BASE}/dietplans/${id}`; break;
    case 'workoutPlan': url = `${API_BASE}/workoutplans/${id}`; break;
    case 'membership': url = `${API_BASE}/memberships/${id}`; break;
    case 'reel': url = `${API_BASE}/reels/${id}`; break;
    case 'review': url = `${API_BASE}/reviews/${id}`; break;
    default: throw new Error(`Unknown type: ${type}`);
  }
  await authFetch(url, { method: 'DELETE' });
  console.log(`${type} deleted`);
  return true;
}

// ========== SPECIAL ENDPOINTS ==========
export async function addGalleryImage(imageUrl) {
  const gallery = await authFetch(`${API_BASE}/gallery`);
  const newImages = [...(gallery.images || []), imageUrl];
  return authFetch(`${API_BASE}/gallery`, { method: 'PUT', body: JSON.stringify({ images: newImages }) });
}

export async function deleteGalleryImage(index) {
  const gallery = await authFetch(`${API_BASE}/gallery`);
  const newImages = (gallery.images || []).filter((_, i) => i !== index);
  return authFetch(`${API_BASE}/gallery`, { method: 'PUT', body: JSON.stringify({ images: newImages }) });
}

// Similar for reels, reviews, members if you need batch updates