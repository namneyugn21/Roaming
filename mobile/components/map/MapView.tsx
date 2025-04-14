import React, { useEffect, useRef } from "react";
import WebView from "react-native-webview";
import Constants from "expo-constants";
import theme from "@/constants/theme";
import { Post } from "@/constants/types";

const GEOAPIFY_API_KEY = Constants.expoConfig?.extra?.GEOAPIFY_API_KEY;

interface LocationProps {
  latitude: string;
  longitude: string;
  posts: Post[];
  postClicked?: (pid: string) => void;
}
export default function MapView({ latitude, longitude, posts, postClicked }: LocationProps) {
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

          window.setPostMarkers = function(posts) {
            // remove all existing post markers
            postMarkers.forEach(marker => marker.remove());
            postMarkers = [];

            posts.forEach(post => {
              const coords = [post.lng, post.lat];

              // create a marker for each post
              const pinElement = document.createElement('div');
              pinElement.style.width = "50px";
              pinElement.style.height = "50px";
              pinElement.style.borderRadius = "50%";
              pinElement.style.overflow = "hidden";
              pinElement.style.boxShadow = "0 0 6px rgba(0, 0, 0, 0.3)";
              pinElement.style.border = "2px solid white";

              // add the post image inside
              const img = document.createElement("img");
              img.src = post.imageUrl; // you'll need this value in postLocations!
              img.style.width = "100%";
              img.style.height = "100%";
              img.style.objectFit = "cover";
              pinElement.appendChild(img);

              // add a click event to the pin to return post id clicked
              pinElement.addEventListener("click", () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                  type: "postClicked",
                  pid: post.pid 
                }));
              });

              // create a marker for each post
              const pin = new maplibregl.Marker(pinElement)
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
    if (webviewRef.current && posts.length > 0) {
      const postData = JSON.stringify(
        posts
          .filter(post => post.latitude && post.longitude && post.image.length > 0)
          .map(post => ({
            lat: parseFloat(post.latitude!),
            lng: parseFloat(post.longitude!),
            imageUrl: post.image[0].url,
            pid: post.pid,
          }))
      );
      const script = `
        window.setPostMarkers(${postData});
        true;
      `;
      webviewRef.current.injectJavaScript(script);
    }
  }, [posts]);
  
  return (
    <WebView
      ref={webviewRef}
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      javaScriptEnabled={true}
      // re-inject the coordinates when a post is added or removed
      onLoadEnd={() => {
        if (posts.length > 0) {
          const postData = JSON.stringify(
            posts
              .filter(post => post.latitude && post.longitude && post.image.length > 0)
              .map(post => ({
                lat: parseFloat(post.latitude!),
                lng: parseFloat(post.longitude!),
                imageUrl: post.image?.[0]?.url ?? "",
                pid: post.pid,
              }))
          );          
          const script = `
            window.setPostMarkers(${postData});
            true;
          `;
          webviewRef.current?.injectJavaScript(script);
        }
      }}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "postClicked") {
          postClicked?.(data.pid);
        }
      }}
      style={{ flex: 1 }}
    />
  )
}