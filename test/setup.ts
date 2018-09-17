import Dexie from "dexie";
// @ts-ignore
import fakeIndexedDb from "fake-indexeddb";
// @ts-ignore
import fakeIDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";

Dexie.dependencies.indexedDB = fakeIndexedDb;
Dexie.dependencies.IDBKeyRange = fakeIDBKeyRange;