import { Dexie } from "dexie";

export default (db: Dexie) => {
    db.version(1)
        .stores({
            tunings: "++id,name,colorBank,layout",
            songs: "++id,tuningId,artist,title"
        });
};