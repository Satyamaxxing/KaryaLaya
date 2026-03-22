# 🏢 KaryaLaya – A Workplace Platform

⚡ **KaryaLaya** is a full-stack workplace collaboration platform designed to streamline team productivity.
It enables **authentication, project management, file sharing, team communication, and progress tracking** — all in one modern workspace.

---

## 🛠 Tech Stack

* **Frontend:** Next.js (React, TailwindCSS, ShadCN UI)
* **Backend:** Node.js (Express.js)
* **Database:** PostgreSQL (Supabase / Hosted DB)
* **Auth & Storage:** Supabase (JWT + File Storage)
* **Deployment:**

  * Frontend → Vercel
  * Backend → Render

---

## 📂 Project Structure

```
KaryaLaya/
├── backend/                # Express backend
│   ├── src/               # API routes & logic
│   ├── db.js              # Database connection
│   ├── routes.js          # API endpoints
│   ├── package.json
│   └── .env               # Backend env variables
│
├── frontend/              # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # UI components
│   ├── hooks/             # Custom hooks
│   ├── package.json
│   └── .env.local         # Frontend env variables
│
└── README.md
```

---

## ⚙️ Environment Variables

### 🔹 Backend (.env)

```
DATABASE_URL=your_postgres_connection_string
PORT=8000
```

---

### 🔹 Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🚀 Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/karyalaya.git
cd karyalaya
```

---

### 2️⃣ Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

### 3️⃣ Run the app

#### Start Backend

```bash
npm run dev
```

#### Start Frontend

```bash
npm run dev
```

---

### 🌐 Local URLs

* Frontend → http://localhost:3000
* Backend → http://localhost:8000

---

## 🌍 Deployment

### 🔹 Frontend (Vercel)

* Connect GitHub repo
* Add environment variables
* Deploy

---

### 🔹 Backend (Render)

* Create new Web Service
* Connect repo
* Add `DATABASE_URL`
* Deploy

---

## ✨ Features

* 🔐 **Authentication (Supabase)**
* 👤 **User Profiles with Avatar Upload**
* 📊 **Project Management Dashboard**
* 👥 **Team Collaboration**
* 💬 **Real-time Communication UI**
* 📁 **File Upload & Sharing**
* 📈 **Progress Tracking**
* ⚡ **Modern UI with smooth UX**

---

## 🧪 Testing

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm run lint
```

---

## 🐞 Common Issues & Fixes

### ❌ "Failed to fetch"

* Ensure `NEXT_PUBLIC_API_URL` is **not localhost in production**

---

### ❌ "invalid compact jws"

* Missing `Authorization: Bearer <token>` in API requests

---

### ❌ Backend not responding

* Render free tier may sleep → wait ~30–50 seconds

---

## 📜 License

MIT License © 2026

---

## 👨‍💻 Author

**Satyam Kumar** 🚀

---

## 🌟 Future Improvements

* 🔔 Real-time notifications
* 📱 Mobile responsiveness improvements
* 🤝 Team roles & permissions
* 📊 Advanced analytics dashboard

---

🔥 *KaryaLaya is built to bring teams together and simplify workplace collaboration.*
