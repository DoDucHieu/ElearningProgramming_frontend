import { ConversationType } from '../type/type';
import axiosConfig from './axiosConfig';

export const conversationApi = {
    getAll: (params: any) =>
        axiosConfig.get('/get-all-conversation', { params }),
    getDetail: (params: any) =>
        axiosConfig.get('/get-detail-conversation', { params }),
    add: (body: any) => axiosConfig.post('/add-conversation', body),
    edit: (body: any) => axiosConfig.put('/edit-conversation', body),
    delete: (params: any) =>
        axiosConfig.delete('/delete-conversation', { params }),
};
