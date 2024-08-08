// app/page.tsx
import * as React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxMap from "@/components/map/MapboxMap"
import MapboxContainer from "./components/MapboxContainer"

const HomePage = () => {

  return (
    <main>
        <MapboxContainer />
    </main>
  );
};

export default HomePage;
