# CamBridge deployment

## 1. Create a GitHub repository

Create an empty repository, then from `D:\CamBridge` run:

```powershell
git init
git add .
git commit -m "Prepare CamBridge for deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
git push -u origin main
```

Do not upload `server/.env`, `node_modules`, or `dist`.

## 2. Create MongoDB Atlas database

Create a free cluster, create a database user, allow the deployment provider's
connection (Atlas can temporarily allow `0.0.0.0/0`), and copy the connection
string.

## 3. Deploy the backend on Render

Create a new Web Service from the GitHub repository:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`

Set these environment variables:

```text
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
CLIENT_URL=https://<your-vercel-app>.vercel.app
```

The backend URL will look like:
`https://cambridge-api.onrender.com`.

## 4. Deploy the frontend on Vercel

Import the same GitHub repository and set the project root to `client`.

- Build command: `npm run build`
- Output directory: `dist`

Set these environment variables:

```text
VITE_API_URL=https://<your-render-service>.onrender.com/api
VITE_SOCKET_URL=https://<your-render-service>.onrender.com
```

After deployment, open the Vercel URL on every phone. Cloudflare Quick Tunnel,
the PC, and the local development servers are no longer needed.

## 5. Final CORS update

Copy the final Vercel URL into Render's `CLIENT_URL` variable and redeploy the
backend. Then register/login on the camera phone and viewer phone.