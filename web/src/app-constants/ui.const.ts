import { langs } from '@uiw/codemirror-extensions-langs'
import { IconType } from 'react-icons'
import { AiFillFileUnknown } from 'react-icons/ai'
import { SiGnubash, SiTypescript } from 'react-icons/si'

type CodeLanguage = keyof typeof langs

export const FILE_UI_MAP: Record<
  string,
  {
    Icon: IconType
    language: CodeLanguage
  }
> = {
  '.sh': {
    Icon: SiGnubash,
    language: 'shell',
  },
  '.ts': {
    Icon: SiTypescript,
    language: 'typescript',
  },
  '.unknown': {
    Icon: AiFillFileUnknown,
    language: 'markdown',
  },
}
export const KNOWN_FILE_EXTENSIONS: string[] = Object.keys(FILE_UI_MAP)
