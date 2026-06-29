import type React from "react";
import { useState } from "react";
import { useGetCarsQuery } from "./carAPISlice";
import Pagination from "../../components/Pagination";

const CARS_PER_PAGE = 30;

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


const CarSearch = () => {
    const [page, setPage] = useState(1);
    
    const { data, isLoading, isSuccess, error } = useGetCarsQuery(null);

    let content : React.JSX.Element = <></>;

    if (isLoading) {
        content = <p>Loading...</p>;
    }
    // else if (error.length) {
    //     // error handling
    // }
    else if (isSuccess) {
        content = (
            <div>
                <p>No cars found.</p>
            </div>
        );
        
        if (data.data.length) {
            const totalPages : number = Math.ceil(data.data.length / CARS_PER_PAGE);

            content = (
                <>
                    <div>
                        {data.data.map((car: Car) => (
                            <div key={car.id}>
                                <div>
                                    <h3>{car.year} {car.make} {car.model}</h3>
                                </div>
                                <div>
                                    <div>
                                        <p><b>Body: </b>{car.body}</p>
                                        <p><b>Color: </b>{car.color}</p>
                                        <p><b>Fuel: </b>{car.fuel}</p>
                                        <p><b>Transmission: </b>{car.transmission}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <Pagination
                            currentPage={page}
                            onPageChange={(e) => setPage(e.selected)}
                            totalPages={totalPages}
                        />
                    </div>
                </>
            );
        }
    }
    
    return (
        <section>
            <div>
                <h1>Car Search</h1>
            </div>
            <div>
                {content}
            </div>
        </section>
    );
};

export default CarSearch;
