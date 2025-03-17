**Roaming - A Travel Journal App**
==================================

Roaming is a **visual storytelling app** that encourages users to capture raw, aesthetic moments and create a **digital footprint** of their experiences. Unlike traditional photo-sharing platforms that emphasize selfies and social engagement, Roaming is designed to document **places, landscapes, cityscapes, and nature**, allowing users to tell stories through their surroundings rather than themselves.

Whether it's a **bustling city skyline, a quiet morning in nature, or a unique architectural detail**, Roaming helps users focus on **capturing the world around them** rather than posing for the camera. By taking and uploading photos that showcase **atmosphere, environment, and emotion**, users build a **personal visual diary** that reflects the places they've been and the moments they've witnessed.

With **no likes, no follower counts, and no pressure**, Roaming is an invitation to **slow down** and appreciate the **beauty in everyday life---one photo at a time**.

* * * * *

**Technologies Used**
---------------------

### **Frontend (Mobile App)**

-   **React Native** - A framework for building cross-platform mobile applications for iOS and Android using JavaScript and React.
-   **Expo** - A framework and platform built on top of React Native that simplifies development by providing pre-configured tools, libraries, and a managed workflow.
-   **Firebase** - Provides authentication for user sign-in and Firestore Database for real-time data storage and syncing.

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

* * * * *

### **Backend Features (New Integration)**

-   **User Management API** - Handles **user authentication, registration, and profile updates**.
-   **Post Upload API** - Manages **photo uploads, captions, and geolocation**.
-   **Cloudinary Integration** - Stores and serves **optimized media files** via a fast CDN.
-   **Basic REST API** - Built with **Node.js & Express**, enabling CRUD operations for user posts.
-   **Data Validation & Security** - Implements **middleware** for data validation and authentication.

* * * * *

**Planned Future Enhancements**
-------------------------------

-   **Location Mapping** -- Pin visited places on an interactive map.
-   **Multi-language Support** -- Expand accessibility for a global audience.

* * * * *

**Setting Up the Project**
--------------------------

### **1️⃣ Install Dependencies**

#### **Frontend (React Native)**

`cd mobile
npm install`

#### **Backend (Node.js & Express)**

`cd backend
npm install`

* * * * *

### **2️⃣ Start the Development Server**

#### **Frontend**

`cd mobile
npx expo start`

#### **Backend**

`cd backend
node server.js`

This starts the **Express server** on `http://localhost:3000`.

* * * * *

**Screenshots**
---------------

### **Welcome and Home Screen**

<div> <img src="/mobile/assets/images/screenshots/welcome-screen.png" alt="Welcome Screen" width="45%"/> <img src="/mobile/assets/images/screenshots/home-screen.png" alt="Home Screen" width="45%"/> </div>

### **Create Post and Profile Screen**

<div> <img src="/mobile/assets/images/screenshots/create-screen.png" alt="Create Post Screen" width="45%"/> <img src="/mobile/assets/images/screenshots/profile-screen.png" alt="Profile Screen" width="45%"/> </div>

* * * * *

**API Endpoints** (Backend)
---------------------------

### **User Authentication**

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/users/register` | Register a new user |
| GET | `/api/users/me` | Get user profile |

### **Post Management**

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/posts` | Create a new post |
| GET | `/api/posts` | Retrieve all posts |
| GET | `/api/:userId/posts` | Retrieve all posts from a user |

* * * * *

**License**
-----------

This project is licensed under the **MIT License**.

* * * * *

**Contact**
-----------

📧 **Email**: vhn1@sfu.ca\
🌐 **Portfolio**: [Nam Nguyen's Porfolio](https://namneyugn21.github.io)\
