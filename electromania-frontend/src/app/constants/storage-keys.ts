export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  CART: 'carrito_electromania',
  LANGUAGE: 'electromania_lang',
  THEME: 'theme',
  FILTERS: 'electromania_filtros',
} as const;
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];