import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Note } from '../types/Note';

interface NotesDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
  };
}

let dbInstance: IDBPDatabase<NotesDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<NotesDB>> {
  if (dbInstance) return dbInstance;
  
  dbInstance = await openDB<NotesDB>('NotesDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
    },
  });
  
  return dbInstance;
}

export async function saveNote(note: Note): Promise<void> {
  const db = await initDB();
  await db.put('notes', note);
}

export async function getNote(id: string): Promise<Note | undefined> {
  const db = await initDB();
  return await db.get('notes', id);
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await initDB();
  return await db.getAll('notes');
}

export async function deleteNote(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('notes', id);
}

export async function clearAllNotes(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('notes', 'readwrite');
  await tx.objectStore('notes').clear();
  await tx.done;
}