import * as SQLite from 'expo-sqlite/legacy'
import * as FileSystem from 'expo-file-system'
import { deleteAsync } from 'expo-file-system'

const db = SQLite.openDatabase('test.db')

const createTables = async () => {
  db.transaction((tx) => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS migration_version (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER NOT NULL
      );`)
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS workout_catalog (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        weekday INTEGER NOT NULL
      );`)
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS exercise_catalog (
        id INTEGER PRIMARY KEY NOT NULL,
        workout_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        sets INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight INTEGER NOT NULL,
        unit INTEGER NOT NULL,
        description TEXT,
        FOREIGN KEY (workout_id) REFERENCES workout_catalog (id)
      );`)

    // Insert initial migration version
    tx.executeSql(`
      INSERT OR IGNORE INTO migration_version (id, version) VALUES (1, 0);`)
  })
}

const getCurrentVersion = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT version FROM migration_version LIMIT 1;',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0).version)
          } else {
            resolve(0)
          }
        },
        (_, error) => {
          reject(error)
        },
      )
    })
  })
}

const setVersion = (version) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE migration_version SET version = ? WHERE id = 1;',
      [version],
      () => console.log(`Database version updated to ${version}`),
      (_, error) => {
        console.error('Error updating database version:', error)
      },
    )
  })
}

const applyMigrations = async () => {
  const currentVersion = await getCurrentVersion()

  // Migration 1: Example!!!!!!
  // if (currentVersion < 1) {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       `ALTER TABLE users ADD COLUMN email TEXT;`,
  //       [],
  //       () => {
  //         console.log('Migration 1 applied successfully')
  //         setVersion(1)
  //       },
  //       (_, error) => {
  //         console.error('Error applying migration 1:', error);
  //       }
  //     )
  //   })
  // }
}

const resetDatabase = async () => {
  try {
    await deleteAsync(`${FileSystem.documentDirectory}/SQLite/test.db`, {
      idempotent: true,
    })
  } catch (error) {
    console.error('Failed to delete database', error)
  }
}

const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    try {
      createTables()
      applyMigrations().then(() => resolve())
    } catch (error) {
      reject(error)
    }
  })
}

export { db, initializeDatabase, resetDatabase }
