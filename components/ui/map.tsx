"use client"

import DottedMap from "dotted-map"
import { motion, useReducedMotion } from "framer-motion"
import { useMemo } from "react"

import { cn } from "@/lib/utils"

interface MapLocation {
  lat: number
  lng: number
  city: string
  country: string
}

interface WorldMapProps {
  className?: string
  location?: MapLocation
  markerColor?: string
}

const LAHORE: MapLocation = {
  lat: 31.5204,
  lng: 74.3587,
  city: "Lahore",
  country: "Pakistan",
}

export function WorldMap({
  className,
  location = LAHORE,
  markerColor = "#151515",
}: WorldMapProps) {
  const reduceMotion = useReducedMotion()
  const map = useMemo(
    () => new DottedMap({ height: 100, grid: "diagonal" }),
    [],
  )

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.24,
        color: "#77777170",
        shape: "circle",
        backgroundColor: "#fcfcf8",
      }),
    [map],
  )

  const point = {
    x: (location.lng + 180) * (800 / 360),
    y: (90 - location.lat) * (400 / 180),
  }

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      role="img"
      aria-label={`Dotted world map marking ${location.city}, ${location.country}`}
    >
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none absolute inset-0 size-full select-none object-cover"
        alt=""
        aria-hidden="true"
        draggable={false}
      />

      <svg
        viewBox="0 0 800 400"
        className="absolute inset-0 size-full select-none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <motion.circle
          cx={point.x}
          cy={point.y}
          r="4"
          fill={markerColor}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.circle
          cx={point.x}
          cy={point.y}
          r="4"
          fill={markerColor}
          initial={{ opacity: 0.45, scale: 1 }}
          animate={
            reduceMotion
              ? { opacity: 0.3, scale: 1 }
              : { opacity: [0.45, 0], scale: [1, 3.4] }
          }
          transition={{ duration: 2.4, repeat: reduceMotion ? 0 : Infinity }}
        />

        <path
          d={`M ${point.x - 6} ${point.y} L ${point.x - 28} ${point.y}`}
          stroke="#151515"
          strokeWidth="1"
        />

        <foreignObject
          x={point.x - 124}
          y={point.y - 21}
          width="96"
          height="42"
        >
          <div className="map-place-label">
            <span>{location.country}</span>
            <strong>{location.city}</strong>
          </div>
        </foreignObject>
      </svg>
    </div>
  )
}
