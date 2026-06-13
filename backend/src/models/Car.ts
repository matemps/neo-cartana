export interface Car {
    id: Number;
    make: String;
    model: String;
    body: "SUV" | "Hatchback" | "Wagon" | "Truck" | "Crossover" | "Coupe";
    year: Number,
    color: String,
    fuel: "Gasoline" | "Electric" | "Diesel" | "Hybrid";
    transmission: "Single Speed" | "Automatic" | "Manual" | "CVT";
};
