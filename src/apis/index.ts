import instance from '@/services/axiosConfig'

const getVouchers = async ({ orderId, searchValue }: { orderId: number; searchValue?: string }) => {
  try {
    const params = searchValue ? { code: searchValue } : undefined
    const { data } = await instance.get(`/vouchers/available/${orderId}`, {
      params
    })
    return data
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    throw error
  }
}

const handleAddVoucher = async ({ orderId, id, status }: { orderId: number; id: number | number[]; status: 0 | 1 }) => {
  try {
    const { data } = await instance.put(`/booking/voucher/${orderId}`, {
      voucher_id: id,
      status
    })
    return data
  } catch (error) {
    console.error('Error adding voucher:', error)
    throw error
  }
}

export { getVouchers, handleAddVoucher }
