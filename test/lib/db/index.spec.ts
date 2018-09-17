import { Dexie } from "dexie";
import db from "../../../src/lib/db";

describe("Database Manager", () => {
    it("Constructs a new Dexie instance", () => {
        expect(db).toBeInstanceOf(Dexie);
    });

    it("Contains a tunings and songs interface", () => {
        expect(db.tables.map(table => table.name)).toEqual(["tunings", "songs"]);
    });
});