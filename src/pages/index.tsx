import { getVouchers, handleAddVoucher } from '@/apis'
import { ButtonOnlyIcon } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import SkeletonVoucherItem from '@/components/SkeletonVoucherItem'
import VoucherItem from '@/components/VoucherItem'
import { keyPossmessage, MULTI_MODE } from '@/constants'
import instance from '@/services/axiosConfig'
import { Voucher } from '@/types'
import { ArrowLeft2 } from 'iconsax-react'
import { useCallback, useEffect, useState } from 'react'

const voucherData = [
  {
    id: 1,
    thumbnail: 'https://picsum.photos/200/300?random=1',
    discount: 100,
    description: 'Đơn tối thiểu 100k',
    expiryDate: '31.12.2024',
    title: 'Giảm 100% tối đa 50k'
  },
  {
    id: 2,
    thumbnail: 'https://picsum.photos/200/300?random=2',
    discount: 50,
    description: 'Đơn tối thiểu 200k',
    expiryDate: '15.01.2025',
    title: 'Giảm 50% tối đa 100k'
  },
  {
    id: 3,
    thumbnail: 'https://picsum.photos/200/300?random=3',
    discount: 25,
    description: 'Đơn tối thiểu 300k',
    expiryDate: '28.02.2025',
    title: 'Giảm 25% tối đa 75k'
  },
  {
    id: 4,
    thumbnail: 'https://picsum.photos/200/300?random=4',
    discount: 75,
    description: 'Đơn tối thiểu 400k',
    expiryDate: '31.03.2025',
    title: 'Giảm 75% tối đa 150k'
  },
  {
    id: 5,
    thumbnail: 'https://picsum.photos/200/300?random=5',
    discount: 30,
    description: 'Đơn tối thiểu 500k',
    expiryDate: '30.04.2025',
    title: 'Giảm 30% tối đa 200k'
  }
]

const fakeData = {
  voucherData,
  multiMode: MULTI_MODE.SINGLE
}

const Index = () => {
  const [voucherData, setVoucherData] = useState<Voucher[] | null>(null)
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | number[] | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isAddingVoucher, setIsAddingVoucher] = useState(false)
  const queryParams = new URLSearchParams(location.search)
  const isReadOnlyMode = !!queryParams.get('orderId')
  // This function has been moved to the APIs file
  const handleFetchVoucher = useCallback(async () => {
    try {
      // const data = await getVouchers()
      // setVoucherData([])
      setVoucherData(fakeData?.voucherData)
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }, [])
  const handleAddVoucherApi = useCallback(async () => {
    if (selectedVoucherId === null) return
    try {
      const data = await handleAddVoucher(selectedVoucherId)
      console.log({ data })
    } catch (error) {
      console.log(error)
    } finally {
      setIsAddingVoucher(false)
    }
  }, [])

  // fetch voucher
  useEffect(() => {
    isFetching && handleFetchVoucher()
  }, [isFetching])

  useEffect(() => {
    setIsFetching(true)
  }, [])

  // add some voucher
  useEffect(() => {
    setIsFetching(true)
  }, [])

  useEffect(() => {
    isAddingVoucher && handleAddVoucherApi()
  }, [isAddingVoucher])

  // Function to handle voucher selection
  const handleSelectVoucher = useCallback((id: number) => {
    if (isReadOnlyMode) return
    if (fakeData?.multiMode === MULTI_MODE.SINGLE) {
      // In single mode, toggle selection of the voucher
      setSelectedVoucherId((prevId) => (id === prevId ? null : id))
    } else if (fakeData?.multiMode === MULTI_MODE.MULTI) {
      // In multi mode, handle multiple selections
      setSelectedVoucherId((prevId) => {
        if (prevId === null) return [id] // If no selection, create new array with id
        if (typeof prevId === 'number') return prevId === id ? null : [prevId, id] // If single selection, toggle or add new id
        if (prevId.includes(id)) return prevId.filter((vId) => vId !== id) // If id already selected, remove it
        return [...prevId, id] // Otherwise, add new id to selection array
      })
    }
    handleSelectVoucherApi(id)
  }, [])

  const handleSelectVoucherApi = useCallback(async (id: number) => {
    try {
      const data = await handleAddVoucher(id)
      console.log({ data })
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleCloseWebview = () => {
    postMessage({
      type: keyPossmessage.CAN_POP
    })
  }

  return (
    <div className='flex h-dvh w-full max-w-[440px] flex-col'>
      <header className='flex items-center justify-between p-4'>
        <ButtonOnlyIcon onClick={handleCloseWebview}>
          <ArrowLeft2 size={24} />
        </ButtonOnlyIcon>
        <p className='font-bold'>Voucher giảm giá</p>
        <span className='opacity-0'>
          <ArrowLeft2 />
        </span>
      </header>
      <div className='flex w-full flex-col items-center justify-center gap-4 p-4'>
        {isFetching ? (
          Array.from({ length: 5 }).map((_, index) => <SkeletonVoucherItem key={index} />)
        ) : !!voucherData?.length ? (
          voucherData?.map((item) => <VoucherItem key={item?.id} {...item} isReadOnlyMode={isReadOnlyMode} selected={selectedVoucherId} onSelect={() => handleSelectVoucher(item?.id)} />)
        ) : (
          <div className='flex flex-col items-center justify-center gap-2'>
            <ImageFallback src={'./no-voucher.png'} alt='no-voucher' width={200} height={200} />
            <p className='text-sm text-primary-gray'>Hiện tại bạn chưa có voucher nào.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
