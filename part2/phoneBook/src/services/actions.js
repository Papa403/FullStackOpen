import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    const nonExisting = {
    id: 10000,
    name: 'This name is not saved to server',
    number: '42069',
  }
    return request.then(response => response.data.concat(nonExisting))
}

const create = newObject => {
    const request = axios.post(baseUrl,newObject)
    return request.then(response=>response.data)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, updatedData) => {
    const request = axios.put(`${baseUrl}/${id}`,updatedData)
    return request.then(response=>response.data)
}
export default {getAll, create, deletePerson, update}