"use client"

import { useState, useCallback, useMemo } from "react"

interface DataPoint {
  month: string
  value: number
  label: string
}

interface LineChartProps {
  data: DataPoint[]
  title: string
  subtitle?: string
  height?: number
  showGrid?: boolean
  showValues?: boolean
}

export function LineChart({ 
  data, 
  title, 
  subtitle, 
  height = 200, 
  showGrid = true,
  showValues = true 
}: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  // Memoizar cálculos para evitar re-renders
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null

    const maxValue = Math.max(...data.map(d => d.value))
    const minValue = Math.min(...data.map(d => d.value))
    const range = maxValue - minValue
    const padding = 40
    const chartWidth = 400
    const chartHeight = height - padding * 2
    const stepX = (chartWidth - padding * 2) / (data.length - 1)

    // Função para converter valor em coordenada Y
    const getY = (value: number) => {
      if (range === 0) return chartHeight / 2
      return chartHeight - ((value - minValue) / range) * chartHeight
    }

    // Gerar pontos da linha
    const points = data.map((point, index) => ({
      x: padding + index * stepX,
      y: getY(point.value),
      value: point.value,
      month: point.month,
      label: point.label
    }))

    // Gerar path da linha
    const pathData = points.map((point, index) => {
      const command = index === 0 ? 'M' : 'L'
      return `${command} ${point.x} ${point.y}`
    }).join(' ')

    return { maxValue, minValue, range, points, pathData, chartWidth, chartHeight }
  }, [data, height])

  // Callbacks otimizados para hover
  const handleMouseEnter = useCallback((index: number) => {
    setHoveredPoint(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null)
  }, [])

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    )
  }

  const { maxValue, minValue, range, points, pathData, chartWidth, chartHeight } = chartData

  // Memoizar linhas de grade
  const gridLines = useMemo(() => {
    if (!showGrid) return null
    
    return Array.from({ length: 5 }, (_, i) => {
      const value = minValue + (range / 4) * i
      const getY = (value: number) => {
        if (range === 0) return chartHeight / 2
        return chartHeight - ((value - minValue) / range) * chartHeight
      }
      const y = getY(value)
      return (
        <line
          key={i}
          x1={40}
          y1={y}
          x2={chartWidth - 40}
          y2={y}
          stroke="hsl(var(--border))"
          strokeWidth="0.5"
          opacity="0.3"
        />
      )
    })
  }, [showGrid, minValue, range, chartHeight, chartWidth])

  return (
    <div className="w-full">
      {/* Título e Subtítulo */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      {/* Gráfico SVG */}
      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="overflow-visible"
        >
          {/* Linhas de grade */}
          {gridLines}

          {/* Linha principal */}
          <path
            d={pathData}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Pontos de dados */}
          {points.map((point, index) => (
            <g key={index}>
              {/* Círculo do ponto */}
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === index ? "8" : "6"}
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-150 ease-out"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              />
              
              {/* Valor do ponto (sempre visível ou apenas no hover) */}
              {showValues && (hoveredPoint === index || hoveredPoint === null) && (
                <text
                  x={point.x}
                  y={point.y - 15}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-foreground pointer-events-none"
                >
                  R$ {point.value.toLocaleString()}
                </text>
              )}
              
              {/* Label do mês */}
              <text
                x={point.x}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-muted-foreground pointer-events-none"
              >
                {point.month}
              </text>
            </g>
          ))}

          {/* Tooltip no hover */}
          {hoveredPoint !== null && points[hoveredPoint] && (
            <g>
              <rect
                x={points[hoveredPoint].x - 30}
                y={points[hoveredPoint].y - 35}
                width="60"
                height="20"
                fill="hsl(var(--primary))"
                rx="4"
                className="drop-shadow-lg"
              />
              <text
                x={points[hoveredPoint].x}
                y={points[hoveredPoint].y - 20}
                textAnchor="middle"
                className="text-xs font-semibold fill-primary-foreground pointer-events-none"
              >
                R$ {points[hoveredPoint].value.toLocaleString()}
              </text>
            </g>
          )}
        </svg>

        {/* Labels do eixo Y */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
          {Array.from({ length: 5 }, (_, i) => {
            const value = Math.round(minValue + (range / 4) * (4 - i))
            return (
              <span key={i} className="text-xs text-muted-foreground select-none">
                R$ {value.toLocaleString()}
              </span>
            )
          })}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            R$ {Math.max(...data.map(d => d.value)).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Maior lucro</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            R$ {Math.min(...data.map(d => d.value)).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Menor lucro</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">
            +{Math.round(((data[data.length - 1].value - data[0].value) / data[0].value) * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">Crescimento</div>
        </div>
      </div>
    </div>
  )
}
