import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, LayersControl, ZoomControl, GeoJSON } from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import { CITY_IMAGES } from "@/lib/cityImages";

// Country borders shown as separate polygons: Algeria, Morocco, and Western Sahara
// are displayed as distinct entities (Natural Earth admin_0 treats WSahara as separate).
const BORDERS_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson";

const COUNTRY_STYLES: Record<string, L.PathOptions> = {
  Algeria: { color: "#16a34a", weight: 2.2, fillColor: "#16a34a", fillOpacity: 0.06, dashArray: "" },
  Morocco: { color: "#dc2626", weight: 1.8, fillColor: "#dc2626", fillOpacity: 0.04, dashArray: "" },
  "W. Sahara": { color: "#f59e0b", weight: 1.8, fillColor: "#f59e0b", fillOpacity: 0.05, dashArray: "6 4" },
};

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  tagline?: string;
  image?: string;
}

interface Props {
  cities: MapMarker[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function buildIcon(city: MapMarker, active: boolean) {
  const size = active ? 60 : 46;
  const ringColor = active ? "var(--primary)" : "rgba(255,255,255,0.95)";
  const img = city.image ?? CITY_IMAGES[city.id] ?? "";
  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;width:${size}px;">
      <div style="width:${size}px;height:${size}px;border-radius:9999px;overflow:hidden;border:3px solid ${ringColor};box-shadow:0 8px 22px -8px rgba(0,0,0,0.55);background:#fff;">
        <img src="${img}" alt="${city.name}" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
      <div style="margin-top:4px;padding:2px 8px;border-radius:9999px;background:rgba(255,255,255,0.96);color:#1A1612;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.15);">
        ${city.name}
      </div>
    </div>`;
  return L.divIcon({
    html,
    className: "algeria-city-marker",
    iconSize: [size, size + 22],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function AlgeriaLeafletMap({ cities, selectedId, onSelect }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-full h-full grid place-items-center bg-muted/30 text-muted-foreground text-sm">
        Loading map…
      </div>
    );
  }

  return (
    <MapContainer
      center={[28.0339, 1.6596]}
      zoom={5}
      minZoom={4}
      maxZoom={12}
      scrollWheelZoom
      zoomControl={false}
      className="w-full h-full"
      style={{ background: "#0b1d2a" }}
    >
      <ZoomControl position="topright" />
      <LayersControl position="topleft">
        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            attribution='Tiles &copy; Esri'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            attribution='&copy; OpenTopoMap (CC-BY-SA)'
            url="https://a.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxZoom={17}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Streets">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked name="Labels">
          <TileLayer
            attribution='Labels &copy; Esri'
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.Overlay>
      </LayersControl>

      {cities.map((c) => (
        <Marker
          key={c.id}
          position={[c.lat, c.lng]}
          icon={buildIcon(c, c.id === selectedId)}
          eventHandlers={{ click: () => onSelect(c.id) }}
        >
          <Tooltip direction="top" offset={[0, -28]} opacity={1}>
            <div className="text-xs">
              <div className="font-semibold">{c.name}</div>
              {c.tagline && <div className="text-muted-foreground">{c.tagline}</div>}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
