import { PADDING_OF_TICKET_DETAIL, STATUS_OF_VOUCHER, WITDH_OF_BORDER_DOTS } from '@/constants'
import { Coupon } from '@/types'
import { AddCircle } from 'iconsax-react'
import { memo } from 'react'
import { ButtonOnlyIcon } from '../Buttons'
import ImageCustom from '../ImageCustom'
import TicketAnimation from '../TicketAnimation'
import { translate } from '@/context/translationProvider'
import { TickIcon } from '@/components/Icons'

type VoucherItemProps = Coupon & { selected: number | number[] | null; onSelect: (id: number) => void; isReadOnlyMode: boolean }
const VoucherItem: React.FC<VoucherItemProps> = ({ id, selected, onSelect, image, isReadOnlyMode, conditions, total_discount, end_date, type }) => {
  const t = translate('Home')

  const isHaveSelected = selected !== null

  const isSelected = Array.isArray(selected) ? selected?.includes(id) : selected === id

  const renderTypeText = (typeVoucher: Coupon['type']) => {
    switch (typeVoucher) {
      case STATUS_OF_VOUCHER.PERCENT_MAX_AMOUNT:
        return `${t?.text10} ${total_discount?.percent}% ${t?.text11} ${total_discount?.price?.toLocaleString()}đ`
      case STATUS_OF_VOUCHER.FIXED_AMOUNT:
        return `${t?.text10} ${total_discount?.price?.toLocaleString()}đ`
      case 'PERCENT_UNLIMITED':
        return `${t?.text10} ${total_discount?.percent}%`
      default:
        return ''
    }
  }

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
        <ImageCustom height={84} width={84} src={image} alt={image} className='size-[84px] max-h-[84px] min-h-[84px] min-w-[84px] max-w-[84px] object-cover' />
      </div>
      {/* Voucher content  */}
      <div className={`flex size-full items-center justify-between gap-2 rounded-e-lg bg-white px-3 py-2`}>
        <div className='flex h-full flex-col justify-between'>
          <div className='flex flex-col'>
            <p className='text-sm font-bold'>{renderTypeText(type)}</p>
            <p className='line-clamp-2 text-xs'>{`${conditions?.first_order ? t?.text8 : `${t?.text9} ${conditions?.price_order?.toLocaleString()}đ`} `}</p>
          </div>
          <p className='text-xs text-primary-gray'>{`${t?.text7}: ${end_date.split('-').join('.')}`}</p>
        </div>
        <div className='relative'>
          {!isReadOnlyMode && (
            <ButtonOnlyIcon onClick={() => onSelect(id)} disableAnimation>
              {isSelected ? <TickIcon className='size-6' /> : <AddCircle size={24} variant='Bold' className='text-primary-gray/50' />}
            </ButtonOnlyIcon>
          )}
          {isSelected && <TicketAnimation />}
        </div>
      </div>
    </div>
  )
}

export default memo(VoucherItem)
