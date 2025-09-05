import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapPoint {
  lat: number;
  lng: number;
  id: string;
  temp?: number;
}

interface MapProps {
  points: MapPoint[];
}

const Map = ({ points }: MapProps) => {
  const center: [number, number] = points.length > 0 ? [points[0].lat, points[0].lng] : [20, 0];

  return (
    <MapContainer 
      center={center} 
      zoom={3} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {points.map(point => (
        <Marker key={point.id} position={[point.lat, point.lng]}>
          <Popup>
            Float ID: {point.id} <br />
            {point.temp && `Temperature: ${point.temp.toFixed(1)}°C`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
