import { PADDING_OF_TICKET_DETAIL, WITDH_OF_BORDER_DOTS } from '@/constants'
import { memo, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

const TicketAnimation = () => {
  const controls = useAnimation()

  useEffect(() => {
    const animateTicket = async () => {
      await controls.start({ y: -40, opacity: 1 })
      await controls.start({ y: -100, opacity: 0 })
    }
    animateTicket()
  }, [controls])

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={controls}
      transition={{ duration: 0.3 }}
      className='absolute inset-0 top-1/2 z-50 grid h-[25px] w-10 grid-cols-3 items-center justify-center gap-0.5 overflow-hidden rounded-e-lg bg-white'
    >
      <div className='relative size-full bg-primary-yellow'>
        <div
          style={{
            borderLeft: `${WITDH_OF_BORDER_DOTS}px dotted #fff`,
            transform: `translateY(${WITDH_OF_BORDER_DOTS}px) translateX(-${WITDH_OF_BORDER_DOTS / 2}px)`,
            height: `calc(100% - ${PADDING_OF_TICKET_DETAIL}px)`
          }}
          className={`absolute inset-0`}
        />
      </div>
      <div className='col-span-2 flex size-full items-center justify-center bg-primary-yellow text-sm text-white'>%</div>
    </motion.div>
  )
}

export default memo(TicketAnimation)
