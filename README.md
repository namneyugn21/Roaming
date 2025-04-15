**Roaming - A Travel Journal App**
==================================

Roaming is a **visual storytelling app** that encourages users to capture raw, aesthetic moments and create a **digital footprint** of their experiences. Unlike traditional photo-sharing platforms that emphasize selfies and social engagement, Roaming is designed to document **places, landscapes, cityscapes, and nature**, allowing users to tell stories through their surroundings rather than themselves.

Whether it's a **bustling city skyline, a quiet morning in nature, or a unique architectural detail**, Roaming helps users focus on **capturing the world around them** rather than posing for the camera. By taking and uploading photos that showcase **atmosphere, environment, and emotion**, users build a **personal visual diary** that reflects the places they've been and the moments they've witnessed.

With **no likes, no follower counts, and no pressure**, Roaming is an invitation to **slow down** and appreciate the **beauty in everyday life---one photo at a time**.

### Table of Contents

- [Technologies Used](#technologies-used)
- [Current Features](#current-features)
  - [Frontend Features](#frontend-features)
  - [Backend Features](#backend-features)
- [Planned Future Enhancements](#planned-future-enhancements)
- [Setting Up the Project](#setting-up-the-project)
- [Screenshots](#screenshots)
- [API Endpoints (Backend)](#api-endpoints-backend)
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

### **Backend**

-   **Node.js** - A JavaScript runtime used for backend services and API development.
-   **Express.js** - A minimal and fast web framework for handling RESTful API requests.
-   **Cloudinary** - A cloud-based media management platform for uploading, optimizing, and delivering images and videos.

* * * * *

**Current Features**
--------------------

### **Frontend Features**

#### **Welcome Screen**

-   Displays the app logo and name
-   Includes a **"Get Started"** button that navigates to the home screen

#### **Authorization Screen**

-   Users can **sign up or log in** with their **email and password** via Firebase Authentication.

#### **Home Screen**

-   Displays a **main feed** with user-generated content.
-   Implemented with **FlatList** for scalable and efficient content loading.

#### **Create a Post**

-   Allows users to select up to **10 images** to upload.
-   Users can add a **post description** and **their current location**.
-   Supports **capturing images** via the device camera.
-   Users **grant permissions** for location, camera, and photo library access via the Expo API.

#### **Delete a Post**

-   Allows users to delete their posts.
-   The deletion will delete the post entry on Firebase, as well as delete the photo(s) saved on Cloudinary.

#### **Edit User Profile**

-   Users can update their username, display name, bio, and avatar.
-   Any changes to the profile will automatically reflect on their posts (if applicable).
-   When updating the avatar, the system will efficiently manage storage by deleting the old avatar from Cloudinary, ensuring optimal space usage.

#### **Map View**
-  Allows user to interact with the map and see their geotagged posts pinpoint.

* * * * *

### **Backend Features**

-   **User Management API** - Handles **user authentication, registration, and profile updates**.
-   **Post Upload API** - Manages **photo uploads, deletions, captions, and geolocation**.
-   **Cloudinary Integration** - Stores and serves **optimized media files** via a fast CDN.
-   **Basic REST API** - Built with **Node.js & Express**, enabling CRUD operations for user posts.
-   **Data Validation & Security** - Implements **middleware** for data validation and authentication.

* * * * *

**Planned Future Enhancements**
-------------------------------

-   **AI Integration** -- Integrate Gemini AI for AI generated caption and chatbot.
-   **Multi-language Support** -- Expand accessibility for a global audience.

* * * * *

**Setting Up the Project**
--------------------------

### **1️⃣ Install Dependencies**

#### **Frontend (React Native)**

```bash
cd mobile npm install
```

#### **Backend (Node.js & Express)**

```bash
cd backend npm install
```

* * * * *

### **2️⃣ Start the Development Server**

#### **Frontend**

```bash
cd mobile npx expo start
```

#### **Backend**

```bash
cd backend node server.js
```

This starts the **Express server** on `http://localhost:3000`.

* * * * *

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
