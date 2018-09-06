import db, { ColorBank, ITuning } from "./";

export const getTuningsForBank = async (colorBank: ColorBank) => db.table("tunings")
    .where("colorBank")
    .equals(colorBank)
    .toArray();

const getTuningByLayoutArray = async (layout: string[]) => db.table("tunings")
    .where(["E", "A", "D", "G", "B", "e"])
    .equals(layout)
    .toArray();

async function getTuningByLayoutOrString(E: string, A: string, D: string, G: string, B: string, e: string): Promise<ITuning>;
async function getTuningByLayoutOrString(layout: string[]): Promise<ITuning>;
async function getTuningByLayoutOrString(EorLayout: string | string[], A?: string, D?: string, G?: string, B?: string, e?: string) {
    if(Array.isArray(EorLayout)) {
        return getTuningByLayoutArray(EorLayout);
    }
    return getTuningByLayoutArray([EorLayout, A as string, D as string, G as string, B as string, e as string]);
}

export const getTuningByLayout = getTuningByLayoutOrString;