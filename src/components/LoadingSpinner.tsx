

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-t-2 border-b-2',
    md: 'h-12 w-12 border-t-4 border-b-4',
    lg: 'h-16 w-16 border-t-4 border-b-4'
  }

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-pink-500 border-opacity-50 shadow-[0_0_20px_rgba(236,72,153,0.5)] ${sizeClasses[size]} ${className}`}
      />
    </div>
  )
} 