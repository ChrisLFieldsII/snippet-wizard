import { useVirtualizer } from '@tanstack/react-virtual'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as WindowList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

import { InfiniteQueryAdapter, noop } from '~/utils'

// return `id` from data at specified index, if doesnt have one return index as key
const keyExtractor = (index, data: any[]) => {
  return data?.[index]?.id || index
}

type ListRenderItemArgs<T> = {
  item: T
  index: number
}

type InfiniteListProps<T> = InfiniteQueryAdapter<T> & {
  renderItem(args: ListRenderItemArgs<T>): React.ReactNode
  renderLoading(): React.ReactNode
  /** callback to determine item size. can be an estimate */
  getItemSize(args: ListRenderItemArgs<T>): number
  /** try to use dynamic item sizing. may result in UI overlapping bugs... */
  useDynamicSizing?: boolean
}

export const InfiniteWindowList = <T,>({
  fetchNextPage,
  hasNextPage,
  isNextPageLoading,
  items,
  renderItem,
  renderLoading,
  getItemSize,
  useDynamicSizing = true,
}: InfiniteListProps<T>) => {
  const [sentryRef] = useInfiniteScroll({
    loading: isNextPageLoading,
    hasNextPage,
    onLoadMore: fetchNextPage,
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: false,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  })

  const parentRef = React.useRef<HTMLDivElement>(null)

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const onLoadMoreItems = isNextPageLoading ? noop : fetchNextPage

  // callback to determine is Every row is loaded except for our loading indicator row.
  const getIsItemLoaded = (index: number) =>
    !hasNextPage || index < items.length

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

  const rowVirtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => getItemSize({ item: items[index], index }),
    getItemKey: (index) => keyExtractor(index, items),
    // measureElement(el: HTMLDivElement, instance) {
    //   console.log('measure element', el.clientHeight)

    //   return el.clientHeight + 50
    // },
  })
  const virtualItems = rowVirtualizer.getVirtualItems()
  window.rowVirtualizer = rowVirtualizer

  return (
    <div
      ref={parentRef}
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map(({ index, measureElement, start, key }) => {
          const isLoaderRow = index > items.length - 1

          return (
            <div
              key={key}
              ref={useDynamicSizing ? measureElement : undefined}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${start}px)`,
              }}
            >
              {isLoaderRow ? (
                <div ref={sentryRef}>{renderLoading()}</div>
              ) : (
                renderItem({ item: items[index], index })
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

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
