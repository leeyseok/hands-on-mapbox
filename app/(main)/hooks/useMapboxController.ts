import { fetchGolfPlaces, fetchUserIpLocation, getUserIpAddress } from "@/apis/map/map";

import { useEffect, useState } from "react"

export const useMapboxController = () => {
  // 使用者の位置情報
  const [ userLocation, setUserLocation ] = useState<[number, number]>()
  // グルフ系の位置情報
  const [ golfPlaces, setGolfPlaces ] = useState<Array<{name: string; coordinates: [number, number]}>>([])
  const [ loading, setLoading ] = useState(true)
  
  const callFetchGolfPlaces = async (latitude: number, longitude: number) => {
    await fetchGolfPlaces(latitude, longitude).then( data => {      
      setGolfPlaces(data.features)
    })
  }

  // ユーザー位置更新
  useEffect(() => {
    
    const handleGetUserLocationSuccess = async (position:GeolocationPosition) => {
      const userCurrentLocation = position.coords    
      const { latitude, longitude} = userCurrentLocation    
      setUserLocation([userCurrentLocation.latitude, userCurrentLocation.longitude])
      
      // 成功事にゴルフ系の場所を呼び出す
      await fetchGolfPlaces(latitude, longitude).then( data => {      
        setGolfPlaces(data.features)
      })
    }
    const handleGetUserLocationFail = async (error:GeolocationPositionError) => {
      // ipアドレス読み取れない場合は、東京駅設定（必ず値はある）
      const userIpAddress = await getUserIpAddress()
              
      const defaultLocation = await fetchUserIpLocation(userIpAddress);    
      
      const {latitude, longitude} = defaultLocation        
      setUserLocation([latitude, longitude])
      callFetchGolfPlaces(latitude, longitude)
      // await fetchGolfPlaces(latitude, longitude).then( data => {      
      //   setGolfPlaces(data.features)
      // })
    }
    if(navigator.geolocation) {
      // gps利用
      const watchId = navigator.geolocation.watchPosition(handleGetUserLocationSuccess, handleGetUserLocationFail, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      })
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [])

  return {
    userLocation,
    golfPlaces,
  }
}