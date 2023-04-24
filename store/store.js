import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import appReducer from '@/store/appSlice';


const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
});

export default configureStore({
    reducer: rootReducer,
});
