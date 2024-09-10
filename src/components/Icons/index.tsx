import * as React from 'react'
import { motion } from 'framer-motion'
import { IconSvgProps } from '@/types'

export const Logo: React.FC<IconSvgProps> = ({ size = 36, height, ...props }) => (
  <svg fill='none' height={size || height} viewBox='0 0 32 32' width={size || height} {...props}>
    <path
      clipRule='evenodd'
      d='M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z'
      fill='currentColor'
      fillRule='evenodd'
    />
  </svg>
)
const icon = {
  hidden: {
    pathLength: 0,
    fill: 'rgba(255, 255, 255, 0)'
  },
  visible: {
    pathLength: 1,
    fill: 'rgba(255, 255, 255, 1)'
  }
}
export const TickIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        d='M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm4.78 7.7-5.67 5.67a.75.75 0 0 1-1.06 0l-2.83-2.83a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 5.14-5.14c.29-.29.77-.29 1.06 0 .29.29.29.76 0 1.06Z'
        fill='#00c070'
      />
    </svg>
  )
}
