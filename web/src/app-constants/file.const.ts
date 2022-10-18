import { langs } from '@uiw/codemirror-extensions-langs'
import { IconType } from 'react-icons'
import { AiFillFileUnknown } from 'react-icons/ai'
import { SiGnubash, SiTypescript, SiJavascript } from 'react-icons/si'
import { VscJson } from 'react-icons/vsc'

type CodeLanguage = keyof typeof langs

export const FILE_UI_MAP: Record<
  string,
  {
    Icon: IconType
    language: CodeLanguage
  }
> = {
  '.unknown': {
    Icon: AiFillFileUnknown,
    language: 'markdown',
  },
  '.sh': {
    Icon: SiGnubash,
    language: 'shell',
  },
  '.ts': {
    Icon: SiTypescript,
    language: 'typescript',
  },
  '.json': {
    Icon: VscJson,
    language: 'json',
  },
  '.js': {
    Icon: SiJavascript,
    language: 'javascript',
  },
}
export const KNOWN_FILE_EXTENSIONS: string[] = Object.keys(FILE_UI_MAP)
