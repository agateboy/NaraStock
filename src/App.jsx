import React, { useState } from 'react'
import heroImage from './assets/homenarastock.png'
import Prediksi from './prediksi'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showPrediksi, setShowPrediksi] = useState(false) // State to control showing Prediksi

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleOpenPrediksi = () => {
    setShowPrediksi(true) // Set to true to show Prediksi
  }

  const handleBack = () => {
    setShowPrediksi(false) // Set to false to go back to main content
  }

  if (showPrediksi) {
    return <Prediksi onBack={handleBack} /> // Render Prediksi component
  }

  return (
    <>
      <header>
        <div className="logo" aria-label="Narastock logo">narastock</div>

        <nav className={menuOpen ? 'open' : ''} aria-label="Primary Navigation">
          <a href="#" tabIndex={menuOpen ? 0 : -1}>Home</a>
          <a href="#" tabIndex={menuOpen ? 0 : -1}>Fitur</a>
          <a href="#" tabIndex={menuOpen ? 0 : -1}>Education</a>
          <a href="#" tabIndex={menuOpen ? 0 : -1}>Prediksi</a>
          <a href="#" tabIndex={menuOpen ? 0 : -1}>Tentang</a>
          <a href="#" tabIndex={menuOpen ? 0 : -1}>Contact</a>
          <button
            className="subscribe-btn"
            tabIndex={menuOpen ? 0 : -1}
            aria-label="Subscribe"
          >
            Subscribe
          </button>
        </nav>

        <button
          className={`menu-toggle${menuOpen ? ' open' : ''}`}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <main>
        <h1>
          Prediksi Pasar Saham <br /> Mingguan Untuk
        </h1>
        <h2>Investor Pemula</h2>
        <p>
          Mudahkan keputusan investasi Anda dengan prediksi yang sederhana, akurat, dan mudah dipahami.
        </p>

        <div className="buttons">
          <button className="btn-primary" aria-label="Mulai Prediksi" onClick={handleOpenPrediksi}>
            Mulai Prediksi
          </button>
          <button className="btn-primary" aria-label="Pelajari Fitur">
            Pelajari Fitur
          </button>
        </div>

        <img
          src={heroImage}
          alt="Stock monitor"
          className="hero-image"
          draggable={false}
          loading="lazy"
        />
      </main>
    </>
  )
}

export default App
