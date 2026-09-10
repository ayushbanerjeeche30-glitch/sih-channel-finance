"use client";

import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Partner } from "@/data/partnersData";

// Google-Maps-style teardrop pin, built as inline SVG — no external asset dependency
function createPinIcon(color: string, size: number) {
  const svg = `
    <svg width="${size}" height="${size * 1.4}" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 22 12 22s12-13 12-22c0-6.627-5.373-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "custom-pin-icon",
    iconSize: [size, size * 1.4],
    iconAnchor: [size / 2, size * 1.4],
    popupAnchor: [0, -size * 1.3],
  });
}

const defaultIcon = createPinIcon("#1e3a8a", 30);   // navy blue — matches your brand color
const selectedIcon = createPinIcon("#dc2626", 44);  // larger red — the selected partner

interface AgencyMapProps {
  partners: Partner[];
  selectedPartnerId?: number | null;
}

function MapRecenter({ partners, selectedPartnerId }: { partners: Partner[]; selectedPartnerId?: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPartnerId != null) {
      const selected = partners.find((p) => p.id === selectedPartnerId);
      if (selected) {
        map.setView([selected.lat, selected.lng], 15, { animate: true });
        return;
      }
    }
    if (partners.length > 0) {
      map.setView([partners[0].lat, partners[0].lng], partners.length === 1 ? 13 : 7);
    }
  }, [partners, selectedPartnerId, map]);

  return null;
}

export default function AgencyMap({ partners, selectedPartnerId }: AgencyMapProps) {
  const defaultCenter: [number, number] = [23.5937, 85.9629];
  const markerRefs = useRef<{ [key: number]: L.Marker | null }>({});

  useEffect(() => {
    if (selectedPartnerId != null) {
      const marker = markerRefs.current[selectedPartnerId];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedPartnerId]);

  return (
    <MapContainer center={defaultCenter} zoom={7} scrollWheelZoom={false} className="w-full h-full min-h-[400px] z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapRecenter partners={partners} selectedPartnerId={selectedPartnerId} />
      {partners.map((partner) => (
        <Marker
          key={partner.id}
          position={[partner.lat, partner.lng]}
          icon={partner.id === selectedPartnerId ? selectedIcon : defaultIcon}
          ref={(ref) => {
            markerRefs.current[partner.id] = ref;
          }}
        >
          <Popup>
            <div className="p-1 font-sans">
              <h4 className="font-bold text-slate-900 text-sm">{partner.name}</h4>
              <p className="text-xs text-slate-600 mt-1">{partner.address}</p>
              <p className="text-xs text-blue-700 font-semibold mt-1">Pin: {partner.pincode} | District: {partner.district}</p>
              <p className="text-xs text-slate-500 mt-0.5">Phone: {partner.phone}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}