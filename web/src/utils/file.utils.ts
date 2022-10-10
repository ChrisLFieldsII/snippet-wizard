import { KNOWN_FILE_EXTENSIONS, FILE_UI_MAP } from 'src/app-constants'

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.')
  const part = parts[parts.length - 1]
  return part ? `.${part}` : '.unknown'
}

export const getKnownFileExtension = (filename: string): string => {
  const extension = getFileExtension(filename)
  if (KNOWN_FILE_EXTENSIONS.includes(extension)) {
    return extension
  }
  return '.unknown'
}

export const getCodeLanguage = (extension: string) => {
  return FILE_UI_MAP[extension]?.language || 'text'
}
