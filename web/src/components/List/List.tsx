import {
  List as ChakraList,
  ListItem as ChakraListItem,
  ListProps as ChakraListProps,
} from '@chakra-ui/react'

interface ListProps<T> extends ChakraListProps {
  items?: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor?: (item: T, index?: number) => string
}

export function List<T>({
  items = [],
  renderItem,
  keyExtractor = (item: any, index?: number) => {
    return item.id || index?.toString()
  },
  ...restProps
}: ListProps<T>) {
  return (
    <ChakraList {...restProps}>
      {items.map((item, index) => {
        return (
          <ChakraListItem key={keyExtractor(item, index)}>
            {renderItem(item, index)}
          </ChakraListItem>
        )
      })}
    </ChakraList>
  )
}
