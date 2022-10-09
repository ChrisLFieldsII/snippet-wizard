import { IconType } from 'react-icons'
import { AiFillFileUnknown } from 'react-icons/ai'
import { SiGnubash, SiTypescript } from 'react-icons/si'

export const FILE_UI_MAP: Record<
  string,
  {
    Icon: IconType
    language: string
  }
> = {
  '.sh': {
    Icon: SiGnubash,
    language: 'bash',
  },
  '.ts': {
    Icon: SiTypescript,
    language: 'typescript',
  },
  '.unknown': {
    Icon: AiFillFileUnknown,
    language: 'text',
  },
}
export const KNOWN_FILE_EXTENSIONS: string[] = Object.keys(FILE_UI_MAP)
