// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof CodeEditor> = (args) => {
//   return <CodeEditor {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { CodeEditor } from './CodeEditor'

export default {
  title: 'Components/CodeEditor',
  component: CodeEditor,
  args: {
    code: `echo "hello world"`,
    filename: 'example.sh',
    isEditable: true,
    showHeader: true,
  },
  argTypes: {
    setFilename: { action: 'set filename' },
    setCode: { action: 'set code' },
  },
} as ComponentMeta<typeof CodeEditor>

type CodeEditorStory = ComponentStory<typeof CodeEditor>

export const codeEditor: CodeEditorStory = (args) => {
  return <CodeEditor {...args} />
}
