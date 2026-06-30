import { Request, Response, NextFunction } from "express";
import type { Car } from "../models/Car.js";
import * as carRepo from "../repositories/carRepository.js";

const VALID_BODIES: Car["body"][] = ["SUV", "Sedan", "Hatchback", "Wagon", "Truck", "Crossover", "Coupe"];
const VALID_FUELS: Car["fuel"][] = ["Gasoline", "Electric", "Diesel", "Hybrid"];
const VALID_TRANSMISSIONS: Car["transmission"][] = ["Single Speed", "Automatic", "Manual", "CVT"];


const getCars = async (req: Request<{}, {}, {}, { start: string, count: string}>, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const start = Number(req.query.start);
        const count = Number(req.query.count);

        if (req.query.start === undefined || req.query.count === undefined) {
            res.status(400).json({ message: "Query parameters 'start' and 'count' are required." });
            return;
        }

        if (!Number.isInteger(start) || !Number.isInteger(count)) {
            res.status(400).json({ message: "Query parameters 'start' and 'count' must be integers." });
            return;
        }

        if (start < 0 || count < 1) {
            res.status(400).json({ message: "'start' must be >= 0 and 'count' must be >= 1." });
            return;
        }

        const cars = carRepo.findAll();
        const totalNumberOfCars = cars.length;

        const slice = cars.slice(start, start + count);
        res.status(200).json({ data: { slice: slice, totalNumberOfCars: totalNumberOfCars } });
    } catch (err) {
        next(err);
    }
};

const getCarById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({ message: "'id' must be a positive integer." });
            return;
        }

        const car = carRepo.findById(id);

        if (!car) {
            res.status(404).json({ message: `Car with id ${id} not found.` });
            return;
        }

        res.status(200).json({ data: car });
    } catch (err) {
        next(err);
    }
};

const createCar = async (req: Request<{}, {}, Omit<Car, "id">>, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const {
            make,
            model,
            body,
            year,
            color,
            fuel,
            transmission
        } = req.body;

        if (!make || !model || !body || !year || !color || !fuel || !transmission) {
            res.status(400).json({ message: "All fields are required: make, model, body, year, color, fuel, transmission." });
            return;
        }

        if (typeof make !== "string" || make.trim() === "") {
            res.status(400).json({ message: "'make' must be a non-empty string." });
            return;
        }

        if (typeof model !== "string" || model.trim() === "") {
            res.status(400).json({ message: "'model' must be a non-empty string." });
            return;
        }

        if (typeof color !== "string" || color.trim() === "") {
            res.status(400).json({ message: "'color' must be a non-empty string." });
            return;
        }

        if (!Number.isInteger(year) || year < 1886 || year > new Date().getFullYear() + 1) {
            res.status(400).json({ message: "'year' must be a valid integer year." });
            return;
        }

        if (!(VALID_BODIES as string[]).includes(body)) {
            res.status(400).json({ message: `'body' must be one of: ${VALID_BODIES.join(", ")}.` });
            return;
        }

        if (!(VALID_FUELS as string[]).includes(fuel)) {
            res.status(400).json({ message: `'fuel' must be one of: ${VALID_FUELS.join(", ")}.` });
            return;
        }

        if (!(VALID_TRANSMISSIONS as string[]).includes(transmission)) {
            res.status(400).json({ message: `'transmission' must be one of: ${VALID_TRANSMISSIONS.join(", ")}.` });
            return;
        }

        const newCar = carRepo.create({
                make, 
                model, 
                body, 
                year, 
                color, 
                fuel, 
                transmission
            });

        res.status(201).json({ data: newCar });
    } catch (err) {
        next(err);
    }
};

const updateCar = async (req: Request<{}, {}, { id: number, updates: Partial<Omit<Car, "id">>}>, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const { id, updates } = req.body;

        if (id === undefined || id === null) {
            res.status(400).json({ message: "'id' is required." });
            return;
        }

        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({ message: "'id' must be a positive integer." });
            return;
        }

        if (!updates || typeof updates !== "object" || Object.keys(updates).length === 0) {
            res.status(400).json({ message: "'updates' must be a non-empty object." });
            return;
        }

        const allowedKeys: (keyof Omit<Car, "id">)[] = ["make", "model", "body", "year", "color", "fuel", "transmission"];
        const unknownKeys = Object.keys(updates).filter(k => !allowedKeys.includes(k as keyof Omit<Car, "id">));
        if (unknownKeys.length > 0) {
            res.status(400).json({ message: `Unknown fields: ${unknownKeys.join(", ")}.` });
            return;
        }

        if (updates.make !== undefined && (typeof updates.make !== "string" || updates.make.trim() === "")) {
            res.status(400).json({ message: "'make' must be a non-empty string." });
            return;
        }

        if (updates.model !== undefined && (typeof updates.model !== "string" || updates.model.trim() === "")) {
            res.status(400).json({ message: "'model' must be a non-empty string." });
            return;
        }

        if (updates.color !== undefined && (typeof updates.color !== "string" || updates.color.trim() === "")) {
            res.status(400).json({ message: "'color' must be a non-empty string." });
            return;
        }

        if (updates.year !== undefined && (!Number.isInteger(updates.year) || updates.year < 1886 || updates.year > new Date().getFullYear() + 1)) {
            res.status(400).json({ message: "'year' must be a valid integer year." });
            return;
        }

        if (updates.body !== undefined && !(VALID_BODIES as string[]).includes(updates.body)) {
            res.status(400).json({ message: `'body' must be one of: ${VALID_BODIES.join(", ")}.` });
            return;
        }

        if (updates.fuel !== undefined && !(VALID_FUELS as string[]).includes(updates.fuel)) {
            res.status(400).json({ message: `'fuel' must be one of: ${VALID_FUELS.join(", ")}.` });
            return;
        }

        if (updates.transmission !== undefined && !(VALID_TRANSMISSIONS as string[]).includes(updates.transmission)) {
            res.status(400).json({ message: `'transmission' must be one of: ${VALID_TRANSMISSIONS.join(", ")}.` });
            return;
        }

        const updated = carRepo.update(id, updates)
        if (!updated) {
            res.status(404).json({ message: `Car with id ${id} not found.` });
            return;
        }

        res.status(200).json({ data: updated });
    } catch (err) {
        next(err);
    }
};

const deleteCar = async (req: Request<{}, {}, { id: number }>, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const id: number = req.body.id;

        if (id === undefined || id === null) {
            res.status(400).json({ message: "'id' is required." });
            return;
        }

        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({ message: "'id' must be a positive integer." });
            return;
        }

        const deleted = carRepo.remove(id);
        if (!deleted) {
            res.status(404).json({ message: `Car with id ${id} not found.` });
            return;
        }

        res.status(200).json({ message: `Car with id ${id} deleted.` });
    } catch (err) {
        next(err);
    }
};

export { getCars, getCarById, createCar, updateCar, deleteCar };