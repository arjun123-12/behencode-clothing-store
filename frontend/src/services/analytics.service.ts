import API from '@/lib/api';
export const serviceInstance = {
  get: async () => {
    const res = await API.get('/analytics');
    return res.data;
  }
};
export default serviceInstance;
