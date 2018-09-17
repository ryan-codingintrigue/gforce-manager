import Dexie from "dexie";
import migrate from "./migrations";

export enum ColorBank {
    Blue = "blue",
    Magenta = "magenta"
}

export interface ITuning {
    id?: number;
    name: string;
    colorBank: ColorBank;
    layout: string[];
}

export interface ISongs {
    id?: number;
    tuningId: number;
    artist: string;
    title: string;
}

class TuningsDatabase extends Dexie {
    tunings: Dexie.Table<ITuning, number>;
    songs: Dexie.Table<ISongs, number>;
    
    constructor() {  
      super("TuningsDatabase");
      
      migrate(this);
    }
  }

export default new TuningsDatabase();