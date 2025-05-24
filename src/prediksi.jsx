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

const indicators = ['SMA', 'EMA']

const timeframes = [
    { label: '4 Hari', value: 4 },
    { label: '7 Hari', value: 7 },
    { label: '14 Hari', value: 14 },
    { label: '30 Hari', value: 30 },
]

export default function Prediksi({ onBack }) {
    const [selectedPair, setSelectedPair] = useState('EUR/USD')
    const [selectedIndicator, setSelectedIndicator] = useState('SMA')
    const [selectedTimeframe, setSelectedTimeframe] = useState(4) // default 4 days
    const [chartData, setChartData] = useState([])
    const [indicatorData, setIndicatorData] = useState([])
    const [zoneData, setZoneData] = useState([])
    const [zoneCounts, setZoneCounts] = useState({
        FBuy: 0, FSell: 0, DBuy: 0, DSell: 0,
        FBuy_pct: 0, FSell_pct: 0, DBuy_pct: 0, DSell_pct: 0,
        FBuy_strength: 0, FSell_strength: 0, DBuy_strength: 0, DSell_strength: 0
    })

    useEffect(() => {
        const symbol = currencyPairs[selectedPair]
        const period = `${selectedTimeframe}d`

        // Fetch candlestick data
        fetch(`http://localhost:5000/api/forex?symbol=${symbol}&period=${period}`)
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(d => ({
                    x: new Date(d.Datetime),
                    y: [d.Open, d.High, d.Low, d.Close]
                }))
                setChartData(formatted)
            })

        // Fetch indicator data
        if (selectedIndicator !== 'None') {
            fetch(`http://localhost:5000/api/indicator?symbol=${symbol}&type=${selectedIndicator}&period=${period}`)
                .then(res => res.json())
                .then(data => {
                    const formatted = data.map(d => ({
                        x: new Date(d.Datetime),
                        y: d.Value
                    }))
                    setIndicatorData(formatted)
                })
        } else {
            setIndicatorData([])
        }

        // Fetch zone annotations
        fetch(`http://localhost:5000/api/zones?symbol=${symbol}&period=${period}`)
            .then(res => res.json())
            .then(zones => {
                const formattedZones = zones.map(z => ({
                    x: new Date(z.Datetime),
                    y: z.Price,
                    label: {
                        borderColor: z.type.includes('Buy') ? '#00E396' : '#FF4560',
                        style: {
                            color: '#fff',
                            background: z.type.includes('Buy') ? '#00E396' : '#FF4560'
                        },
                        text: z.type
                    }
                }))
                setZoneData(formattedZones)
            })

        // Fetch zone counts for bar chart
        fetch(`http://localhost:5000/api/zones/counts?symbol=${symbol}&period=${period}`)
            .then(res => res.json())
            .then(data => setZoneCounts(data))

    }, [selectedPair, selectedIndicator, selectedTimeframe])

    const series = [
        { name: 'Candlestick', type: 'candlestick', data: chartData },
        ...(indicatorData.length > 0
            ? [{ name: selectedIndicator, type: 'line', data: indicatorData }]
            : [])
    ]

    // Mapping untuk dataLabels formatter
    const categoryToKey = {
        FastBuy: 'FBuy',
        FastSell: 'FSell',
        DelayedBuy: 'DBuy',
        DelayedSell: 'DSell'
    }

    const options = {
        chart: { height: 350, type: 'candlestick' },
        title: {
            text: `${selectedPair} Candlestick Chart with ${selectedIndicator}`,
            align: 'left',
            style: { fontSize: '16px', fontWeight: 'bold', color: 'white' }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#ffffff'
                }
            }
        },
        yaxis: {
            tooltip: { enabled: true },
            labels: {
                style: {
                    colors: '#ffffff'
                }
            }
        },
        legend: {
            labels: {
                colors: '#ffffff'
            }
        },
        annotations: {
            points: zoneData
        }
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

                <div className="indicator-select">
                    <label>Pilih Indikator: </label>
                    <select
                        value={selectedIndicator}
                        onChange={e => setSelectedIndicator(e.target.value)}
                    >
                        {indicators.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>

                <div className="timeframe-select" style={{ marginTop: '1rem' }}>
                    <label>Pilih Timeframe: </label>
                    <select
                        value={selectedTimeframe}
                        onChange={e => setSelectedTimeframe(parseInt(e.target.value))}
                    >
                        {timeframes.map(tf => (
                            <option key={tf.value} value={tf.value}>{tf.label}</option>
                        ))}
                    </select>
                </div>

                <ApexChart options={options} series={series} type="candlestick" height={350} />

                <div className="zone-bar-chart" style={{ marginTop: '2rem' }}>
                    <ApexChart
                        options={{
                            chart: { type: 'bar' },
                            plotOptions: {
                                bar: {
                                    distributed: true
                                }
                            },
                            xaxis: {
                                categories: ['FastBuy', 'FastSell', 'DelayedBuy', 'DelayedSell'],
                                labels: {
                                    style: {
                                        colors: '#ffffff'
                                    }
                                }
                            },
                            yaxis: {
                                labels: {
                                    style: {
                                        colors: '#ffffff'
                                    }
                                }
                            },
                            title: { text: 'Jumlah Zona & Insight (%)', align: 'center', style: { color: '#ffffff' } },
                            dataLabels: {
                                enabled: true,
                                formatter: (val, opts) => {
                                    const category = opts.w.globals.labels[opts.dataPointIndex];
                                    const key = categoryToKey[category];
                                    const pct = zoneCounts[`${key}_pct`] || 0;
                                    return `${val} (${pct}%)`;
                                }
                            },
                            tooltip: {
                                y: {
                                    formatter: (val, { dataPointIndex }) => {
                                        const labels = ['FBuy', 'FSell', 'DBuy', 'DSell'];
                                        const label = labels[dataPointIndex];
                                        const pct = zoneCounts[`${label}_pct`] || 0;
                                        const strength = zoneCounts[`${label}_strength`] || 0;
                                        return `Jumlah: ${val}\nPersen: ${pct}%\nKekuatan: ${strength}%`;
                                    }
                                }
                            },
                            legend: {
                                labels: {
                                    colors: '#ffffff'
                                }
                            },
                            colors: ['#008FFB', '#FF4560', '#008FFB', '#FF4560']
                        }}

                        series={[{
                            name: 'Jumlah',
                            data: [
                                zoneCounts.FBuy,
                                zoneCounts.FSell,
                                zoneCounts.DBuy,
                                zoneCounts.DSell
                            ]
                        }]}
                        type="bar"
                        height={300}
                    />

                </div>
            </main>
        </div>
    )
}
