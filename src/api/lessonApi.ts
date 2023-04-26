import { LessonType } from '../type/type';
import axiosConfig from './axiosConfig';

export const lessonApi = {
    getAll: (params: any) => axiosConfig.get('/get-all-lesson', { params }),
    getDetail: (params: any) =>
        axiosConfig.get('/get-detail-lesson', { params }),
    add: (body: LessonType) => axiosConfig.post('/add-lesson', body),
    edit: (body: LessonType) => axiosConfig.put('/edit-lesson', body),
    delete: (params: any) => axiosConfig.delete('/delete-lesson', { params }),
};
