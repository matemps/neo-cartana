import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const carsApi = createApi({
    reducerPath: "carsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000"}),
    endpoints: (build) => ({
        getCars: build.query({
            query: () => ({
                "url": "/cars",
                method: "GET",
                headers: {
                    "accept": "application/json"
                }
            })
        })
    })
});

export const { useGetCarsQuery } = carsApi;
