'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { 
    map.flyTo(center, 13, { duration: 1.5 }); 
  }, [center, map]);
  return null;
}

// Explicit TypeScript interface to clear the 2769 error
interface MapProps {
  partners: any[];
  onSelect: (partner: any) => void;
  selectedCenter?: [number, number];
}

export default function Map({ partners, onSelect, selectedCenter }: MapProps) {
  return (
    <MapContainer center={[22.5180, 88.4190]} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {selectedCenter && <MapUpdater center={selectedCenter} />}
      {partners.map((p) => (
        p.lat && p.lng && (
          <Marker 
            key={p.id} 
            position={[p.lat, p.lng]} 
            icon={customIcon} 
            eventHandlers={{ click: () => onSelect(p) }}
          >
            <Popup>{p.name}</Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}