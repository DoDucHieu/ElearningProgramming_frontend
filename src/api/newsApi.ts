import { NewsType } from '../type/type';
import axiosConfig from './axiosConfig';

export const newsApi = {
    getAll: (params: any) => axiosConfig.get('/get-all-new', { params }),
    getDetail: (params: any) => axiosConfig.get('/get-detail-new', { params }),
    add: (body: NewsType) => axiosConfig.post('/add-new', body),
    edit: (body: NewsType) => axiosConfig.put('/edit-new', body),
    delete: (params: any) => axiosConfig.delete('/delete-new', { params }),
    approve: (body: NewsType) => axiosConfig.put('/approve-new', body),
    increaseView: (body: NewsType) =>
        axiosConfig.put('/increase-view-new', body),
};
