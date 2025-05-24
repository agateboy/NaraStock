import React, { useEffect, useState } from 'react'
import ApexChart from 'react-apexcharts'
import './prediksi.css'

const currencyPairs = {
  'EUR/USD': 'EURUSD=X',
  'USD/JPY': 'USDJPY=X',
  'AUD/USD': 'AUDUSD=X',
  'GBP/USD': 'GBPUSD=X',
  'NZD/USD': 'NZDUSD=X'
}

export default function Prediksi({ onBack }) {
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const symbol = currencyPairs[selectedPair]
    fetch(`http://localhost:5000/api/forex?symbol=${symbol}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(d => ({
          x: new Date(d.Datetime),
          y: [d.Open, d.High, d.Low, d.Close]
        }))
        setChartData(formatted)
      })
  }, [selectedPair])

  const series = [{ data: chartData }]

  const options = {
    chart: { type: 'candlestick', height: 350 },
    title: { text: `${selectedPair} Candlestick Chart`, align: 'left' },
    xaxis: { type: 'datetime' },
    yaxis: { tooltip: { enabled: true } }
  }

  return (
    <div className="prediksi-container">
      <header className="prediksi-header">
        <button className="toggle-btn" onClick={onBack}>Kembali</button>
        <h1>Halaman Prediksi</h1>
      </header>

      <main className="prediksi-main">
        <div className="pair-toggle">
          {Object.keys(currencyPairs).map(pair => (
            <button
              key={pair}
              className={`toggle-btn ${selectedPair === pair ? 'active' : ''}`}
              onClick={() => setSelectedPair(pair)}
            >
              {pair}
            </button>
          ))}
        </div>

        <ApexChart options={options} series={series} type="candlestick" height={350} />
      </main>
    </div>
  )
}
