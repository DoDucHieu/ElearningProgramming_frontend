import { toast } from 'react-toastify';
import { cartApi } from '../../api/cartApi';
import { CartType } from '../../type/type';
import { RootState, AppDispatch } from '../store';
import { actionType } from './actionType';

const getAllCart = (email: string) => {
    return async (dispatch: AppDispatch) => {
        const params = {
            email,
        };
        const res = await cartApi.getAll(params);
        if (res?.data?.data) {
            const arrData = res.data.data;
            const arrCourse: CartType[] = arrData.map((course: any) => {
                return {
                    course_id: course?.course_id?._id,
                    price: course?.course_id?.price,
                    img_url: course.course_id?.img_url,
                    name: course.course_id?.name,
                };
            });
            await dispatch({
                type: actionType.GET_ALL_CART,
                payload: arrCourse,
            });
            await dispatch({
                type: actionType.GET_CART_ID,
                payload: arrData[0]?._id,
            });
        }
    };
};

const addToCart = (data: CartType) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const res = await cartApi.addToCart(data);
        if (res?.data?.errCode === 0) {
            let arr: CartType[] = [...getState().cartReducer.arrCourse];
            let checkExist = false;
            arr.forEach((course: CartType) => {
                if (course.course_id === data.course_id) checkExist = true;
            });
            if (!checkExist) {
                arr = [...arr, data];
            }
            dispatch({
                type: actionType.ADD_TO_CART,
                payload: arr,
            });
            toast.success(res.data.errMessage);
        }
    };
};

const removeFromCart = (data: CartType) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const params = {
            email: data.email,
            course_id: data.course_id,
        };
        const res = await cartApi.removeFromCart(params);
        if (res && res?.data?.errCode === 0) {
            const arr: CartType[] = getState().cartReducer.arrCourse;
            const newArr = arr.filter((item) => {
                return item.course_id !== data.course_id;
            });
            dispatch({
                type: actionType.REMOVE_FROM_CART,
                payload: newArr,
            });
            toast.success(res.data.errMessage);
        }
    };
};

export const cartAction = {
    getAllCart,
    addToCart,
    removeFromCart,
};
