import { Box } from '@chakra-ui/react'

type SpacerProps = {
  /** space horizontally? default is false (vertical by default) */
  isHorizontal?: boolean
  size: number | string
}

const defaultValue = 'auto'

export const Spacer = ({ isHorizontal = false, size }: SpacerProps) => {
  return (
    <Box
      style={{
        width: isHorizontal ? size : defaultValue,
        height: !isHorizontal ? size : defaultValue,
      }}
    />
  )
}
