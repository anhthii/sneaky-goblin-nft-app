# Sneaky Goblins Frontend with API

<br />

### Current Status

- ✅ Working perfectly locally
- ✅ Working Perfectly on Chrome
- ✅ Currently set up for Vercel
- ✅ Frontend is working normally even if backend (api) will not be deployed to Vercel, both are working perfectly
- ❗️ ISSUE: Writing to file system is working locally, even using vercel dev, but when deployed to Vercel, we have no access to filesystem (but for now just use local for testing). Please refer to this link [vercel doc - filesystem](https://vercel.com/support/articles/why-does-my-serverless-function-work-locally-but-not-when-deployed#reading-from-or-writing-to-the-filesystem)
  - Planned Solution: use google spreasheets of AirTable
- ❗️ ISSUE: It has some CSP issue in Firefox, but hopefully to be resolved. I think this is beause the backend is handling the routing and the web3Modal is injecting some inline scripts.
  - Planed Solution: wait for web3Modal developer's to reply on issue ticket or convert whole repo to NextJS
  
<br />

### How To Use
1. Run ```yarn initialize``` to install all dependencies for both frontend and api 
2. Run ```yarn start``` if you want to develop locally. This will fire the frontend and api concurrenlty.
3. Run ```yarn start:vercel``` if you want to run Vercel locally
4. Run ```yarn deploy``` if you will deploy to Vercel platform

<br />

**NOTE**: We are using one .env file both for server and frontend, for this particular setup, coz same variables is/are needed in both server and in frontend. So it would be redundant to create separate .env's

<br />

### Routes
- `/` --> for homepage
- `/join-whitelist` --> for signing/joining whitelist
- `/api/whitelisted` --> (temporary) just for checking all saved data

