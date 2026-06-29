import { configureStore } from "@reduxjs/toolkit";
import { carsApi } from "../features/cars/carAPISlice";


const store = configureStore({
    reducer: {
        [carsApi.reducerPath]: carsApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(carsApi.middleware)
});

export default store;
