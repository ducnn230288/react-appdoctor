import axios from 'axios';

export async function login_User(payload) {
  const { data } = await axios.post('/user/login', payload);
  return data;
}