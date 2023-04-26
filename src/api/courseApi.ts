import { CourseType } from '../type/type';
import axiosConfig from './axiosConfig';

export const courseApi = {
    getAll: (params: any) => axiosConfig.get('/get-all-course', { params }),
    getDetail: (params: any) =>
        axiosConfig.get('/get-detail-course', { params }),
    add: (body: CourseType) => axiosConfig.post('/add-course', body),
    edit: (body: CourseType) => axiosConfig.put('/edit-course', body),
    delete: (params: any) => axiosConfig.delete('/delete-course', { params }),
    increaseRegistryCourse: (body: CourseType) =>
        axiosConfig.put('/increase-registry-course', body),
    getAllFreeCourse: (params: any) =>
        axiosConfig.get('/get-all-free-course', { params }),
    getAllProCourse: (params: any) =>
        axiosConfig.get('/get-all-pro-course', { params }),
};
