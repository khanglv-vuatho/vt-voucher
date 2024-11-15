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
        // Filter items that can be applied
        const applicableItems = data.filter((item: Coupon) => item.can_apply)
        const nonApplicableItems = data.filter((item: Coupon) => !item.can_apply)

        // Put selected item first, then applicable items, then non-applicable items
        const reorderedData = [isItemSelected, ...applicableItems.filter((item: Coupon) => item.id !== isItemSelected.id), ...nonApplicableItems]

        // const reorderedData = [isItemSelected, ...data.filter((item: Coupon) => item.id !== isItemSelected.id)]
        console.log({ reorderedData })
        setVoucherData(reorderedData)
      } else {
        const data1 = [
          {
            id: 184,
            type: 'PERCENT_UNLIMITED',
            conditions: {
              price_order: 1000
            },
            total_discount: {
              percent: 10
            },
            quantity: 5,
            code: 'a134752c',
            image: 'https://cdn-sandbox.vuatho.com/image/99bbdd69-6d0a-4d6a-89e8-61cb8eec88f4_1731642473048.jpg',
            end_date: '15-11-2024',
            can_apply: true,
            status: 1,
            is_selected: false
          },
          {
            id: 185,
            type: 'FIXED_AMOUNT',
            conditions: {
              first_order: true
            },
            total_discount: {
              price: 10000
            },
            quantity: 10,
            code: 'da43ea2b',
            image: 'https://cdn-sandbox.vuatho.com/image/c6fa8fd0-817a-4772-be41-db5e53e7ac2d_1731642481708.jpg',
            end_date: '16-11-2024',
            can_apply: false,
            status: 1,
            is_selected: false
          },
          {
            id: 186,
            type: 'PERCENT_UNLIMITED',
            conditions: {
              first_order: true
            },
            total_discount: {
              percent: 50
            },
            quantity: 2,
            code: 'b6a64674',
            image: 'https://cdn-sandbox.vuatho.com/image/d5ec0ebb-ac87-472a-bfab-a0e2668fe5c4_1731642556483.jpg',
            end_date: '16-11-2024',
            can_apply: false,
            status: 1,
            is_selected: false
          },
          {
            id: 188,
            type: 'PERCENT_MAX_AMOUNT',
            conditions: {
              price_order: 100000
            },
            total_discount: {
              price: 10000,
              percent: 50
            },
            quantity: 11,
            code: 'f4d0ff5e',
            image: 'https://cdn-sandbox.vuatho.com/image/27aa1c4a-a571-4f2e-9bf9-f5869a75f273_1731642618414.jpg',
            end_date: '16-11-2024',
            can_apply: true,
            status: 1,
            is_selected: false
          },
          {
            id: 182,
            type: 'FIXED_AMOUNT',
            conditions: {
              industries: [
                {
                  id: 21,
                  name: 'Điện lạnh'
                }
              ]
            },
            total_discount: {
              price: 10000
            },
            quantity: 1,
            code: 'a15c5660',
            image: 'https://cdn-sandbox.vuatho.com/image/b1fd3881-5323-4ce7-9261-dd4c919e3655_1731640833326.jpg',
            end_date: '16-11-2024',
            can_apply: true,
            status: 1,
            is_selected: false
          },
          {
            id: 181,
            type: 'FIXED_AMOUNT',
            conditions: {
              price_order: 200000
            },
            total_discount: {
              price: 50000
            },
            quantity: 1,
            code: 'b50ecb17',
            image: 'https://cdn-sandbox.vuatho.com/image/a76c5def-bec0-4541-b532-0007e74d9a2d_1731639155949.jpg',
            end_date: '16-11-2024',
            can_apply: false,
            status: 1,
            is_selected: false
          },
          {
            id: 180,
            type: 'FIXED_AMOUNT',
            conditions: {
              price_order: 50000
            },
            total_discount: {
              price: 10000
            },
            quantity: 1,
            code: '9c3c9607',
            image: 'https://cdn-sandbox.vuatho.com/image/2aec9e21-f87a-44ae-b389-1d28a3dc2b33_1731639026382.jpg',
            end_date: '16-11-2024',
            can_apply: true,
            status: 1,
            is_selected: false
          }
        ]

        // Filter can_apply first, then sort by non-can_apply
        const sortedData = [...data?.filter((item: Coupon) => item?.can_apply), ...data?.filter((item: Coupon) => !item?.can_apply)]

        setVoucherData(sortedData)
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
      if ((data as any).length === 0 || data?.can_apply === false) return ToastComponent({ message: 'Voucher không tồn tại', type: 'error' })
      setVoucherData((prev) => {
        const existingVoucher = prev?.find((voucher) => voucher?.id === data?.id)
        if (!existingVoucher) {
          return [data, ...(prev || [])]
        }
        return [existingVoucher, ...(prev || [])]
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
    if (preSelectedId === null) {
      handleCanPop()
      console.log('preSelectedId === null')
      return
    }
    // không có dữ liệu => canPop
    if (selectedVoucherId === null && preSelectedId === null && isItemSelected === undefined) {
      handleCanPop()
      console.log('selectedVoucherId === null && preSelectedId === null && isItemSelected === undefined')
      return
    }
    //Chọn lại voucher cũ => canPop
    if (selectedVoucherId === isItemSelected?.id) {
      handleCanPop()
      console.log('selectedVoucherId === isItemSelected?.id')
      return
    }
    // voucher đã được chọn trùng với voucher được lấy từ api => canPop
    if (voucherSelectedIdFormApi === selectedVoucherId) {
      handleCanPop()
      console.log('voucherSelectedIdFormApi === isItemSelected?.id')
      return
    }

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
