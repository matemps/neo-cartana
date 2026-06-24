import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url"
import path from "path";
import type { Car } from "../models/Car.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../../../db.json");

type DbData = { cars: Car[] };


const readDb = () : DbData => {
    return JSON.parse(readFileSync(DB_PATH, "utf-8"));
};

const writeDb = (data: DbData): void => {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
};

const findAll = () : Car[] => {
    return readDb().cars;
};

const findById = (id: number) : Car | undefined => {
    return readDb().cars.find(car => car.id === id);
};

const create = (carData: Omit<Car, "id">): Car => {
    const db = readDb();

    const nextId : number = db.cars.reduce((max : number, car: Car) => Math.max(max, car.id), 0) + 1;

    const newCar : Car = { id: nextId, ...carData };

    db.cars.push(newCar);

    writeDb(db);

    return newCar;
};

const update = (id: number, updates: Partial<Omit<Car, "id">>): Car | undefined => {
    const db = readDb();

    const index : number = db.cars.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    db.cars[index] = { ...db.cars[index], ...updates };

    writeDb(db);

    return db.cars[index];
};

const remove = (id: number) : boolean => {
    const db = readDb();

    const index : number = db.cars.findIndex(car => car.id === id);
    if (index === -1) return false;

    db.cars.splice(index, 1);

    writeDb(db);

    return true;
};

export { findAll, findById, create, update, remove };