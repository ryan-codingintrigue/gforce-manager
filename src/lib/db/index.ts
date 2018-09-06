import Dexie from "dexie";
import migrate from "./migrations";

export enum ColorBank {
    Blue = "blue",
    Magenta = "magenta"
}

// By defining the interface of table records,
// you get better type safety and code completion
export interface ITuning {
    id?: number; // Primary key. Optional (autoincremented)
    name: string; // First name
    colorBank: ColorBank; // Last name
}

export interface ISongs {
    id?: number;
    contactId: number; // "Foreign key" to an IContact
    type: string; // Type of email such as "work", "home" etc...
    email: string; // The email address
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