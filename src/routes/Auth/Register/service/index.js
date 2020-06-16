import axios from 'axios';

export async function register_User(payload) {
  const { data } = await axios.post('/user/register', payload);
  return data;
}