import express from "express";
import { 
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from "../controllers/carController";

const router = express.Router();

router.route('/')
    .get(getAllCars)
    .post(createCar)
    .patch(updateCar)
    .delete(deleteCar);

router.route("/:id")
    .get(getCarById);

export { router };