# EcoFootprint Hero 🌍

**EcoStep** is a comprehensive carbon footprint tracking application designed to help users monitor and reduce their environmental impact. It tracks emissions from **Transportation, Diet, Energy, and Waste**, providing real-time feedback and visualized data.

![EcoStep Dashboard](https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000)

## 🚀 Features

-   **Multi-Category Tracking**: Log daily activities for Transport, Diet, Energy, and Waste.
-   **Real-time Calculations**: Instant carbon footprint estimation using Climatiq API data.
-   **Visual Dashboard**: Interactive charts and graphs to view progress over time.
-   **Eco Tips**: Personalized recommendations to reduce your footprint.
-   **Leaderboard**: Compare your progress with the community.
-   **Mobile Friendly**: Fully responsive design for access on any device.

## 🛠️ Tech Stack

**Frontend:**
-   **React** (Vite)
-   **TypeScript**
-   **Tailwind CSS** + **Shadcn UI**
-   **TanStack Query** (State Management)
-   **Vercel** (Hosting)

**Backend:**
-   **Node.js** + **Express**
-   **MongoDB** (Atlas) with Mongoose
-   **JWT** (Authentication)
-   **Render** (Hosting)

## ⚙️ Setup & Installation

### 1. Prerequisites
-   Node.js (v18+)
-   MongoDB Atlas Account
-   Climatiq API Key (Free tier available)

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd eco-footprint-hero
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Create a `.env` file in the root directory:

```env
# Backend Configuration
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/eco-hero
JWT_SECRET=your_super_secret_key
NODE_ENV=development

# Third Party APIs
CLIMATIQ_API_KEY=your_climatiq_key
```

### 5. Running Locally

**Start the Backend:**
```bash
npm run server
# Server runs on http://localhost:5000
```

**Start the Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:8081
```

## 🌐 Deployment

### Backend (Render)
1.  Connect GitHub repo to Render.
2.  Select **Web Service**.
3.  **Build Command**: `npm install`
4.  **Start Command**: `npm run start`
5.  Set Environment Variables (`MONGO_URI`, `JWT_SECRET`, `CLIMATIQ_API_KEY`).

### Frontend (Vercel)
1.  Connect GitHub repo to Vercel.
2.  **Build Command**: `vite build`
3.  **Environment Variables**:
    -   `VITE_API_URL`: `https://<your-backend-app>.onrender.com/api`

## 📱 Mobile Access (Local)
To test on your phone while running locally:
1.  Ensure phone and computer are on the same WiFi.
2.  Run `npm run dev` on your computer.
3.  Check the terminal for the "Network" URL (e.g., `http://192.168.1.5:8081`).
4.  Open that URL on your phone's browser.
