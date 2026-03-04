import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "proj4leaflet";
import { BoreholeFeature } from "./Borehole";

const EPSG3031 = new L.Proj.CRS(
  "EPSG:3031",
  "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
  {
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
    origin: [-4194304, 4194304],
    bounds: L.bounds([-4194304, -4194304], [4194304, 4194304]),
  },
);

const DEFAULT_STYLE = {
  radius: 6,
  fillColor: "#e53e3e",
  color: "#fff",
  weight: 1,
  fillOpacity: 0.8,
};

const HOVER_STYLE = {
  radius: 10,
  fillColor: "#ecc94b",
  color: "#fff",
  weight: 2,
  fillOpacity: 1,
};

interface AntarcticMapProps {
  boreholes: BoreholeFeature[];
  hoveredBorehole: string | null;
  onHoverBorehole: (name: string | null) => void;
}

function AntarcticMap({
  boreholes,
  hoveredBorehole,
  onHoverBorehole,
}: AntarcticMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      crs: EPSG3031,
      center: [-90, 0],
      zoom: 0,
      maxZoom: 3,
      minZoom: 0,
      attributionControl: true,
    });

    map.createPane("boreholes").style.zIndex = "650";

    fetch("/quantartica-simple-basemap.json")
      .then((res) => res.json())
      .then((geojson) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (L.Proj as any).GeoJSON(geojson, {
          attribution: "Norwegian Polar Institute's Quantarctica package",
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
      });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || boreholes.length === 0) return;

    markersRef.current.clear();

    const layer = L.geoJSON(boreholes, {
      pane: "boreholes",
      pointToLayer: (feature, latlng) => {
        const marker = L.circleMarker(latlng, {
          pane: "boreholes",
          ...DEFAULT_STYLE,
        });
        markersRef.current.set(feature.properties.name, marker);
        return marker;
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.on("mouseover", () => onHoverBorehole(p.name));
        layer.on("mouseout", () => onHoverBorehole(null));
      },
    }).addTo(map);

    return () => {
      layer.remove();
      markersRef.current.clear();
    };
  }, [boreholes, onHoverBorehole]);

  useEffect(() => {
    markersRef.current.forEach((marker, name) => {
      if (name === hoveredBorehole) {
        marker.setStyle(HOVER_STYLE);
        marker.setRadius(HOVER_STYLE.radius);
        marker.bringToFront();
      } else {
        marker.setStyle(DEFAULT_STYLE);
        marker.setRadius(DEFAULT_STYLE.radius);
      }
    });
  }, [hoveredBorehole]);

  return <Box ref={containerRef} h="100%" w="100%" />;
}

export default AntarcticMap;
