import { useEffect, useState } from 'react';
import { FaLocationArrow } from "react-icons/fa";

const SelectedLocationPanel = ({ locationInformation }) => {
  const [ iframeSrcUrl, setIframeSrcUrl ] = useState(null)

  useEffect(() => {
    console.log('selectedLocationInformation', locationInformation || 'No information');
  }, [locationInformation]);

  const showPathForTarget = (targetUrl) => {
    setIframeSrcUrl(targetUrl)
  }
  return (
    <div className='
      absolute top-4 left-4 z-10 rounded-xl
      border border-blue-200 bg-white p-3
      w-full max-w-[90vw] min-h-10
      sm:w-[70%] md:w-[60%] lg:w-[25%]
      sm:min-h-12a
    '>
      <input
        placeholder='場所、カテゴリで検索'
        className='
          p-2
          border border-blue-200 rounded-xl
          font-[15px] w-full
          text-sm
        '
        value={locationInformation?.text? locationInformation.text : ''}
      />
      { locationInformation && (
        <div>
          <p>
            住所：{locationInformation.place_name}
          </p>
          <p className='flex items-center'>
            距離：{locationInformation.distanceFromUser}km
            <FaLocationArrow 
              onClick={() => showPathForTarget(locationInformation.mapLinkFromUser)}
              // onClick={() => showPathForTarget(locationInformation.mapLinkFromUser)}
              className='ml-2 cursor-pointer'
            />
          </p>
          <p>
            口コミ：★★★★☆
          </p>
          <p>
            詳細の情報を見る
          </p>
        </div>
      )}
      {iframeSrcUrl && (
        <iframe
          src={iframeSrcUrl}
          className='absolute top-4 right-4 w-[400px] h-[300px]'
        
        />
      )}
    </div>
  );
};

export default SelectedLocationPanel;
