import instance from '@/services/axiosConfig'

const getVouchers = async () => {
  try {
    const { data } = await instance.get('/voucher')
    return data
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    throw error
  }
}

const handleAddVoucher = async (id: number | number[]) => {
  try {
    const { data } = await instance.post('/voucher/add', {
      voucherId: id
    })
    return data
  } catch (error) {
    console.error('Error adding voucher:', error)
    throw error
  }
}

export { getVouchers, handleAddVoucher }
