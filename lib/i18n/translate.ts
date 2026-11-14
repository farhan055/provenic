import type { Dictionary } from './dictionaries/en'

type Join<K extends string, P extends string> = `${K}.${P}`
type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : Join<K, Paths<T[K]>>
}[keyof T & string]

export type TranslationKey = Paths<Dictionary>
export type TranslateVars = Record<string, string | number>
export type Translator = (key: TranslationKey, vars?: TranslateVars) => string

export function createTranslator(dict: Dictionary): Translator {
  return (key, vars) => {
    let node: unknown = dict
    for (const part of key.split('.')) {
      node = (node as Record<string, unknown> | undefined)?.[part]
    }
    let text = typeof node === 'string' ? node : key
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value))
      }
    }
    return text
  }
}
