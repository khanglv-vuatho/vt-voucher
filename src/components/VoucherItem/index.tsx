import { TickCircle, AddCircle } from 'iconsax-react'
import { memo } from 'react'
import { ButtonOnlyIcon } from '../Buttons'
import ImageFallback from '../ImageFallback'
import { PADDING_OF_TICKET_DETAIL, WITDH_OF_BORDER_DOTS } from '@/constants'
import TicketAnimation from '../TicketAnimation'

type VoucherItemProps = {
  thumbnail: string
  description: string
  expiryDate: string
  title: string
  id: number
  selected: number | number[] | null
  onSelect: (id: number) => void
}

const VoucherItem = ({ thumbnail, description, expiryDate, title, id, selected, onSelect }: VoucherItemProps) => {
  const isHaveSelected = selected !== null

  const isSelected = Array.isArray(selected) ? selected.includes(id) : selected === id

  return (
    <div onClick={() => onSelect(id)} className={`flex w-full items-center rounded-e-lg shadow-[8px_8px_16px_0px_#00000014] transition ${!isSelected && isHaveSelected ? 'opacity-50' : ''}`}>
      <div className='relative flex aspect-square size-[84px] flex-shrink-0'>
        {/* Voucher border  */}
        <div
          style={{
            borderLeft: `${WITDH_OF_BORDER_DOTS}px dotted #fff`,
            transform: `translateY(${WITDH_OF_BORDER_DOTS}px) translateX(-${WITDH_OF_BORDER_DOTS / 2}px)`,
            height: `calc(100% - ${PADDING_OF_TICKET_DETAIL}px)`
          }}
          className={`absolute inset-0 z-50`}
        />
        {/* Voucher image  */}
        <ImageFallback height={84} width={84} src={thumbnail} alt={thumbnail} className='size-[84px] max-h-[84px] min-h-[84px] min-w-[84px] max-w-[84px] object-cover' />
      </div>
      {/* Voucher content  */}
      <div className={`flex size-full items-center justify-between gap-2 rounded-e-lg bg-white px-3 py-2`}>
        <div className='flex h-full flex-col justify-between'>
          <div className='flex flex-col'>
            <p className='text-sm font-bold'>{title}</p>
            <p className='line-clamp-2 text-xs'>{description}</p>
          </div>
          <p className='text-xs text-primary-gray'>Hết hạn sau: {expiryDate}</p>
        </div>
        <div className='relative'>
          <ButtonOnlyIcon onClick={() => onSelect(id)} disableAnimation>
            {isSelected ? <TickCircle size={24} variant='Bold' className='text-primary-green' /> : <AddCircle size={24} className='text-primary-gray' />}
          </ButtonOnlyIcon>
          {isSelected && <TicketAnimation />}
        </div>
      </div>
    </div>
  )
}

export default memo(VoucherItem)