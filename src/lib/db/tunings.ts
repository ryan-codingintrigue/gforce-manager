import db, { ColorBank, ITuning } from "./";
import parseTuning from "../tunings/parse";

async function addTuningByLayoutOrString(name: string, colorBank: ColorBank, tuning: ITuning): Promise<number>;
async function addTuningByLayoutOrString(name: string, colorBank: ColorBank, tuning: string): Promise<number>;
async function addTuningByLayoutOrString(name: string, colorBank: ColorBank, layout: string[]): Promise<number>;
async function addTuningByLayoutOrString(name: string, colorBank: ColorBank, E: string, A: string, D: string, G: string, B: string, e: string): Promise<number>;
async function addTuningByLayoutOrString(name: string, colorBank: ColorBank, tuningOrE: string | string[] | ITuning, A?: string, D?: string, G?: string, B?: string, e?: string): Promise<number> {
    let layout;
    if(typeof (tuningOrE as ITuning).name !== "undefined") {
        return await db.tunings.add(tuningOrE as ITuning);
    }
    if(Array.isArray(tuningOrE)) {
        layout = [...tuningOrE];
    } else if(arguments.length === 3) {
        layout = parseTuning(tuningOrE as string);
    } else {
        layout = [tuningOrE as string, A as string, D as string, G as string, B as string, e as string]
    }
    return await db.tunings.add({
        colorBank,
        name,
        layout
    });
}

export const addTuning = addTuningByLayoutOrString;

export const getTuningsForBank = async (colorBank: ColorBank) => db.tunings
    .where("colorBank")
    .equals(colorBank)
    .toArray();

const getTuningByLayoutArray = async (layout: string[]) => db.tunings
    .where("layout")
    .equals(layout)
    .toArray();

async function getTuningByLayoutOrString(E: string, A: string, D: string, G: string, B: string, e: string): Promise<ITuning[]>;
async function getTuningByLayoutOrString(layout: string[]): Promise<ITuning[]>;
async function getTuningByLayoutOrString(tuning: string): Promise<ITuning[]>;
async function getTuningByLayoutOrString(EorLayout: string[] | string, A?: string, D?: string, G?: string, B?: string, e?: string): Promise<ITuning[]> {
    if(Array.isArray(EorLayout)) {
        return getTuningByLayoutArray(EorLayout);
    } else if(arguments.length === 1) {
        const layout = parseTuning(EorLayout);
        return getTuningByLayoutArray(layout);
    }
    return getTuningByLayoutArray([EorLayout, A as string, D as string, G as string, B as string, e as string]);
}

export const getTuningByLayout = getTuningByLayoutOrString;