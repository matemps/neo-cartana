import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.ts";
import type { Car } from "../models/Car.ts";

vi.mock("../repositories/carRepository.ts", () => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
}));

import * as carRepo from "../repositories/carRepository.ts";

const mockCar: Car = {
    id: 1,
    make: "Toyota",
    model: "Camry",
    body: "Sedan",
    year: 2022,
    color: "White",
    fuel: "Gasoline",
    transmission: "Automatic",
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("GET /cars", () => {
    it("returns all cars", async () => {
        vi.mocked(carRepo.findAll).mockReturnValue([mockCar]);

        const res = await request(app).get("/cars");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ data: [mockCar] });
    });

    it("returns empty array when no cars exist", async () => {
        vi.mocked(carRepo.findAll).mockReturnValue([]);

        const res = await request(app).get("/cars");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ data: [] });
    });
});

describe("GET /cars/:id", () => {
    it("returns the car with the given id", async () => {
        vi.mocked(carRepo.findById).mockReturnValue(mockCar);

        const res = await request(app).get("/cars/1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ data: mockCar });
    });

    it("returns 404 when car does not exist", async () => {
        vi.mocked(carRepo.findById).mockReturnValue(undefined);

        const res = await request(app).get("/cars/999");

        expect(res.status).toBe(404);
        expect(res.body.message).toContain("999");
    });
});

describe("POST /cars", () => {
    it("creates and returns the new car", async () => {
        const { id, ...carData } = mockCar;
        vi.mocked(carRepo.create).mockReturnValue(mockCar);

        const res = await request(app).post("/cars").send(carData);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ data: mockCar });
        expect(carRepo.create).toHaveBeenCalledWith(carData);
    });
});

describe("PATCH /cars", () => {
    it("updates and returns the car", async () => {
        const updatedCar: Car = { ...mockCar, color: "Black" };
        vi.mocked(carRepo.update).mockReturnValue(updatedCar);

        const res = await request(app)
            .patch("/cars")
            .send({ id: 1, updates: { color: "Black" } });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ data: updatedCar });
        expect(carRepo.update).toHaveBeenCalledWith(1, { color: "Black" });
    });

    it("returns 404 when car does not exist", async () => {
        vi.mocked(carRepo.update).mockReturnValue(undefined);

        const res = await request(app)
            .patch("/cars")
            .send({ id: 999, updates: { color: "Black" } });

        expect(res.status).toBe(404);
        expect(res.body.message).toContain("999");
    });
});

describe("DELETE /cars", () => {
    it("deletes the car and returns a confirmation message", async () => {
        vi.mocked(carRepo.remove).mockReturnValue(true);

        const res = await request(app).delete("/cars").send({ id: 1 });

        expect(res.status).toBe(200);
        expect(res.body.message).toContain("1");
        expect(carRepo.remove).toHaveBeenCalledWith(1);
    });

    it("returns 404 when car does not exist", async () => {
        vi.mocked(carRepo.remove).mockReturnValue(false);

        const res = await request(app).delete("/cars").send({ id: 999 });

        expect(res.status).toBe(404);
        expect(res.body.message).toContain("999");
    });
});
