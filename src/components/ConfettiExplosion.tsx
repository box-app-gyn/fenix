import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiExplosionProps {
  trigger: boolean
  onComplete?: () => void
}

export default function ConfettiExplosion({ trigger, onComplete }: ConfettiExplosionProps) {
  const hasExploded = useRef(false)

  useEffect(() => {
    if (trigger && !hasExploded.current) {
      hasExploded.current = true
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#ec4899', '#a21caf', '#06b6d4', '#fde047', '#fff'],
        scalar: 1.2,
        zIndex: 9999
      })
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 1800)
    }
  }, [trigger, onComplete])

  return null
} 