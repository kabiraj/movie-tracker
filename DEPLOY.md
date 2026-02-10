# How to deploy (and what’s actually going on)

This guide teaches you **what deployment is** and **why each step exists**, so you’re not just clicking buttons.

---

## What “deploy” means

Right now you have:

- **Frontend** – React app that runs in the **browser** (your computer). It talks to the backend by calling `http://localhost:3000`.
- **Backend** – Node/Express server that runs on **your machine**. It talks to MongoDB and TMDb.
- **Database** – MongoDB. On your machine it might be local; for production we use a **cloud** DB.

**Deploying** means putting these three things on servers that are always on and reachable on the internet, so anyone with the URL can use your app.

We’ll use:

| Part | Service | Why |
|------|--------|-----|
| Database | **MongoDB Atlas** | Hosted MongoDB in the cloud. Your backend will connect to it with a URL. |
| Backend | **Render** | Runs your Node server 24/7 and gives it a public URL (e.g. `https://my-api.onrender.com`). |
| Frontend | **Vercel** | Builds your React app and serves the built files. Gives you a URL (e.g. `https://my-app.vercel.app`). |

**Important idea:** The frontend and backend are on **different domains**. So we have to tell the backend “allow requests from my frontend URL” (CORS) and tell the frontend “call this backend URL” (`VITE_API_URL`). You’ll do both below.

---

## Step 0: Put your code on GitHub

Deployment will **pull your code from GitHub**. So first, get the project on GitHub.

1. Create a new repo on [github.com](https://github.com) (e.g. `movie-tracker-app`). Don’t add a README if the folder already has one.
2. In your project folder, run (replace with your repo URL):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/movie-tracker-app.git
git push -u origin main
```

Make sure `.env` is **not** committed (it should be in `.gitignore`). Never push secrets.

**Why:** Render and Vercel will connect to this repo and run `npm install` and `npm run build` / `npm start` on their servers. No GitHub = no deploy.

---

## Step 1: Database – MongoDB Atlas

Your backend needs a MongoDB connection string. On your laptop you might use `mongodb://localhost:27017`. In production, we use MongoDB’s cloud: Atlas.

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. **Create a cluster** – choose the free tier (M0). Pick a region close to you. Create. Wait until it’s ready.
3. **Create a DB user** (so the backend can log in):
   - Sidebar: **Database Access** → **Add New Database User**.
   - Username and password: choose something and **save the password** (e.g. in a notes app).
   - Role: “Atlas admin” or “Read and write to any database” is enough for a small app.
   - Add User.
4. **Allow network access** (so Render’s servers can reach Atlas):
   - Sidebar: **Network Access** → **Add IP Address**.
   - Click **“Allow Access from Anywhere”** (0.0.0.0/0). For a portfolio app this is fine; later you can restrict to Render’s IPs.
   - Confirm.
5. **Get the connection string**:
   - Go back to **Database** (sidebar). On your cluster, click **Connect**.
   - Choose **“Connect your application”**.
   - Copy the string. It looks like:  
     `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `USERNAME` and `PASSWORD` with the DB user you created. Optionally add a database name before the `?`:  
     `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/movie-tracker?retryWrites=true&w=majority`  
     (If you don’t, MongoDB will use a default DB; both work.)

Save this full string somewhere safe. You’ll paste it into Render as `MONGODB_URI`.

**Why:** The backend on Render can’t use “localhost” for the database—there’s no MongoDB on Render’s machine. So we give it a URL that points to MongoDB in the cloud.

---

## Step 2: Backend – Render

Render will clone your repo, go into the `backend` folder, run `npm install`, then run `npm start` every time someone hits your app. It also gives your server a public URL.

1. Go to [render.com](https://render.com). Sign up with GitHub (so it can see your repos).
2. **New** → **Web Service**.
3. Connect your **movie-tracker-app** repo. If you don’t see it, click “Configure account” and allow Render to see the repo.
4. **Settings that matter:**
   - **Name:** e.g. `movie-tracker-api` (you’ll get `https://movie-tracker-api.onrender.com`).
   - **Root Directory:** `backend`.  
     So Render runs everything from the `backend` folder (where `package.json` and `server.js` are).
   - **Build Command:** `npm install`.  
     Installs dependencies.
   - **Start Command:** `npm start`.  
     Runs `node server.js` (from your `package.json` script).
5. **Environment variables** (this is how you pass secrets and config; never put these in code):
   - **Add**:
     - `MONGODB_URI` = the full Atlas connection string from Step 1.
     - `JWT_SECRET` = any long random string (e.g. 20–30 random letters/numbers). Used to sign JWTs.
     - `TMDB_API_KEY` = your TMDb API key (same as in local `.env`).
   - Leave `FRONTEND_URL` for the next step.
6. Click **Create Web Service**. Render will build and start your app. Wait until the status is **Live**.
7. Open the URL Render shows (e.g. `https://movie-tracker-api.onrender.com`). You might see “Cannot GET /” or a blank response—that’s fine. Your routes are `/users` and `/movies`, so the root URL doesn’t need to show anything. The important part is: no crash, and the tab loads.

Copy this URL; it’s your **backend URL**. The frontend will call it.

**Why:** Your laptop isn’t always on and doesn’t have a public URL. Render runs your Node app on their servers and gives it a URL so the browser (and Vercel-hosted frontend) can call it.

---

## Step 3: Frontend – Vercel

Vercel will clone your repo, go into the `frontend` folder, run `npm run build`, and serve the built files. The built app is just HTML/CSS/JS; the **browser** will run it and call your **backend URL** for data.

1. Go to [vercel.com](https://vercel.com). Sign up with GitHub.
2. **Add New** → **Project** → import the **same** repo (movie-tracker-app).
3. **Settings:**
   - **Root Directory:** `frontend`.  
     So Vercel only builds the React app.
   - **Build Command:** `npm run build` (Vite’s default).
   - **Output Directory:** `dist`.  
     Vite puts the built site in `frontend/dist`. Vercel needs to know where to serve from.
   - **Environment variable:**
     - Name: `VITE_API_URL`
     - Value: your **backend URL** from Step 2, e.g. `https://movie-tracker-api.onrender.com` (no trailing slash).

   Vite only exposes env vars that start with `VITE_`. Your code uses `import.meta.env.VITE_API_URL` in `config.js`, so the built app will call this URL instead of localhost.
4. Deploy. Wait until it’s done. Vercel gives you a URL like `https://movie-tracker-app.vercel.app`. That’s your **frontend URL**.

Open that URL. You’ll probably see the app, but **login/signup might fail** until we set CORS (next step). That’s expected.

**Why:** The frontend is a static site (HTML/JS/CSS). We build it once; Vercel serves those files. Every user gets the same files; the **browser** then runs the app and sends API requests to your backend URL. So the frontend must know that URL at build time—that’s `VITE_API_URL`.

---

## Step 4: CORS – let the frontend talk to the backend

Browsers block requests from one site (e.g. `https://movie-tracker-app.vercel.app`) to another (e.g. `https://movie-tracker-api.onrender.com`) unless the **backend** says “I allow that origin.” That’s CORS.

Your backend already supports this: if `FRONTEND_URL` is set, it allows that origin. So we set it on Render.

1. In **Render**, open your backend service → **Environment**.
2. Add (or edit):
   - Key: `FRONTEND_URL`
   - Value: your **frontend URL** from Step 3, e.g. `https://movie-tracker-app.vercel.app` (no trailing slash).
3. Save. Render will redeploy. Wait until it’s live again.

After that, the browser will allow requests from your Vercel URL to your Render URL.

**Why:** Without this, the browser would block your frontend’s fetch calls to the backend and you’d see CORS errors in the console. Setting `FRONTEND_URL` makes the backend send the right “I allow this origin” header.

---

## Step 5: Test the full flow

1. Open your **Vercel** (frontend) URL.
2. Sign up with a new email/password.
3. Log in.
4. Search for a movie and add it to your list.
5. Open **Profile** (or Movies list) and confirm the movie is there.

If something fails:

- **“Network error” / nothing happens:** Open DevTools (F12) → **Network**. See if requests go to your Render URL. If they go to localhost, `VITE_API_URL` wasn’t set or the frontend wasn’t rebuilt after you set it (redeploy on Vercel).
- **CORS error in console:** Backend doesn’t allow your frontend. Double-check `FRONTEND_URL` on Render (exact Vercel URL, https).
- **401 / “Unauthorized”:** Token not sent or invalid. Check that you’re logged in and that the frontend sends `Authorization: Bearer <token>` (your code already does if using `config.js` and the same fetch pattern).
- **500 / “Something went wrong”:** Check **Render → Logs** for the real error (e.g. wrong `MONGODB_URI`, missing env var).

---

## Quick reference

| What | Where to set it | Example |
|------|-----------------|--------|
| Database connection | Render: `MONGODB_URI` | Atlas connection string |
| JWT signing secret | Render: `JWT_SECRET` | Long random string |
| TMDb API key | Render: `TMDB_API_KEY` | Your TMDb key |
| Backend URL (for the browser) | Vercel: `VITE_API_URL` | `https://your-app.onrender.com` |
| Frontend URL (for CORS) | Render: `FRONTEND_URL` | `https://your-app.vercel.app` |

---

## Summary

1. **GitHub** – So Render and Vercel can clone and build your code.
2. **Atlas** – Cloud MongoDB; backend connects with `MONGODB_URI`.
3. **Render** – Runs the Node backend and gives it a public URL.
4. **Vercel** – Builds the React app and serves it; you set `VITE_API_URL` to the backend URL.
5. **CORS** – Set `FRONTEND_URL` on Render to your Vercel URL so the browser allows requests.

After this, your app is deployed: users open the Vercel URL, the browser loads the React app, and the app calls your Render API and Atlas database. No localhost involved.
