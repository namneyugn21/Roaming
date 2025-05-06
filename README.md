**Roaming - A Travel Journal App**
==================================

Roaming is a **visual storytelling app** that encourages users to capture raw, aesthetic moments and create a **digital footprint** of their experiences. Unlike traditional photo-sharing platforms that emphasize selfies and social engagement, Roaming is designed to document **places, landscapes, cityscapes, and nature**, allowing users to tell stories through their surroundings rather than themselves.

Whether it's a **bustling city skyline, a quiet morning in nature, or a unique architectural detail**, Roaming helps users focus on **capturing the world around them** rather than posing for the camera. By taking and uploading photos that showcase **atmosphere, environment, and emotion**, users build a **personal visual diary** that reflects the places they've been and the moments they've witnessed.

With **no likes, no follower counts, and no pressure**, Roaming is an invitation to **slow down** and appreciate the **beauty in everyday life---one photo at a time**.

### Table of Contents

- [Technologies Used](#technologies-used)
- [Setting Up the Project](#setting-up-the-project)
- [Screenshots](#screenshots)
- [License](#license)
- [Contact](#contact)

* * * * *

**Technologies Used**
---------------------

### **Frontend (Mobile App)**

-   **React Native** - A framework for building cross-platform mobile applications for iOS and Android using JavaScript and React.
-   **Expo** - A framework and platform built on top of React Native that simplifies development by providing pre-configured tools, libraries, and a managed workflow.
-   **Firebase** - Provides authentication for user sign-in and Firestore Database for real-time data storage and syncing.
-   **MapLibre**- Provides an interactive map view that pinpoint the user location and their geotagged posts.
-   **Google Gemini**- An AI model that interacts with users through a chatbot, enhancing content personalization and engagement.

### **Backend**

-   **Node.js** - A JavaScript runtime used for backend services and API development.
-   **Express.js** - A minimal and fast web framework for handling RESTful API requests.
-   **Cloudinary** - A cloud-based media management platform for uploading, optimizing, and delivering images and videos.

* * * * *

**Setting Up the Project**
--------------------------

### Backend (Node.js & Express)
- In the backend directory, copy the `.env.example` file to `.env`.
- Replace the placeholder values in `.env` with your own API keys and credentials:
```bash
cp .env.example .env
```

### Frontend (React Native)
- In the mobile directory, copy the `.env.example` file to `.env`.
- Replace the placeholder values in `.env` with your own API keys and credentials:
```bash
cp .env.example .env
```

### Start the Development Server
#### Frontend
```bash
cd mobile
npx expo start
```
#### Backend
```bash
cd backend
node server.js
```
This starts the Express server on http://localhost:3000.


**Screenshots**
---------------

### Welcome & Home Screen
<div align="center"> <img src="/mobile/assets/images/screenshots/welcome-screen.png" alt="Welcome Screen" width="45%"/> <img src="/mobile/assets/images/screenshots/home-screen.png" alt="Home Screen" width="45%"/> </div>

### Profile & Edit Profile Screen
<div align="center"> <img src="/mobile/assets/images/screenshots/profile-screen.png" alt="Profile Screen" width="45%"/> <img src="/mobile/assets/images/screenshots/edit-profile-screen.png" alt="Edit Profile Screen" width="45%"/> </div>

### Create Post
<div align="center"> <img src="/mobile/assets/images/screenshots/create-screen.png" alt="Create Post Screen" width="45%"/> <img src="/mobile/assets/images/screenshots/search-screen.png" alt="Create Post Screen" width="45%"/> </div>

### Map View
<div align="center"> <img src="/mobile/assets/images/screenshots/map-screen.png" alt="Map Screen" width="30%"/> <img src="/mobile/assets/images/screenshots/map-marker.png" alt="Map Marker" width="30%"/> <img src="/mobile/assets/images/screenshots/image-preview.png" alt="Image Preview" width="30%"/> </div>

* * * * *

**License**
-----------

This project is licensed under the **MIT License**.

* * * * *

**Contact**
-----------

**Email**: vhn1@sfu.ca\
**Portfolio**: [Nam Nguyen's Porfolio](https://namneyugn21.github.io)
