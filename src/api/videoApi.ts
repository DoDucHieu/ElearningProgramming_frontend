import { VideoType } from '../type/type';
import axiosConfig from './axiosConfig';

export const videoApi = {
    getAll: (params: any) => axiosConfig.get('/get-all-video', { params }),
    getDetail: (params: any) =>
        axiosConfig.get('/get-detail-video', { params }),
    add: (body: VideoType) => axiosConfig.post('/add-video', body),
    edit: (body: VideoType) => axiosConfig.put('/edit-video', body),
    delete: (params: any) => axiosConfig.delete('/delete-video', { params }),
    approve: (body: VideoType) => axiosConfig.put('/approve-video', body),
    increaseView: (body: VideoType) =>
        axiosConfig.put('/increase-view-video', body),
};
