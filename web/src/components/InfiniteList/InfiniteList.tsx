import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as WindowList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

import { InfiniteQueryAdapter, noop } from '~/utils'

// return `id` from data at specified index, if doesnt have one return index as key
const keyExtractor = (index, data: any[]) => {
  return data?.[index]?.id || index
}

type InfiniteListProps<T> = InfiniteQueryAdapter<T> & {
  renderItem(args: { item: T; index: number }): React.ReactNode
  renderLoading(): React.ReactNode
}

export const InfiniteList = <T,>({
  fetchNextPage,
  hasNextPage,
  isNextPageLoading,
  items,
  renderItem,
  renderLoading,
}: InfiniteListProps<T>) => {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const onLoadMoreItems = isNextPageLoading ? noop : fetchNextPage

  // callback to determine is Every row is loaded except for our loading indicator row.
  const getIsItemLoaded = (index: number) =>
    !hasNextPage || index < items.length

  // callback to determine item size. 400 is size of snippet with 10 LOC.
  // FIXME: this makes component less reusable. should move this to a prop
  const getItemSize = (_index: number) => 400

  const Item = ({
    index,
    style,
  }: {
    index: number
    style: React.CSSProperties
  }) => {
    let content

    if (!getIsItemLoaded(index)) {
      content = renderLoading()
    } else {
      content = renderItem({ item: items[index], index })
    }

    return <div style={style}>{content}</div>
  }

  return (
    <InfiniteLoader
      isItemLoaded={getIsItemLoaded}
      itemCount={itemCount}
      loadMoreItems={onLoadMoreItems}
    >
      {({ onItemsRendered, ref }) => {
        return (
          <AutoSizer>
            {({ height, width }) => {
              return (
                <WindowList
                  ref={ref}
                  itemCount={itemCount}
                  onItemsRendered={onItemsRendered}
                  height={height}
                  width={width}
                  itemKey={keyExtractor}
                  itemSize={getItemSize}
                  itemData={items}
                >
                  {Item}
                </WindowList>
              )
            }}
          </AutoSizer>
        )
      }}
    </InfiniteLoader>
  )
}
