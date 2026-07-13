import axios from 'axios';

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const envUrl = import.meta.env.VITE_API_URL;
const API_URL = isDev
  ? (envUrl || 'http://localhost:5000')
  : (envUrl && !envUrl.includes('localhost') ? envUrl : 'https://monthrob.onrender.com');
const API = axios.create({ baseURL: `${API_URL}/api` });

API.interceptors.request.use((req) => {
  try {
    const adminInfo = localStorage.getItem('monthrob_admin_auth');
    if (adminInfo && adminInfo !== 'null') {
      const parsed = JSON.parse(adminInfo);
      if (parsed && parsed.token) {
        req.headers.Authorization = `Bearer ${parsed.token}`;
        return req;
      }
    }
    const userInfo = localStorage.getItem('monthrob_auth');
    if (userInfo && userInfo !== 'null') {
      const parsed = JSON.parse(userInfo);
      if (parsed && parsed.token) {
        req.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch (e) {}
  return req;
});

export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);
export const googleLoginUser = (credential) => API.post('/users/google-login', { credential });

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return API.post('/upload', formData);
};

export const fetchProducts = () => API.get('/products');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const fetchCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const fetchOrders = () => API.get('/orders');
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const createOrder = (data) => API.post('/orders', data);
export const fetchMyOrders = (userId) => API.get(`/orders/myorders/${userId}`);
export const fetchCollectiveJar = () => API.get('/orders/collective-jar');
export const deleteAllOrders = () => API.delete('/orders');
export const resetAllRevenue = () => API.put('/orders/reset-revenue');
export const resetFund = () => API.put('/orders/reset-fund');

export const fetchCoupons = () => API.get('/coupons');
export const createCoupon = (data) => API.post('/coupons', data);
export const applyCoupon = (code, userId, orderAmount) => API.post('/coupons/apply', { code, userId, orderAmount });
export const useCoupon = (couponId, userId) => API.post('/coupons/use', { couponId, userId });

export const fetchUsers = () => API.get('/users');
export const blockUser = (id) => API.put(`/users/${id}/block`);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export const fetchShowcase = () => API.get('/showcase');
export const updateShowcase = (data) => API.post('/showcase', data);

export const fetchCollections = () => API.get('/collections');
export const addCollection = (data) => API.post('/collections', data);
export const updateCollection = (id, data) => API.put(`/collections/${id}`, data);
export const deleteCollection = (id) => API.delete(`/collections/${id}`);
export const createPaymentOrder = (amount) => API.post('/payment/create-order', { amount });
export const verifyPayment = (data) => API.post('/payment/verify', data);

export const adminGoogleLogin = (credential) => API.post('/admin/google-login', { credential });
export const fetchAdmins = () => API.get('/admin');
export const addAdmin = (email, name) => API.post('/admin', { email, name });
export const removeAdmin = (id) => API.delete(`/admin/${id}`);

export const fetchAdminLogs = () => API.get('/admin/logs');
export const clearAdminLogs = () => API.delete('/admin/logs');

export default API;
