import { memo } from 'react'
import { PADDING_OF_TICKET_DETAIL, WITDH_OF_BORDER_DOTS } from '@/constants'

const SkeletonVoucherItem = () => {
  return (
    <div className='flex w-full items-center rounded-e-lg shadow-[8px_8px_16px_0px_#00000014]'>
      <div className='relative flex aspect-square size-[84px] flex-shrink-0'>
        {/* Skeleton voucher border */}
        <div
          style={{
            borderLeft: `${WITDH_OF_BORDER_DOTS}px dotted #fff`,
            transform: `translateY(${WITDH_OF_BORDER_DOTS}px) translateX(-${WITDH_OF_BORDER_DOTS / 2}px)`,
            height: `calc(100% - ${PADDING_OF_TICKET_DETAIL}px)`
          }}
          className={`absolute inset-0 z-50`}
        />
        {/* Skeleton voucher image */}
        <div className='size-[84px] max-h-[84px] min-h-[84px] min-w-[84px] max-w-[84px] animate-pulse bg-gray-200' />
      </div>
      {/* Skeleton voucher content */}
      <div className={`flex size-full items-center justify-between gap-2 rounded-e-lg bg-white px-3 py-2`}>
        <div className='flex h-full w-full flex-col justify-between'>
          <div className='flex flex-col gap-2'>
            <div className='h-4 w-3/4 animate-pulse rounded bg-gray-200' />
            <div className='h-3 w-full animate-pulse rounded bg-gray-200' />
            <div className='h-3 w-1/2 animate-pulse rounded bg-gray-200' />
          </div>
          <div className='mt-2 h-3 w-1/3 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='relative'>
          <div className='size-6 animate-pulse rounded-full bg-gray-200' />
        </div>
      </div>
    </div>
  )
}

export default memo(SkeletonVoucherItem)
