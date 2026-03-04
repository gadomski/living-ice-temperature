import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "proj4leaflet";

const EPSG3031 = new L.Proj.CRS(
  "EPSG:3031",
  "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
  {
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
    origin: [-4194304, 4194304],
    bounds: L.bounds([-4194304, -4194304], [4194304, 4194304]),
  },
);

function AntarcticMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let removed = false;

    const map = L.map(containerRef.current, {
      crs: EPSG3031,
      center: [-90, 0],
      zoom: 0,
      maxZoom: 3,
      minZoom: 0,
      attributionControl: true,
    });

    fetch("/quantartica-simple-basemap.json")
      .then((res) => res.json())
      .then((geojson) => {
        if (removed) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (L.Proj as any).GeoJSON(geojson, {
          attribution: "Norwegian Polar Institute's Quantarctica package.",
          style: (feature?: GeoJSON.Feature) => {
            const category = feature?.properties?.Category ?? "";
            let fillColor = "#dedcd2";
            if (category === "Ice shelf" || category === "Ice tongue") {
              fillColor = "#cfe1eb";
            } else if (category === "Land" || category === "Rumple") {
              fillColor = "#f0f0f0";
            } else if (category === "Ocean") {
              fillColor = "#a3bdd1";
            }
            return {
              fillColor,
              stroke: false,
              fillOpacity: 1,
            };
          },
        }).addTo(map);
        return fetch("/boreholes.json");
      })
      .then((res) => res?.json())
      .then((geojson) => {
        if (removed || !geojson) return;
        L.geoJSON(geojson, {
          pointToLayer: (_feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 6,
              fillColor: "#e53e3e",
              color: "#fff",
              weight: 1,
              fillOpacity: 0.8,
            }),
          onEachFeature: (feature, layer) => {
            const p = feature.properties;
            const years =
              p.start_year && p.end_year
                ? `${p.start_year}–${p.end_year}`
                : "Unknown";
            layer.bindPopup(
              `<strong>${p.name}</strong><br/>` +
                `${p.location}<br/>` +
                `Region: ${p.region}<br/>` +
                `Years: ${years}<br/>` +
                `Ice thickness: ${p.ice_thickness ? `${p.ice_thickness} m` : "N/A"}`,
            );
          },
        }).addTo(map);
      });

    mapRef.current = map;

    return () => {
      removed = true;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <Box ref={containerRef} h="100%" w="100%" />;
}

export default AntarcticMap;
