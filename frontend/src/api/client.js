
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:5001/api'
})

export async function getProducts() {
  const { data } = await api.get('/products')
  return data
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`)
  return data
}

export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload)
  return data
}

export async function sendContact(payload) {
  const { data } = await api.post('/contact', payload);
  return data;
}

