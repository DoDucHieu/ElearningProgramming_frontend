import { CartType } from '../../type/type';
import { actionType } from '../action/actionType';

export type CartReducer = {
    cart_id: string | null;
    arrCourse: CartType[];
};

const initialState: CartReducer = {
    cart_id: null,
    arrCourse: [],
};

export const cartReducer = (state: CartReducer = initialState, action: any) => {
    switch (action.type) {
        case actionType.GET_CART_ID:
            return {
                ...state,
                cart_id: action.payload,
            };
        case actionType.GET_ALL_CART:
            return {
                ...state,
                arrCourse: [...action.payload],
            };
        case actionType.ADD_TO_CART:
            return {
                ...state,
                arrCourse: [...action.payload],
            };
        case actionType.REMOVE_FROM_CART:
            return {
                ...state,
                arrCourse: [...action.payload],
            };
        default:
            return state;
    }
};
