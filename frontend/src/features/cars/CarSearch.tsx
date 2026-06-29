import type React from "react";
import { useState } from "react";
import { useGetCarsQuery } from "./carAPISlice";
import Pagination from "../../components/Pagination";

const CARS_PER_PAGE = 30;


const CarSearch = () => {
    const [currentPage, setCurrentPage] = useState(1);
    
    const { data, isLoading, isSuccess, error } = useGetCarsQuery(
        { start: (currentPage -1) * CARS_PER_PAGE, count: CARS_PER_PAGE }
    );

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
        
        if (data.data.slice.length) {
            const totalPages : number = Math.ceil(data.data.totalNumberOfCars / CARS_PER_PAGE);

            content = (
                <>
                    <div>
                        {data.data.slice.map((car) => (
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
                            currentPage={currentPage}
                            onPageChange={(e) => setCurrentPage(e.selected)}
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
