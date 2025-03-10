import "dotenv/config";

export default {
  "expo": {
    "name": "roaming-app",
    "slug": "roaming-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/roaming-logo.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/roaming-logo.png",
        "backgroundColor": "#2f3e30"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "splash": {
      "image": "./assets/images/roaming-logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#2f3e30"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "FIREBASE_API_KEY": process.env.FIREBASE_API_KEY,
      "FIREBASE_AUTH_DOMAIN": process.env.FIREBASE_AUTH_DOMAIN,
      "FIREBASE_PROJECT_ID": process.env.FIREBASE_PROJECT_ID,
      "FIREBASE_STORAGE_BUCKET": process.env.FIREBASE_STORAGE_BUCKET,
      "FIREBASE_MESSAGING_SENDER_ID": process.env.FIREBASE_MESSAGING_SENDER_ID,
      "FIREBASE_APP_ID": process.env.FIREBASE_APP_ID,
      "CLOUDINARY_CLOUD_NAME": process.env.CLOUDINARY_CLOUD_NAME,
    }
  }
}
