import instance from '@/services/axiosConfig'

const getVouchers = async () => {
  const { data } = await instance.get('/voucher')
  return data
}

const handleAddVoucher = async (id: number | number[]) => {
  const { data } = await instance.post('/voucher/add', {
    voucherId: id
  })
  return data
}

export { getVouchers, handleAddVoucher }
