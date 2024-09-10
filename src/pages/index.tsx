import { getVouchers, handleAddVoucher } from '@/apis'
import { ButtonOnlyIcon } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import SkeletonVoucherItem from '@/components/SkeletonVoucherItem'
import ToastComponent from '@/components/ToastComponent'
import VoucherItem from '@/components/VoucherItem'
import { keyPossmessage, STATUS_OF_VOUCHER_APPLY } from '@/constants'
import { translate } from '@/context/translationProvider'
import { Coupon } from '@/types'
import { Button, Input } from '@nextui-org/react'
import { ArrowLeft2, TicketDiscount } from 'iconsax-react'
import { useCallback, useEffect, useState } from 'react'

const Home = () => {
  const queryParams = new URLSearchParams(location.search)
  const orderId = Number(queryParams.get('orderId'))
  const isReadOnlyMode = queryParams.get('isReadOnlyMode') === 'true'

  const [voucherData, setVoucherData] = useState<Coupon[] | null>(null)
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | number[] | null>(null)
  const [preSelectedId, setPreSelectedId] = useState<number | number[] | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isAddingVoucher, setIsAddingVoucher] = useState(false)
  const t = translate('Home')

  // This function has been moved to the APIs file
  const handleFetchVoucher = useCallback(async () => {
    try {
      const data = await getVouchers({ orderId })

      const isItemSelected = data.find((item: Coupon) => item.is_selected === true)

      if (isItemSelected) {
        setSelectedVoucherId(isItemSelected.id)
        // Move the selected item to the beginning of the array
        const reorderedData = [isItemSelected, ...data.filter((item: Coupon) => item.id !== isItemSelected.id)]
        setVoucherData(reorderedData)
      } else {
        setVoucherData(data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }, [])

  // Function to handle voucher selection
  const handleSelectVoucher = useCallback((id: number) => {
    if (isReadOnlyMode) return
    // if (fakeData?.multiMode === MULTI_MODE.SINGLE) {
    // In single mode, toggle selection of the voucher
    setSelectedVoucherId((prevId) => (id === prevId ? null : id))
    setPreSelectedId(id)
    // } else if (fakeData?.multiMode === MULTI_MODE.MULTI) {
    //   // In multi mode, handle multiple selections
    //   setSelectedVoucherId((prevId) => {
    //     if (prevId === null) return [id] // If no selection, create new array with id
    //     if (typeof prevId === 'number') return prevId === id ? null : [prevId, id] // If single selection, toggle or add new id
    //     if (prevId.includes(id)) return prevId.filter((vId) => vId !== id) // If id already selected, remove it
    //     return [...prevId, id] // Otherwise, add new id to selection array
    //   })
    // }
  }, [])

  const handleCloseWebview = useCallback(() => {
    postMessage({
      type: keyPossmessage.CAN_POP
    })
  }, [])

  const handleToastVoucherAdded = () => {
    ToastComponent({
      message: t?.text5,
      type: 'info'
    })
  }

  // search voucher
  const handleSearch = () => {
    if (searchValue === '') return
    const isItemSelected = voucherData?.find((item: Coupon) => item.is_selected == true)

    if (searchValue === isItemSelected?.code) {
      setSelectedVoucherId(isItemSelected?.id)
      setPreSelectedId(null)
      console.log('123')
      return handleToastVoucherAdded()
    }
    setIsSearching(true)
  }

  const handleCallApiSearchVoucher = async () => {
    try {
      const data: Coupon = await getVouchers({ orderId, searchValue })
      setVoucherData((prev) => {
        const existingVoucher = prev?.find((voucher) => voucher?.id === data?.id)
        if (!existingVoucher) {
          return [data, ...(prev || [])]
        }
        return prev
      })
      setSelectedVoucherId(data?.id)
      setPreSelectedId(data?.id)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSearching(false)
      setSearchValue('')
    }
  }

  const handleChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleToggleApplyVoucherApi = async () => {
    try {
      // create preSelectedId to store id of voucher
      await handleAddVoucher({ orderId, id: preSelectedId || 0, status: selectedVoucherId === null ? STATUS_OF_VOUCHER_APPLY.REMOVE : STATUS_OF_VOUCHER_APPLY.APPLY })

      setSelectedVoucherId(null)
      setPreSelectedId(null)
    } catch (error) {
      console.log(error)
    } finally {
      setIsAddingVoucher(false)
      handleCloseWebview()
    }
  }

  const handleToggleApplyVoucher = () => {
    const isItemSelected = voucherData?.find((item: Coupon) => item.is_selected == true)

    if (selectedVoucherId === isItemSelected?.id) return handleToastVoucherAdded()

    if (!!isItemSelected && preSelectedId === null) {
      postMessage({
        type: keyPossmessage.VOUCHER_ADDED
      })
    } else {
      setIsAddingVoucher(true)
    }
  }

  // fetch voucher4
  useEffect(() => {
    setIsFetching(true)
  }, [])

  useEffect(() => {
    isFetching && handleFetchVoucher()
  }, [isFetching])

  useEffect(() => {
    isAddingVoucher && handleToggleApplyVoucherApi()
  }, [isAddingVoucher])

  useEffect(() => {
    isSearching && handleCallApiSearchVoucher()
  }, [isSearching])

  return (
    <div className='flex h-dvh w-full flex-col'>
      <header className='flex items-center justify-between p-4'>
        <ButtonOnlyIcon onClick={handleCloseWebview}>
          <ArrowLeft2 size={24} />
        </ButtonOnlyIcon>
        <p className='font-bold'>{t?.text1}</p>
        <span className='opacity-0'>
          <ArrowLeft2 />
        </span>
      </header>
      <div className='flex h-full flex-col justify-between'>
        <div className='flex w-full flex-col items-center justify-center gap-4 p-4'>
          {!isReadOnlyMode && (
            <div className='w-full'>
              <Input
                placeholder={t?.text6}
                value={searchValue}
                onChange={handleChangeSearchValue}
                startContent={<TicketDiscount className='flex flex-shrink-0 text-[#a6a6a6]' size={24} />}
                endContent={
                  <Button isLoading={isSearching} className='h-[34px] min-w-[96px] rounded-lg bg-primary-black px-2 py-4 text-sm font-bold text-white' onPress={handleSearch}>
                    {t?.text2}
                  </Button>
                }
                classNames={{
                  base: 'bg-[#F8F8F8]',
                  inputWrapper:
                    'bg-[#F8F8F8] shadow-none group-data-[focus-visible=true]:ring-none group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visi9ble=true]:ring-offset-background data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
                  mainWrapper: 'min-h-14 items-center justify-center'
                }}
              />
            </div>
          )}
          {isFetching ? (
            Array.from({ length: 6 }).map((_, index) => <SkeletonVoucherItem key={index} />)
          ) : !!voucherData?.length ? (
            voucherData?.map((item) => <VoucherItem {...item} key={item?.id} isReadOnlyMode={isReadOnlyMode} selected={selectedVoucherId} onSelect={() => handleSelectVoucher(item?.id)} />)
          ) : (
            <div className='flex flex-col items-center justify-center gap-2'>
              <ImageFallback src={'./no-voucher.png'} alt='no-voucher' width={200} height={200} />
              <p className='text-sm text-primary-gray'>{t?.text3}.</p>
            </div>
          )}
        </div>
        <Button isLoading={isAddingVoucher} onPress={handleToggleApplyVoucher} className='mx-auto mb-2 w-[90%] rounded-full bg-primary-yellow font-bold text-primary-black'>
          {t?.text4}
        </Button>
      </div>
    </div>
  )
}

export default Home
