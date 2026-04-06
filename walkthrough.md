# 🚀 Free Hosting Walkthrough: EduDisha AI Portal

Follow these steps to deploy your AI Career Guidance Portal for free using **Render.com** and **MongoDB Atlas**.

---

## 🏗️ Step 1: Push Code to GitHub
Render needs your code in a repository to automate the build.
1. Create a new **Private** or **Public** repository on GitHub.
2. Push your current project folder to that repository.
   - *Ensure both `client/` and `server/` folders and the root `package.json` are included.*

---

## 🍃 Step 2: Setup MongoDB Atlas (Cloud)
Since your local DB won't be accessible online, you need a cloud database.
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a **Free Shared Cluster** (Tier M0).
3. In **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. In **Database Access**, create a user with a password.
5. Get your **Connection String** (SRV) and replace `<password>` with your actual password.
   - *Example: `mongodb+srv://user:pass@cluster0.abc.mongodb.net/edudisha?retryWrites=true&w=majority`*

---

## 🌍 Step 3: Deploy on Render.com
1. Create a free account on [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your **GitHub Repository**.
4. Configure the following settings:
   - **Name**: `edudisha-portal` (or any unique name).
   - **Environment**: `Node`.
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. **Add Environment Variables** (Critical!):
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | *Your MongoDB Atlas Connection String* |
   | `JWT_SECRET` | *Any strong secret string* |
   | `GEMINI_API_KEY` | *Your Google AI Studio Key* |

---

## ✅ Step 4: Verify Your Live App
1. Wait for the build logs to show `"Build Successful"` and `"Server running on port 10000"`.
2. Click the URL provided by Render (e.g., `https://edudisha-portal.onrender.com`).
3. **Important**: Since this is a free tier, the first load might take 30-60 seconds after a period of inactivity.

---

### 🛠️ Troubleshooting
- **White Screen?** Check the Render logs for build errors in the frontend.
- **API Error?** Ensure `MONGODB_URI` and `JWT_SECRET` are correctly set in Render's "Environment" tab.
