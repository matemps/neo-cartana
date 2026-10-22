import db from "../config/dbConn.js";
import Car from "../models/Car.js";


const findAll = () : Car[] => {
    try {
        const cars : Car[] = db.prepare<{}, Car>("SELECT * FROM Cars").all({});

        return cars;
    } catch (err) {
        throw err;
    }
};

const find = (start: number, count: number) : Car[] => {
    try {
        const cars : Car[] = db.prepare<{ offset: number, limit: number }, Car>("SELECT * FROM Cars ORDER BY id DESC LIMIT @limit OFFSET @offset").all({ offset: start, limit: count });

        return cars;
    } catch (err) {
        throw err;
    }
}

const findById = (id: number) : Car | undefined => {
    try {
        const car : Car | undefined = db.prepare<{ id: number; }, Car>("SELECT * FROM Cars WHERE id = @id").get({ id });

        return car;
    } catch (err) {
        throw err;
    }
};

const create = (carData: Omit<Car, "id">) : Car | undefined => {
    try {
        const newCar = db.prepare<Omit<Car, "id">, Car>("INSERT INTO Cars (make, model, body, year, color, fuel, transmission) VALUES (@make, @model, @body, @year, @color, @fuel, @transmission) RETURNING *").get({ ...carData });
        
        return newCar;
    } catch (err) {
        throw err;
    }
};

const update = (id: number, updates: Partial<Omit<Car, "id">>) : Car | undefined => {
    try {
        const updatedCar = db.prepare<{ [K in keyof Omit<Car, "id">]: Car[K] | null } & { id: number }, Car>(`
            UPDATE Cars SET
                make = COALESCE(@make, make),
                model = COALESCE(@model, model),
                body = COALESCE(@body, body),
                year = COALESCE(@year, year),
                color = COALESCE(@color, color),
                fuel = COALESCE(@fuel, fuel),
                transmission = COALESCE(@transmission, transmission)
            WHERE id = @id
            RETURNING *
        `).get({
            id,
            make: updates.make ?? null,
            model: updates.model ?? null,
            body: updates.body ?? null,
            year: updates.year ?? null,
            color: updates.color ?? null,
            fuel: updates.fuel ?? null,
            transmission: updates.transmission ?? null
        });

        return updatedCar;
    } catch (err) {
        throw err;
    }
};

const remove = (id: number) : boolean => {
    try {
        const result = db.prepare<{ id: number }>("DELETE FROM Cars WHERE id = @id").run({ id });

        return result.changes !== 0;
    } catch (err) {
        throw err;
    }
};

export { findAll, find, findById, create, update, remove };