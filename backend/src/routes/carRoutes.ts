import express from "express";
import { 
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from "../controllers/carController.ts";

const userRouter = express.Router();

userRouter.route('/')
    .get(getAllCars)
    .post(createCar)
    .patch(updateCar)
    .delete(deleteCar);

userRouter.route("/:id")
    .get(getCarById);

export default userRouter;