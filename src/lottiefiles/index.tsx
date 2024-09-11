import lottie from 'lottie-web'
import { memo, useEffect, useRef } from 'react'

import animationJson from '@/lottiefiles/tick.json'

type Props = { className?: string }
const RenderTickLottieFile = ({ className }: Props) => {
  return <TickLottieFile className={className} />
}

const TickLottieFile = ({ className }: Props) => {
  const container = useRef(null)
  useEffect(() => {
    const instance = lottie.loadAnimation({
      container: container.current!,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationJson
    })

    return () => instance.destroy()
  }, [])

  return <div ref={container} className={className} />
}

export default memo(RenderTickLottieFile)
