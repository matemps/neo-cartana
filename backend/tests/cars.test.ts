import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import type { Car } from "../src/models/Car.js";

vi.mock("../src/repositories/carRepository.js", () => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
}));

import * as carRepo from "../src/repositories/carRepository.js";

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
    const mockCars: Car[] = [
        { id: 1, make: "Toyota", model: "Camry", body: "Sedan", year: 2022, color: "White", fuel: "Gasoline", transmission: "Automatic" },
        { id: 2, make: "Honda", model: "Civic", body: "Sedan", year: 2021, color: "Blue", fuel: "Gasoline", transmission: "Manual" },
        { id: 3, make: "Ford", model: "Mustang", body: "Coupe", year: 2023, color: "Red", fuel: "Gasoline", transmission: "Automatic" },
    ];

    it("returns the requested slice and total count", async () => {
        vi.mocked(carRepo.findAll).mockReturnValue(mockCars);

        const res = await request(app).get("/cars").query({ start: 0, count: 2 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            data: { slice: [mockCars[0], mockCars[1]], totalNumberOfCars: 3 },
        });
    });

    it("returns the correct slice when start is non-zero", async () => {
        vi.mocked(carRepo.findAll).mockReturnValue(mockCars);

        const res = await request(app).get("/cars").query({ start: 1, count: 2 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            data: { slice: [mockCars[1], mockCars[2]], totalNumberOfCars: 3 },
        });
    });

    it("returns an empty slice when the collection is empty", async () => {
        vi.mocked(carRepo.findAll).mockReturnValue([]);

        const res = await request(app).get("/cars").query({ start: 0, count: 10 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            data: { slice: [], totalNumberOfCars: 0 },
        });
    });

    it("returns an empty slice when start is beyond the total", async () => {
        vi.mocked(carRepo.findAll).mockReturnValue(mockCars);

        const res = await request(app).get("/cars").query({ start: 10, count: 2 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            data: { slice: [], totalNumberOfCars: 3 },
        });
    });

    it("returns 400 when start is missing", async () => {
        const res = await request(app).get("/cars").query({ count: 2 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/start/i);
    });

    it("returns 400 when count is missing", async () => {
        const res = await request(app).get("/cars").query({ start: 0 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/count/i);
    });

    it("returns 400 when start is not an integer", async () => {
        const res = await request(app).get("/cars").query({ start: "abc", count: 2 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/integer/i);
    });

    it("returns 400 when count is not an integer", async () => {
        const res = await request(app).get("/cars").query({ start: 0, count: "1.5" });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/integer/i);
    });

    it("returns 400 when start is negative", async () => {
        const res = await request(app).get("/cars").query({ start: -1, count: 2 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/start/i);
    });

    it("returns 400 when count is less than 1", async () => {
        const res = await request(app).get("/cars").query({ start: 0, count: 0 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/count/i);
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

    it("returns 400 when id is not a number", async () => {
        const res = await request(app).get("/cars/abc");

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/id/i);
    });

    it("returns 400 when id is zero", async () => {
        const res = await request(app).get("/cars/0");

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/id/i);
    });

    it("returns 400 when id is negative", async () => {
        const res = await request(app).get("/cars/-1");

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/id/i);
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

    it("returns 400 when a required field is missing", async () => {
        const { id, make, ...carData } = mockCar;

        const res = await request(app).post("/cars").send(carData);

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/required/i);
    });

    it("returns 400 when make is an empty string", async () => {
        const { id, ...carData } = mockCar;

        const res = await request(app).post("/cars").send({ ...carData, make: "   " });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/make/i);
    });

    it("returns 400 when year is out of range", async () => {
        const { id, ...carData } = mockCar;

        const res = await request(app).post("/cars").send({ ...carData, year: 1800 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/year/i);
    });

    it("returns 400 when body is not a valid value", async () => {
        const { id, ...carData } = mockCar;

        const res = await request(app).post("/cars").send({ ...carData, body: "Minivan" });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/body/i);
    });

    it("returns 400 when fuel is not a valid value", async () => {
        const { id, ...carData } = mockCar;

        const res = await request(app).post("/cars").send({ ...carData, fuel: "Nuclear" });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/fuel/i);
    });

    it("returns 400 when transmission is not a valid value", async () => {
        const { id, ...carData } = mockCar;

        const res = await request(app).post("/cars").send({ ...carData, transmission: "Semi-Auto" });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/transmission/i);
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

    it("returns 400 when id is missing", async () => {
        const res = await request(app).patch("/cars").send({ updates: { color: "Black" } });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/id/i);
    });

    it("returns 400 when id is not a positive integer", async () => {
        const res = await request(app).patch("/cars").send({ id: -5, updates: { color: "Black" } });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/id/i);
    });

    it("returns 400 when updates is missing", async () => {
        const res = await request(app).patch("/cars").send({ id: 1 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/updates/i);
    });

    it("returns 400 when updates is an empty object", async () => {
        const res = await request(app).patch("/cars").send({ id: 1, updates: {} });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/updates/i);
    });

    it("returns 400 when updates contains unknown fields", async () => {
        const res = await request(app).patch("/cars").send({ id: 1, updates: { mileage: 50000 } });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/mileage/i);
    });

    it("returns 400 when updated body is not a valid value", async () => {
        const res = await request(app).patch("/cars").send({ id: 1, updates: { body: "Minivan" } });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/body/i);
    });

    it("returns 400 when updated year is out of range", async () => {
        const res = await request(app).patch("/cars").send({ id: 1, updates: { year: 1800 } });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/year/i);
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

    it("returns 400 when id is missing", async () => {
        const res = await request(app).delete("/cars").send({});

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/id/i);
    });

    it("returns 400 when id is not a positive integer", async () => {
        const res = await request(app).delete("/cars").send({ id: 0 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/id/i);
    });
});
