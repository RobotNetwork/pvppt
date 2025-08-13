import React from 'react'
import { headerStyles } from './Header.styles'

const Header: React.FC = () => {
  return (
    <header className="site-header">
      <style>{headerStyles}</style>
      <div className="header-inner">
        <div className="brand">
          <div className="brand-logo" />
          <div>
            <div className="brand-title">PvP Performance Tracker</div>
            <div className="subtitle">Paste your fight data to view detailed metrics</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header


