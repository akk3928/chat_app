# Chat App (MERN + Socket.IO)

Real-time one-to-one messaging with JWT auth, saved history, online status, typing indicator and unread badges.

## Run locally
Requires Node 18+ and MongoDB (local or Atlas).

```bash
# 1. API
cd server
cp .env.example .env      # set MONGO_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5000

# 2. Client (new terminal)
cd client
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```
Open the app in two browsers (or one normal + one private window), register two users, and chat.

## Deploy with your own domain
You need to buy the domain yourself from a registrar (Namecheap, GoDaddy, Cloudflare, etc.). Then:

1. **Database:** create a free MongoDB Atlas cluster, add a user, allow network access, copy the connection string.
2. **API (Render, Railway or Fly.io):** deploy the `server` folder as a Node web service.
   - Build: `npm install` · Start: `npm start`
   - Env vars: `MONGO_URI`, `JWT_SECRET` (long random string), `CLIENT_URL=https://yourdomain.com`
   - Add custom domain `api.yourdomain.com` and create the CNAME record it asks for.
3. **Client (Vercel or Netlify):** deploy the `client` folder.
   - Build: `npm run build` · Output: `dist`
   - Env var: `VITE_API_URL=https://api.yourdomain.com`
   - Add `yourdomain.com` as the custom domain and set the DNS records shown (A/CNAME).
   - Add a rewrite of all paths to `/index.html` so React Router works on refresh.
4. HTTPS is issued automatically by these hosts. Socket.IO runs over the same API domain (WebSockets are supported on Render/Railway/Fly; serverless platforms like Vercel cannot host the API).
