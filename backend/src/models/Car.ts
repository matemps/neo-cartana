export interface Car {
    id: number;
    make: string;
    model: string;
    body: "SUV" | "Sedan" | "Hatchback" | "Wagon" | "Truck" | "Crossover" | "Coupe";
    year: number;
    color: string;
    fuel: "Gasoline" | "Electric" | "Diesel" | "Hybrid";
    transmission: "Single Speed" | "Automatic" | "Manual" | "CVT";
};
