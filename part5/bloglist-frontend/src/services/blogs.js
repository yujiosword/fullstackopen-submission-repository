import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const get = blog => {
  const request = axios.get(`${baseUrl}/${blog.id}`)
  return request.then(response => response.data)
}

const create = async newblog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newblog, config)
  return response.data
}

const update = async blog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config)
  return response.data
}

export default { getAll, get, create, update, setToken }