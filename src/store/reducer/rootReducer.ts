import { combineReducers } from "redux";
import { cartReducer, CartReducer } from "./cartReducer";
import { commonReducer, CommonReducer } from "./commonReducer";

export type RootReducer = {
	cartReducer: CartReducer;
	commonReducer: CommonReducer;
};
export const rootReducer = combineReducers({
	cartReducer,
	commonReducer,
});
