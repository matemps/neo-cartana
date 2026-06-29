import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


interface Car {
    id: number;
    make: string;
    model: string;
    body: "SUV" | "Sedan" | "Hatchback" | "Wagon" | "Truck" | "Crossover" | "Coupe";
    year: number;
    color: string;
    fuel: "Gasoline" | "Electric" | "Diesel" | "Hybrid";
    transmission: "Single Speed" | "Automatic" | "Manual" | "CVT";
};

export const carsApi = createApi({
    reducerPath: "carsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000"}),
    endpoints: (build) => ({
        getCars: build.query<{ data: { slice: Car[], totalNumberOfCars: number } }, { start: number; count: number }>({
            query: ({ start, count }) => ({
                "url": "/cars",
                method: "GET",
                params: { start, count },
                headers: {
                    "accept": "application/json"
                }
            })
        })
    })
});

export const { useGetCarsQuery } = carsApi;
