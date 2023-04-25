import { CommentType } from '../type/type';
import axiosConfig from './axiosConfig';

export const commentApi = {
    getAll: (params: any) => axiosConfig.get('/get-all-comment', { params }),
    create: (body: CommentType) => axiosConfig.post('/add-comment', body),
    update: (body: CommentType) => axiosConfig.put('/update-comment', body),
    delete: (params: any) => axiosConfig.delete('/delete-comment', { params }),
};
