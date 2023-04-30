import { MessageType } from '../type/type';
import axiosConfig from './axiosConfig';

export const messageApi = {
    getAll: (params: any) => axiosConfig.get('/get-all-message', { params }),
    add: (body: MessageType) => axiosConfig.post('/add-message', body),
    delete: (params: any) => axiosConfig.delete('/delete-message', { params }),
};
