import { Request, Response, NextFunction } from "express";
import type { Car } from "../models/Car.ts";
import * as carRepo from "../repositories/carRepository.ts";


const getAllCars = async (_req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const cars = carRepo.findAll();
        res.status(200).json({ data: cars });
    } catch (err) {
        next(err);
    }
};

const getCarById = async (req: Request<{ id: number }>, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const id : number = req.params.id;

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

        const updated = carRepo.update(id, updates )
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
        const id : number = req.body.id;

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

export { getAllCars, getCarById, createCar, updateCar, deleteCar };