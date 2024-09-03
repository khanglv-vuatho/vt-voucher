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
