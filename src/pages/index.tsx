import { getVouchers, handleAddVoucher } from '@/apis'
import { ButtonOnlyIcon } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import SkeletonVoucherItem from '@/components/SkeletonVoucherItem'
import VoucherItem from '@/components/VoucherItem'
import { keyPossmessage, MULTI_MODE } from '@/constants'
import { Voucher } from '@/types'
import { Button, Input } from '@nextui-org/react'
import { ArrowLeft2, TicketDiscount } from 'iconsax-react'
import { useCallback, useEffect, useState } from 'react'

const voucherData = [
  {
    id: 1,
    thumbnail: 'https://cdn-1.vuatho.com/image/86c9267b-3ffa-4daa-8a1c-1f78646eeba1_1720667614240.jpg',
    discount: 100,
    description: 'Đơn tối thiểu 100k',
    expiryDate: '31.12.2024',
    title: 'Giảm 100% tối đa 50k'
  },
  {
    id: 2,
    thumbnail: 'https://cdn-1.vuatho.com/image/0c0a2cd7-19aa-40f0-ba32-53efe6f93ca5_1721010234509.jpeg',
    discount: 50,
    description: 'Đơn tối thiểu 200k',
    expiryDate: '15.01.2025',
    title: 'Giảm 50% tối đa 100k'
  },
  {
    id: 3,
    thumbnail: 'https://cdn-1.vuatho.com/image/064c216c-a372-4b59-be91-45a26687bddf_1721100386372.heic',
    discount: 25,
    description: 'Đơn tối thiểu 300k',
    expiryDate: '28.02.2025',
    title: 'Giảm 25% tối đa 75k'
  },
  {
    id: 4,
    thumbnail: 'https://cdn-1.vuatho.com/image/7038274c-fb98-4be6-98e4-1fb0efeb3198_1721967622701.jpeg',
    discount: 75,
    description: 'Đơn tối thiểu 400k',
    expiryDate: '31.03.2025',
    title: 'Giảm 75% tối đa 150k'
  },
  {
    id: 5,
    thumbnail: 'https://cdn-sandbox.vuatho.com/image/41470184-b4d3-4e8d-a0a5-5cb36a6739c8_1725339102503.jpg',
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

const Home = () => {
  const queryParams = new URLSearchParams(location.search)
  const isReadOnlyMode = !!queryParams.get('orderId')

  const [voucherData, setVoucherData] = useState<Voucher[] | null>(null)
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | number[] | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isAddingVoucher, setIsAddingVoucher] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
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
      // const data = await handleAddVoucher(selectedVoucherId)
      // console.log({ data })
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

    setIsAddingVoucher(true)
  }, [])

  const handleSearch = () => {
    setIsSearching(true)
  }

  const handleCloseWebview = () => {
    postMessage({
      type: keyPossmessage.CAN_POP
    })
  }
  const handleCallApiSearchVoucher = async () => {
    try {
      const data = await getVouchers()
    } catch {
    } finally {
      setIsSearching(false)
    }
  }
  useEffect(() => {
    isSearching && handleCallApiSearchVoucher()
  }, [isSearching])

  return (
    <div className='flex h-dvh w-full flex-col'>
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
        <div className='w-full'>
          <Input
            placeholder='Nhập mã code'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            startContent={<TicketDiscount className='flex flex-shrink-0 text-[#a6a6a6]' size={24} />}
            endContent={
              <Button className='h-[34px] min-w-[96px] rounded-lg bg-primary-black px-2 py-4 text-sm font-bold text-white' onPress={handleSearch}>
                {isSearching ? '...' : 'Xác nhận'}
              </Button>
            }
            classNames={{
              base: '1 bg-[#F8F8F8]',
              clearButton: '2',
              description: '3',
              errorMessage: '4',
              helperWrapper: '5',
              innerWrapper: '6',
              input: '7',
              inputWrapper:
                '8 bg-[#F8F8F8] shadow-none group-data-[focus-visible=true]:ring-none group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-offset-background data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
              label: '9',
              mainWrapper: '10 min-h-14 items-center justify-center'
            }}
          />
        </div>
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

export default Home
