import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
// import { SearchBox } from '@mapbox/search-js-react';

const MapboxMap = ({ userLocation, golfPlaces, onSelectedLocation }) => {
  // ユーザーの緯度
  const [ userLatitude, setUserLatitude ] = useState(userLocation[0])
  // ユーザーの軽度
  const [ userLongitude, setUserLongitude ] = useState(userLocation[1])
  // 選択した場所情報
  // const [ selectedLocationInformation, setSelectedLocationInformation ] = useState()
  // 地図情報Ref
  const mapInstanceRef = useRef(null);
  // 地図HTML保存先
  const mapContainerRef = useRef(null);
  // 地図ロード確認
  const [mapLoaded, setMapLoaded] = useState(false);
  // 検索バー入力値
  const [inputValue, setInputValue] = useState('');
  // ゴルフマーカ
  const markerRef = useRef([])
  // ポップアップ情報
  const popupRef = useRef()

  // 地図を描く、且つユーザーマーカー生成
  useEffect(() => {
    if (!userLocation) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN_PUBLIC_KEY;

    console.log(21, mapInstanceRef)
    // if (!mapInstanceRef.current) {
      console.log(23)
      // Initialize the map
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        // center: [longitude, latitude],
        center: [userLongitude, userLatitude],
        zoom: 13,
        style: 'mapbox://styles/mapbox/streets-v11',
      });
      console.log('mapInstanceRef.current',mapInstanceRef.current)
      
      mapInstanceRef.current.on('load', () => {
        setMapLoaded(true);
        // 地図がロードされた後、ユーザーのマーカー追加
        new mapboxgl.Marker( {color: 'red'})
          .setLngLat([userLongitude, userLatitude])
          // .setLngLat([longitude, latitude])
          .addTo(mapInstanceRef.current);
      });

      // Clean up on unmount
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          console.log('mapInstanceRef.current',mapInstanceRef.current)
        }
      };
    // }
  }, [ userLatitude, userLongitude, userLocation]);

  // ゴルフマーカー追加
  useEffect(() => {
    // 地図がレンダリングされてないまたは、情報がない、またはゴルフの場所がなければリターン
    if (!mapLoaded || !mapInstanceRef.current || !golfPlaces) return

    const updateMarkers = () => {
      // ユーザーが見ている地図の範囲
      const mapBorder = mapInstanceRef.current.getBounds();
      console.log(mapBorder.getSouth(),
      mapBorder.getNorth(),
      mapBorder.getWest(),
      mapBorder.getEast())
      console.log(markerRef.current)
      markerRef.current.forEach(marker => marker.remove()) // 地図からマーカー削除
      markerRef.current = [] // 参照先初期化

      golfPlaces.forEach(place => {
        const placeCenter = place.center
        const placeLatitude = placeCenter[1]
        const placeLongiitude = placeCenter[0]
        // 格ゴルフの場所が現在の地図の範囲かを判定し、地図にマーカー追加
        if (
          placeLatitude >= mapBorder.getSouth() &&
          placeLatitude <= mapBorder.getNorth() &&
          placeLongiitude >= mapBorder.getWest() &&
          placeLongiitude <= mapBorder.getEast()
        ) {
          const marker = new mapboxgl.Marker()
            .setLngLat([placeLongiitude, placeLatitude])
            .addTo(mapInstanceRef.current);

          // マウスホバー時に、簡単な情報Sを表示
          let hoverTimeout
          let firstHover = true // ホバー履歴を見る
          const showPopup = () => {
            const popup = new mapboxgl.Popup({ closeOnClick: false })
              .setLngLat([placeLongitude, placeLatitude])
              .setHTML(`<h3>${place.name}</h3><p>クリックして詳細を見る</p>`)
              .addTo(mapInstanceRef.current);
            popupRef.current = popup;
          }

          marker.getElement().addEventListener('mouseenter', () => {
            
          })
          // クリック時にパーンネルに情報を渡す
          marker.getElement().addEventListener('click', () => {
            if (popupRef.current) {
              popupRef.current.remove();
            }

            // 使用者と店舗までの距離計算
            const userLngLat = new mapboxgl.LngLat(userLongitude, userLatitude)
            const targetPlaceLngLat = new mapboxgl.LngLat(placeLongiitude, placeLatitude)
            const distanceFromUser = Number((userLngLat.distanceTo(targetPlaceLngLat) / 1000).toFixed(2)); // kmで表示
            
            // googleMap ルートリンク
            const mapLink = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${placeLatitude},${placeLongiitude}&travelmode=driving`;

            place.distanceFromUser = distanceFromUser
            place.mapLinkFromUser = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${placeLatitude},${placeLongiitude}&travelmode=driving`;
            onSelectedLocation(place)
          });

          markerRef.current.push(marker);
        }
      })
    }

    // 지도 이동이 끝날 때마다 마커 업데이트
    mapInstanceRef.current.on('moveend', updateMarkers);
    updateMarkers()
    // Clean up event listener on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('moveend', updateMarkers);
      }
    };
  }, [userLatitude, userLongitude, golfPlaces, mapLoaded, onSelectedLocation])
  return (
    <div className='w-[100%] h-[100%]'>
      {/* 検索バー */}
      {/* {mapLoaded && (
        <SearchBox
          accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN_PUBLIC_KEY}
          map={mapInstanceRef.current}
          mapboxgl={mapboxgl}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          marker
        />
      )} */}
      {/* <div ref={mapContainerRef} className='w-[100%] h-[100%]' /> */}
      <div ref={mapContainerRef} style={{ height: '100vh', width: '100vw' }} />
    </div>
  );
};

export default MapboxMap;
