import { PADDING_OF_TICKET_DETAIL, WITDH_OF_BORDER_DOTS } from '@/constants'
import { memo, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

const TicketAnimation = () => {
  const controls = useAnimation()

  useEffect(() => {
    const animateTicket = async () => {
      await controls.start({ y: -40 })
      await controls.start({ y: -100, opacity: 0 })
    }
    animateTicket()
  }, [controls])

  return (
    <motion.div initial={{ y: -20, x: -14, zIndex: 60 }} animate={controls} transition={{ duration: 0.3 }} className='absolute flex items-center gap-1'>
      <p className='text-primary-blue'>+</p>
      <div className='inset-0 top-1/2 z-50 grid h-[25px] w-[35px] grid-cols-3 items-center justify-center gap-0.5 overflow-hidden rounded-e-lg bg-white'>
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
      </div>
    </motion.div>
  )
}

export default memo(TicketAnimation)
