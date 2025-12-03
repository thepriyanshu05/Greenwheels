# 🚗 GreenWheels – Smart Carpooling Platform (BCC351)

> **Mini Project | B.Tech 2nd Year (BCC351)**  
> Developed under the guidance of **Mr. Aquib Ali**  
> Department of Computer Science & Engineering  
> [PSIT-Pranveer Singh Institute of Technology]

---

## 🌿 Overview

**GreenWheels** is an innovative and eco-friendly **Smart Carpooling System** designed to connect passengers and drivers traveling on similar routes.  
It encourages **shared commuting**, **cost efficiency**, and **carbon emission reduction** through a secure, fast, and modern digital platform.

---

## ✨ Features

- 🔐 **Secure Authentication** – JWT tokens, password hashing, and role-based access (User/Driver)
- 🚗 **Driver Dashboard** – Publish and manage offered rides
- 🧍‍♂️ **User Dashboard** – Browse and book available rides
- 🎨 **Modern UI/UX** – Responsive and animated interface with Tailwind CSS + Framer Motion
- 📱 **Fully Responsive** – Optimized for desktop, tablet, and mobile
- 🛡️ **Data Protection** – MongoSanitize, Helmet, Rate limiting
- 🌐 **PWA Ready** – Installable app with offline caching
- 💬 **Contact & Support Form** – Easy communication system
- ⚡ **Optimized Performance** – Lazy loading, caching, and compression

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- React.js (with Vite)
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios (API Service Layer)
- Sonner (Toast Notifications)
- Zod (Form Validation)

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JWT Authentication
- Passport.js
- Helmet, Rate Limit, Compression, CORS

### 🧩 Tools
- Visual Studio Code  
- Postman  
- Git & GitHub  
- MongoDB Compass / Atlas  

---

## 🗂️ Project Structure

Greenwheels/
│
├── frontend/ # React Frontend (Vite)
│ ├── src/
│ │ ├── components/ # Navbar, Footer, Buttons, etc.
│ │ ├── pages/ # Home, Login, Dashboard, etc.
│ │ ├── services/ # API services (axios)
│ │ ├── assets/ # Images, icons
│ │ └── App.jsx
│ ├── tailwind.config.js
│ ├── vite.config.js
│ └── package.json
│
├── backend/ # Express Backend
│ ├── src/
│ │ ├── config/ # Database and passport configuration
│ │ ├── controllers/ # Logic for users, drivers, rides
│ │ ├── middleware/ # Authentication and error handlers
│ │ ├── models/ # Mongoose Schemas
│ │ └── routes/ # Express route definitions
│ ├── Server.js
│ └── package.json
│
├── .env # Environment variables
├── package-lock.json
└── README.md

yaml
Copy code

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 4.4+
- Git

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/thepriyanshu05/Greenwheels.git
cd Greenwheels
Install Dependencies

Backend:
bash
Copy code
cd backend
npm install
Frontend:
bash
Copy code
cd ../frontend
npm install
Setup Environment Variables

Create backend/.env file
env
Copy code
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/greenwheels
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:5173
Create frontend/.env file
env
Copy code
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=GreenWheels
Run the Project

bash
Copy code
# Start Backend
cd backend
npm run dev

# Start Frontend (in another terminal)
cd ../frontend
npm run dev
App runs at:
👉 Frontend: http://localhost:5173
👉 Backend: http://localhost:5000

📊 Performance & Security
🧠 Performance
Lazy-loaded React routes

Code splitting & tree shaking

Asset compression & caching

CDN-ready architecture

🔒 Security
Helmet.js for secure headers

bcryptjs for password hashing

Rate limiting to prevent DDoS

Mongo-sanitize & input validation

JWT for route protection

📱 Accessibility
ARIA-labeled components

Keyboard navigation

High-contrast color scheme

Screen reader compatibility

🧪 Testing
bash
Copy code
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
🧱 Build for Production
bash
Copy code
# Frontend
cd frontend
npm run build

# Backend
cd ../backend
npm run build
npm start
🧭 Deployment
Option 1: Docker Compose
bash
Copy code
docker-compose up -d
Option 2: Manual Hosting
Deploy backend → Render / Railway / Heroku

Deploy frontend → Vercel / Netlify

Connect both via API URL

👨‍💻 Team Members
Name	Roll Number
Priyanshu Singh	2401640100770
Priyam Singh Patel	2401640100757
Rishikant Rathore	2401640100814
Ridhima Dixit	2401640100807

🧑‍🏫 Guided By
Mr. Aquib Ali
Department of Computer Science & Engineering
[Your College Name]

📚 Subject Details
Mini Project (BCC351)
Bachelor of Technology – 2nd Year
Department of Computer Science & Engineering

🌱 Future Enhancements
📍 Real-time GPS Tracking

💬 In-app Chat between Driver and Passenger

💸 Ride Fare Estimation (Google Maps API)

💳 Online Payment Integration

⭐ Rating and Review System

📲 Mobile App (React Native)

📜 License
This project is developed as part of the B.Tech 2nd Year Mini Project (BCC351) for academic purposes.
© 2025 GreenWheels Team. All rights reserved.

🖋️ Built with ❤️ by
Priyanshu Singh, Priyam Singh Patel, Rishikant Rathore, and Ridhima Dixit