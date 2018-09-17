import { ColorBank, ITuning } from "../../../src/lib/db/index";
import db from "../../../src/lib/db";
import { addTuning, getTuningsForBank, getTuningByLayout } from "../../../src/lib/db/tunings";

describe("Creating tunings", () => {
    beforeEach(async done => {
        // Reset the database before each test
        await db.delete();
        jest.resetModules();
        await db.open();
        done();
    });

    it("Throws an error when trying to add an invalid string tuning", async () => {
        await expect(addTuning("Standard String", ColorBank.Blue, "E A D G B")).rejects.toThrow();
    });

    it("Can add a valid string tuning to the database", async () => {
        await expect(async () => {
            await addTuning("Standard String", ColorBank.Blue, "E A D G B e");
        }).not.toThrow();
        const tuning = await db.tunings.limit(1).first() as ITuning;
        expect(tuning).toBeDefined();
        expect(tuning.name).toBe("Standard String");
        expect(tuning.colorBank).toBe(ColorBank.Blue);
        expect(tuning.layout).toEqual(["E", "A", "D", "G", "B", "e"]);
    });

    it("Can add a valid array layout tuning to the database", async () => {
        await expect(async () => {
            await addTuning("Standard Array", ColorBank.Blue, ["E", "A", "D", "G", "B", "e"]);
        }).not.toThrow();
        const tuning = await db.tunings.limit(1).first() as ITuning;
        expect(tuning).toBeDefined();
        expect(tuning.name).toBe("Standard Array");
        expect(tuning.colorBank).toBe(ColorBank.Blue);
        expect(tuning.layout).toEqual(["E", "A", "D", "G", "B", "e"]);
    });

    it("Can add a valid explicit layout tuning to the database", async () => {
        await expect(async () => {
            await addTuning("Standard Explicit", ColorBank.Magenta, "E", "A", "D", "G", "B", "e");
        }).not.toThrow();
        const tuning = await db.tunings.limit(1).first() as ITuning;
        expect(tuning).toBeDefined();
        expect(tuning.name).toBe("Standard Explicit");
        expect(tuning.colorBank).toBe(ColorBank.Magenta);
        expect(tuning.layout).toEqual(["E", "A", "D", "G", "B", "e"]);
    });
});

describe("Querying tunings", () => {
    beforeEach(async done => {
        // Reset the database before each test
        await db.delete();
        jest.resetModules();
        await db.open();
        done();
    });

    it("Can query tuning by ColorBank", async () => {
        const tuning: ITuning = {
            colorBank: ColorBank.Blue,
            layout: ["E", "A", "D", "G", "B", "e"],
            name: "Standard"
        };
        await db.tunings.add(tuning);
        const tunings = await getTuningsForBank(ColorBank.Blue);
        expect(tunings).toBeDefined();
        expect(tunings.length).toBe(1);
        expect(tunings[0]).toEqual(tuning);
    });

    it("Can query tunings by string layout", async () => {
        await db.tunings.add({
            colorBank: ColorBank.Blue,
            layout: ["E", "A", "D", "G", "B", "e"],
            name: "Standard"
        });
        await db.tunings.add({
            colorBank: ColorBank.Blue,
            layout: ["D", "A", "D", "G", "B", "e"],
            name: "Drop D"
        });
        const results = await getTuningByLayout("D A D G B e");
        expect(results).toBeDefined();
        expect(results.length).toBe(1);
        expect(results[0].name).toBe("Drop D");
    });
});