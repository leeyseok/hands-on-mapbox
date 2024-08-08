"use client"
import React, { useEffect, useState } from 'react'
import MapboxMap from "@/components/map/MapboxMap"
import { useMapboxController } from "../hooks/useMapboxController"
import SelectedLocationPanel from "@/components/map/SelectedLocationPanel";
const MapboxContainer = () => {
  const {
    userLocation,
    golfPlaces,
  } = useMapboxController()

  const [ seletedLocationInformation, setSeletedLocationInformation] = useState(null)

  if (!userLocation) {
    return (
      <div>qwe</div>
    )
  }
  return (
    <div>
      <SelectedLocationPanel 
        locationInformation={seletedLocationInformation}
      />
      <MapboxMap
        userLocation={userLocation}
        golfPlaces={golfPlaces}
        onSelectedLocation={setSeletedLocationInformation}
      />
    </div>
  )
}

export default MapboxContainer