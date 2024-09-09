import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type TPostMessage = { message: string; data?: any }

export type Voucher = {
  id: number
  thumbnail: string
  discount: number
  description: string
  expiryDate: string
  title: string
}

type CouponType = 'FIXED_AMOUNT' | 'PERCENT_MAX_AMOUNT' | 'PERCENT_UNLIMITED'

export type Coupon = {
  id: number
  type: CouponType
  conditions: {
    price_order?: number
    first_order?: boolean
    industry_id?: number[]
  }
  total_discount: {
    price?: number
    percent?: number
  }
  status: number
  code: string
  quantity: number
  image: string
  end_date: string
  is_selected: boolean
}
