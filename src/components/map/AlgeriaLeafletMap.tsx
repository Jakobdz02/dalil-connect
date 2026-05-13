import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, LayersControl, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ALGERIA_CITIES, type CityNode } from "@/lib/algeriaMapData";

interface Props {
  cities: CityNode[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function buildIcon(city: CityNode, active: boolean) {
  const size = active ? 56 : 44;
  const ring = active ? "ring-4 ring-[color:var(--primary)]/40" : "";
  const html = `
    <div class="relative flex flex-col items-center" style="width:${size}px">
      <div class="flex items-center justify-center rounded-full bg-white shadow-[0_6px_20px_-6px_rgba(0,0,0,0.4)] border-2 border-[color:var(--primary)] ${ring}"
        style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.55)}px;line-height:1;">
        <span>${city.heroEmoji}</span>
      </div>
      <div class="mt-1 px-2 py-0.5 rounded-full bg-white/95 text-[11px] font-semibold text-[color:var(--foreground)] shadow border border-[color:var(--border)] whitespace-nowrap">
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
              <div className="text-muted-foreground">{c.highlights[0]}</div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}

export { ALGERIA_CITIES };
