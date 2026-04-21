
---

## 🚀 Installation

### 1. Clone repo
```bash
git clone https://github.com/your-username/HireHub.git
cd HireHub

cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev

# 🚀 HireHub – MERN Job Portal

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/Status-Live-success)

> A production-ready MERN job portal with role-based access, real-world features, and modern UI.

---

## 🌐 Live Demo

🔗 **Frontend:** https://hire-hub-iota.vercel.app/
🔗 **Backend API:** https://hirehub-backend-ykun.onrender.com

---

## 📌 About the Project

HireHub is a full-stack MERN-based job portal that connects students with recruiters. It provides a seamless platform for job searching, posting, and managing applications with role-based access control and modern UI.

---

## ✨ Features

### 👨‍🎓 Student

* Secure Registration & Login (JWT)
* Email verification system
* Browse jobs with filters (search, location, salary)
* Apply to jobs
* Resume upload support for job applications
* Save/Unsave jobs
* View applied jobs

### 🧑‍💼 HR

* Post jobs
* View applicants
* Accept / Reject candidates
* Manage own job listings

### 👨‍💻 Admin

* Manage users
* Manage jobs
* Approve / Reject HR accounts
* View analytics dashboard

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Atlas)
* JWT Authentication

---

## 🔐 Authentication & Security

* JWT-based authentication
* Email verification with secure token-based system
* Role-based access (Student / HR / Admin)
* Protected routes
* Secure password hashing (bcrypt)

---

## ⚙️ Environment Variables

### Backend (.env)

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=https://hire-hub-iota.vercel.app/
EMAIL_VERIFICATION_REQUIRED=true
```

### Frontend (.env)

```env
VITE_API_URL=https://hirehub-backend-ykun.onrender.com/api
```

---

## 🚀 Deployment

* Frontend: **Vercel**
* Backend: **Render**
* Database: **MongoDB Atlas**

---

## ⚠️ Important Notes

* Email verification system is fully implemented and working
* HR accounts require admin approval
* Ensure correct CLIENT_URL in production for email features

---

## 📈 Future Enhancements

* Password reset (forgot password)
* Resume parsing & AI matching
* Notifications system
* Advanced filtering & recommendations

---

## 👨‍💻 Author

**Harsh Berwa**
B.Tech Final Year Project

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!


## 📂 Project Structure

HireHub/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ └── server.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── hooks/
│ └── vite.config.js
