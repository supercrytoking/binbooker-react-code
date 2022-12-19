import React, { useState } from "react";
import GoogleMapReact, { fitBounds } from "google-map-react";
import Geocode from "react-geocode";
import Marker from "./Marker.jsx";
import "./Map.scss";

const key = "AIzaSyC6gYg0W65WfwXyVF3315hNh96E9H-jiPk";

Geocode.setApiKey(key);

// The 'isVisible' prop is necessary because when this map appears in a sidepanel, it will render before the panel has been opened, which could be making unnecessary API calls (which arent free).

export default function Map({ locations, isVisible = false, width = 500, height = 500 }) {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(1);
  const [markers, setMarkers] = useState([]);

  if (!isVisible) {
    return null;
  }

  const mapSize = {
    width,
    height
  };

  const handleApiLoaded = maps => {
    const bounds = new maps.LatLngBounds();
    locations.forEach(({ address, details }) => {
      const addressStr = address.street + ", " + address.city + ", " + address.province + " " + address.postalCode;

      Geocode.fromAddress(addressStr).then(response => {
        const lat = response.results[0].geometry.location.lat;
        const lng = response.results[0].geometry.location.lng;

        if (locations.length === 1) {
          // the "center" isnt calculating correctly when there is just one address.... its setting to somewhere in russia
          setCenter({ lat, lng });
          setZoom(15);
        } else {
          bounds.extend(new maps.LatLng(lat, lng));

          const newBounds = {
            ne: {
              lat: bounds.getNorthEast().lat(),
              lng: bounds.getNorthEast().lng()
            },
            sw: {
              lat: bounds.getSouthWest().lat(),
              lng: bounds.getSouthWest().lng()
            }
          };

          const { center, zoom } = fitBounds(newBounds, mapSize);
          setCenter(center);
          setZoom(zoom - 1);
        }

        setMarkers(prev => prev.concat({ lat, lng, details }));
      });
    });
  };

  return (
    <div className="bins-map" style={{ width: `${width}px`, height: `${height}px` }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key }}
        center={center}
        zoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ maps }) => handleApiLoaded(maps)}
      >
        {markers.map((location, id) => (
          <Marker lat={location.lat} lng={location.lng} details={location.details} key={id} />
        ))}
      </GoogleMapReact>
    </div>
  );
}
