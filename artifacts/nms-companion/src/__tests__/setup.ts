// Patch globalThis with fake IndexedDB globals BEFORE any test file imports idb.
// fake-indexeddb/auto sets IDBFactory, IDBRequest, IDBDatabase, etc. on globalThis.
import 'fake-indexeddb/auto';
import '@testing-library/jest-dom';
