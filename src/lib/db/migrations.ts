import { Dexie } from "dexie";

export default (db: Dexie) => {
    db.version(1)
        .stores({
            tunings: "++id,name,colorBank,E,A,D,G,B,e",
            songs: "++id,tuningId,artist,title"
        });
};