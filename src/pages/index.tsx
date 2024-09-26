import { getVouchers, handleAddVoucher } from '@/apis'
import { ButtonOnlyIcon } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import SkeletonVoucherItem from '@/components/SkeletonVoucherItem'
import ToastComponent from '@/components/ToastComponent'
import VoucherItem from '@/components/VoucherItem'
import { keyPossmessage, STATUS_OF_VOUCHER_APPLY } from '@/constants'
import { translate } from '@/context/translationProvider'
import { Coupon } from '@/types'
import { postMessageCustom } from '@/utils'

import { Button, Input } from '@nextui-org/react'
import { ArrowLeft2, TicketDiscount } from 'iconsax-react'
import { useCallback, useEffect, useState } from 'react'

const Home = () => {
  const t = translate('Home')

  const queryParams = new URLSearchParams(location.search)
  const orderId = Number(queryParams.get('orderId'))
  const isReadOnlyMode = queryParams.get('orderId') === null
  const [voucherData, setVoucherData] = useState<Coupon[] | null>(null)
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | number[] | null>(null)
  const [preSelectedId, setPreSelectedId] = useState<number | number[] | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isAddingVoucher, setIsAddingVoucher] = useState(false)

  // call from api to get voucher selected to check handle submit if voucherSelected
  const [voucherSelectedIdFormApi, setVoucherSelectedIdFormApi] = useState<number | null>(null)

  // This function has been moved to the APIs file
  const handleFetchVoucher = useCallback(async () => {
    try {
      const data = await getVouchers({ orderId })

      const isItemSelected = data.find((item: Coupon) => item.is_selected === true)

      if (isItemSelected) {
        setSelectedVoucherId(isItemSelected.id)
        // Move the selected item to the beginning of the array
        setVoucherSelectedIdFormApi(isItemSelected.id)
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
    postMessageCustom({
      message: keyPossmessage.VOUCHER_ADDED
    })
  }, [])

  const handleCanPop = () => {
    postMessageCustom({
      message: keyPossmessage.CAN_POP
    })
  }

  const handleToastVoucherAdded = () => {
    ToastComponent({
      message: t?.text5,
      type: 'info'
    })
  }

  // search voucher
  const handleSearch = () => {
    if (searchValue === '') return
    const isItemSelected = voucherData?.find((item: Coupon) => item?.is_selected == true)

    if (searchValue === isItemSelected?.code) {
      setSelectedVoucherId(isItemSelected?.id)
      setPreSelectedId(null)
      setSearchValue('')
      handleToastVoucherAdded()
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
      handleCloseWebview()
    } catch (error: any) {
      if (selectedVoucherId === null) return handleCanPop()
      ToastComponent({
        message: error.response.data.message.replace('"', ''),
        type: 'error'
      })
    } finally {
      setIsAddingVoucher(false)
    }
  }

  console.log({ voucherSelectedIdFormApi, selectedVoucherId, preSelectedId })

  const handleToggleApplyVoucher = () => {
    const isItemSelected = voucherData?.find((item: Coupon) => item.is_selected == true)

    // chưa có thao tác nào nên => canpop
    if (preSelectedId === null) return handleCanPop()
    // không có dữ liệu => canPop
    if (selectedVoucherId === null && preSelectedId === null && isItemSelected === undefined) return handleCanPop()
    //Chọn lại voucher cũ => canPop
    if (selectedVoucherId === isItemSelected?.id) return handleCanPop()
    // voucher đã được chọn trùng với voucher được lấy từ api => canPop
    if (voucherSelectedIdFormApi === isItemSelected?.id) return handleCanPop()

    // if (!!isItemSelected && preSelectedId === null) {
    //   handleCloseWebview()
    //   console.log('456')
    // } else {
    //   // to call api toggle apply voucher (handleToggleApplyVoucherApi)
    //   setIsAddingVoucher(true)
    // }
    setIsAddingVoucher(true)
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
      <div className='flex h-full w-full flex-col'>
        <header className='flex items-center justify-between p-4'>
          <ButtonOnlyIcon onClick={handleCanPop}>
            <ArrowLeft2 size={24} />
          </ButtonOnlyIcon>
          <p className='font-bold'>{t?.text1}</p>
          <span className='opacity-0'>
            <ArrowLeft2 />
          </span>
        </header>
        <div className='relative flex h-full flex-col justify-between'>
          <div className='flex h-full max-h-[calc(100dvh-152px)] w-full flex-col items-center gap-4 overflow-y-auto p-4'>
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
              Array.from({ length: 7 }).map((_, index) => <SkeletonVoucherItem key={index} />)
            ) : !!voucherData?.length ? (
              voucherData?.map((item) => <VoucherItem {...item} key={item?.id} isReadOnlyMode={isReadOnlyMode} selected={selectedVoucherId} onSelect={() => handleSelectVoucher(item?.id)} />)
            ) : (
              <div className='flex h-full flex-1 flex-col items-center justify-center'>
                <div className='flex h-full flex-col items-center justify-center gap-2'>
                  <ImageFallback src={'./no-voucher.png'} alt='no-voucher' width={200} height={200} />
                  <p className='text-sm text-primary-gray'>{t?.text3}.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='sticky bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-white py-4'>
        <Button isLoading={isAddingVoucher} onPress={handleToggleApplyVoucher} className='mx-auto mb-2 w-[90%] rounded-full bg-primary-yellow font-bold text-primary-black'>
          {t?.text4}
        </Button>
      </div>
    </div>
  )
}

export default Home
