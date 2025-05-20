
# 📝 BlogPost Application

A full-stack BlogPost platform where users can publish, edit, and manage their blogs. Users can also save drafts and resume writing later. Public users can read blogs, while only authenticated users can manage their own.

## 🌐 Live Demo

- **Frontend (Vercel):** [https://blog-post-application-inky.vercel.app/](https://blog-post-application-inky.vercel.app/)
- **Backend (Render):** [https://blogpostapplication.onrender.com/](https://blogpostapplication.onrender.com/)

---

## 🚀 Features

- 🧑‍💻 **Authentication** using JWT tokens
- 📝 **Create, edit, and delete blogs**
- 💾 **Save as draft** for future editing
- 🔒 **Only owners can edit/delete their blogs**
- 🌍 **Public view of all blogs**
- 📌 **Draft management** via "Add Blog" > "Load Drafts" dropdown

---

## 🛠️ Tech Stack

### Frontend
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (for UI components)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [JWT](https://jwt.io/) for authentication

### Database
- [Supabase](https://supabase.com/) (PostgreSQL-based backend-as-a-service)

---

## 📂 Project Structure

```
📦 blogpost-app/
├── frontend/     # Next.js + Tailwind + Shadcn UI
├── backend/      # Node.js + Express + JWT
```

---

## ⚙️ Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blogpost-app.git
cd blogpost-app
```

### 2. Setup Backend

```bash
cd backend
npm install
# Create .env file with:
# PORT=5000
# JWT_SECRET=your_jwt_secret
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_key

npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install

# Optional: Configure your environment variables in .env.local if needed
npm run dev
```

---

## 🧪 API Endpoints

Example (Base URL: `https://blogpostapplication.onrender.com/`):

- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login
- `GET /api/blogs` – Get all blogs
- `POST /api/blogs` – Create a blog
- `PUT /api/blogs/:id` – Update blog
- `DELETE /api/blogs/:id` – Delete blog

---

## 🙌 Acknowledgements

- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Render](https://render.com/)
- [Vercel](https://vercel.com/)

---

## 📬 Contact

If you have any feedback or suggestions, feel free to reach out.
