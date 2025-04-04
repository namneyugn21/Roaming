import React, { useEffect, useRef } from "react";
import WebView from "react-native-webview";
import Constants from "expo-constants";
import theme from "@/constants/theme";

const GEOAPIFY_API_KEY = Constants.expoConfig?.extra?.GEOAPIFY_API_KEY;

interface LocationProps {
  latitude: string;
  longitude: string;
  postLocations: { lat: string; lng: string }[];
}
export default function MapView({ latitude, longitude, postLocations }: LocationProps) {
  const webviewRef = useRef<WebView>(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Roaming Map</title>
        <link
          href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css"
          rel="stylesheet"
        />
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js"></script>
        <script>
          let map;
          let marker;
          let postMarkers = [];
          const userMarker = "${theme.background}";
          const postMarker = "${theme.primary}";

          window.setCoordinates = function(lat, lng) {
            const coords = [lng, lat];

            if (!map) {
              map = new maplibregl.Map({
                container: 'map',
                style: 'https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${GEOAPIFY_API_KEY}',
                center: coords,
                zoom: 14
              });

              marker = new maplibregl.Marker({ color: userMarker }).setLngLat(coords).addTo(map);
            } else {
              map.flyTo({ center: coords, zoom: 14 });
              if (marker) {
                marker.setLngLat(coords);
              } else {
                marker = new maplibregl.Marker({ color: userMarker }).setLngLat(coords).addTo(map);
              }
            }
          };

          window.onload = function() {
            window.setCoordinates(${latitude}, ${longitude});
          };

          window.setPostMarkers = function(postLocations) {
            // remove all existing post markers
            postMarkers.forEach(marker => marker.remove());
            postMarkers = [];

            postLocations.forEach(location => {
              const coords = [location.lng, location.lat];
              const pin = new maplibregl.Marker({ color: postMarker })
                .setLngLat(coords)
                .addTo(map);
              postMarkers.push(pin);
            });
          };
        </script>
      </body>
    </html>
  `;

  // inject the coordinates into the webview when it loads
  useEffect(() => {
    if (webviewRef.current && postLocations.length > 0) {
      const postData = JSON.stringify(postLocations);
      const script = `
        window.setPostMarkers(${postData});
        true;
      `;
      webviewRef.current.injectJavaScript(script);
    }
  }, [postLocations]);
  
  return (
    <WebView
      ref={webviewRef}
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      javaScriptEnabled={true}
      // re-inject the coordinates when a post is added or removed
      onLoadEnd={() => {
        if (postLocations.length > 0) {
          const postData = JSON.stringify(postLocations);
          const script = `
            window.setPostMarkers(${postData});
            true;
          `;
          webviewRef.current?.injectJavaScript(script);
        }
      }}
      style={{ flex: 1 }}
    />
  )
}