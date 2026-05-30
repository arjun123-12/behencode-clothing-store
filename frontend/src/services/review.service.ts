import API from '@/lib/api';
export const serviceInstance = {
  get: async () => {
    const res = await API.get('/review');
    return res.data;
  }
};
export default serviceInstance;
