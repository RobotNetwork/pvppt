import React from 'react'
import type { ButtonProps } from './Button.types'
import { buttonStyles } from './Button.styles'

const Button: React.FC<ButtonProps> = ({ variant = 'secondary', isLoading = false, leftIcon, rightIcon, children, className = '', disabled, ...rest }) => {
  const classes = `btn btn-${variant} ${className}`.trim()
  return (
    <button className={classes} disabled={disabled || isLoading} {...rest}>
      <style>{buttonStyles}</style>
      {isLoading && <span className="spinner" aria-hidden />}
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  )
}

export default Button


