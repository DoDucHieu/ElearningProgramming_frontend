import { MyCourseType } from '../type/type';
import axiosConfig from './axiosConfig';

export const myCourseApi = {
    getAll: (params: any) => axiosConfig.get('/get-all-my-course', { params }),
    getDetail: (params: any) =>
        axiosConfig.get('/get-detail-my-course', { params }),
    registryCourse: (body: MyCourseType) =>
        axiosConfig.post('/registry-course', body),
    delete: (params: any) =>
        axiosConfig.delete('/delete-my-course', { params }),
    deleteAll: (params: any) =>
        axiosConfig.delete('/delete-all-my-course', { params }),
};
