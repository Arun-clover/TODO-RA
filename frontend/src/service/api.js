import axios from 'axios';
import {API_URL} from '../config';

const api=axios.create({
    baseURL: API_URL,
    headers:{
        "Content-Type": "application/json"
    }
})

export const fetchTodos = async () => {
    return await api.get('/todo');
};
export const deleteTodo=async(id)=>{
    return await api.delete(`/todo/${id}`);
}
export const createTodo = async (todo) => {
    return await api.post('/todo', todo);
};
export const updateTodo=async(id,todo)=>{
    return await api.patch(`/todo/${id}`,todo);
}
export default api;