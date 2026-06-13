import { Request, Response } from "express";
import { Car } from "../models/Car";

const getAllCars = async (res: Response) => {
    // Get all cars from db

    // If no cars return response

    // return cars
};

const getCarById = async (req: Request<{ id: Number }>, res: Response) => {
    const id = req.params.id;

    // Find car by id

    // If no car is found, return response

    // Return car
};

const createCar = async (req: Request<{}, {}, Omit<Car, "id">>, res: Response) => {
    const {
        make,
        model,
        body,
        year,
        color,
        fuel,
        transmission
    } = req.body;

    const car : Car = {
        id: 0,
        make: make,
        model: model,
        body: body,
        year: year,
        color: color,
        fuel: fuel,
        transmission: transmission
    };

    // create car

    // return response
};

const updateCar = async (req: Request<{}, {}, Car>, res: Response) => {
    const {
        id,
        make,
        model,
        body,
        year,
        color,
        fuel,
        transmission
    } = req.body;

    // Find car by id

    // If no car is found, return response

    // update car

    // return response
};

const deleteCar = async (req: Request<{}, {}, { id: Number }>, res: Response) => {
    const { id } = req.body;

    // Find car by id

    // If no car is found, return response

    // delete car

    // return response
};

export { getAllCars, getCarById, createCar, updateCar, deleteCar };