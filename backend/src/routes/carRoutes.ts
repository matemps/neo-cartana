import express from "express";
import { 
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from "../controllers/carController.js";

const carRouter = express.Router();

carRouter.route('/')
    .get(getCars)
    .post(createCar)
    .patch(updateCar)
    .delete(deleteCar);

carRouter.route("/:id")
    .get(getCarById);

export default carRouter;