import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GamifiedCTAProps {
  href: string
  children: React.ReactNode
  tooltipText?: string
  className?: string
}

export default function GamifiedCTA({ href, children, tooltipText, className = '' }: GamifiedCTAProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = (event: React.MouseEvent) => {
    // Adicionar efeito de clique gamificado
    const button = document.createElement('div')
    button.className = 'fixed pointer-events-none z-50'
    button.innerHTML = '✨'
    button.style.left = event.clientX + 'px'
    button.style.top = event.clientY + 'px'
    button.style.fontSize = '24px'
    button.style.color = '#ec4899'
    button.style.textShadow = '0 0 10px rgba(236, 72, 153, 0.8)'
    
    document.body.appendChild(button)
    
    // Animação do efeito
    button.animate([
      { transform: 'scale(0) rotate(0deg)', opacity: 1 },
      { transform: 'scale(1.5) rotate(180deg)', opacity: 0 }
    ], {
      duration: 1000,
      easing: 'ease-out'
    }).onfinish = () => {
      document.body.removeChild(button)
    }

    // Redirecionar após pequeno delay
    setTimeout(() => {
      window.open(href, '_blank')
    }, 300)
  }

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => {
          setIsHovered(true)
          if (tooltipText) setShowTooltip(true)
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          setShowTooltip(false)
        }}
        className={`relative inline-flex items-center justify-center px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${className}`}
        whileHover={{
          boxShadow: '0 0 30px rgba(236, 72, 153, 0.6)',
          filter: 'brightness(1.1)'
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isHovered 
            ? '0 0 30px rgba(236, 72, 153, 0.6)' 
            : '0 0 20px rgba(236, 72, 153, 0.3)'
        }}
      >
        <span className="relative z-10">{children}</span>
        
        {/* Efeito de brilho */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        
        {/* Efeito de pulso */}
        <motion.div
          className="absolute inset-0 border-2 border-pink-400 rounded-lg"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && tooltipText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap z-50"
          >
            {tooltipText}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 