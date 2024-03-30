// Dexie, at the moment, is used for data persistance
// SQLite doesn't support IndexedDB for storage persistance, so we save into indexedDB

import Dexie, { type Table } from 'dexie';

export interface DbDump {
    id?: number;
    data: Uint8Array;
}

export class OozeDexie extends Dexie {

    public dumps!: Table<DbDump>;
    static dumps: any;

    constructor() {
        super('OozeDexieIDB');
        this.version(1).stores({
            dumps: '++id, data'
        });
    }
}

export const OozeDexieDB = new OozeDexie();