import { combineReducers } from 'redux';
import { cartReducer, CartReducer } from './cartReducer';
import { commonReducer, CommonReducer } from './commonReducer';
import {
    conversationReducer,
    ConversationReducer,
} from './conversationReducer';

export type RootReducer = {
    cartReducer: CartReducer;
    commonReducer: CommonReducer;
    conversationReducer: ConversationReducer;
};
export const rootReducer = combineReducers({
    cartReducer,
    commonReducer,
    conversationReducer,
});
