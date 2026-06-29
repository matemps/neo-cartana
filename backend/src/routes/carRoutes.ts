import express from "express";
import { 
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from "../controllers/carController.js";

const userRouter = express.Router();

userRouter.route('/')
    .get(getCars)
    .post(createCar)
    .patch(updateCar)
    .delete(deleteCar);

userRouter.route("/:id")
    .get(getCarById);

export default userRouter;