// Migración de @capacitor/storage a @capacitor/preferences
import { Preferences } from '@capacitor/preferences';

// Reemplaza todas las importaciones de Storage con:
// import { Preferences } from '@capacitor/preferences';

// Cambios en los métodos:
// Storage.get() → Preferences.get()
// Storage.set() → Preferences.set()  
// Storage.remove() → Preferences.remove()
// Storage.clear() → Preferences.clear()
// Storage.keys() → Preferences.keys()

export { Preferences as Storage };