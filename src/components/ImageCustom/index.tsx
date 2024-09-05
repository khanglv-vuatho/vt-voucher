import React, { useState } from 'react'
import { Image, ImageProps } from '@nextui-org/react'
import { twMerge } from 'tailwind-merge'

interface ImageCustomProps extends ImageProps {
  src: string
  className?: string
}

const ImageCustom: React.FC<ImageCustomProps> = ({ src, className }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const handleOnLoadingImage = () => {
    setIsLoadingImage(false)
  }

  return (
    <>
      <Image
        removeWrapper
        height={440}
        width={440}
        src={src + '?width=10&height=10'}
        alt={src}
        className={twMerge(`size-full min-w-[200px] object-cover blur-md ${isLoadingImage ? 'block' : 'hidden'}`, className)}
      />
      <Image
        removeWrapper
        src={src + '?width=500&height=500'}
        alt={src}
        className={twMerge(`size-full object-cover ${!isLoadingImage ? 'block' : 'hidden'}`, className)}
        onLoad={handleOnLoadingImage}
      />
    </>
  )
}

export default ImageCustom
