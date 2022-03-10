# Sneaky Goblins Frontend with API

<br />

### Current Status

- ✅ Working perfectly locally
- ✅ Working Perfectly on Chrome
- ✅ Currently set up for Vercel
- ✅ Frontend is working normally even if backend (api) will not be deployed to Vercel, both are working perfectly
- ❗️ ISSUE: Writing to file system is working locally, even using vercel dev, but when deployed to Vercel, we have no access to filesystem (but for now just use local for testing). Please refer to this link [vercel doc - filesystem](https://vercel.com/support/articles/why-does-my-serverless-function-work-locally-but-not-when-deployed#reading-from-or-writing-to-the-filesystem) 
- ❗️ ISSUE: It has some CSP issue in Firefox, but hopefully to be resolved. I think this is beause the backend is handling the routing and the web3Modal is injecting some inline scripts.

Possible Solution for these issues:
- If we will deploy separately the server(api) code to a proper platform that supports nodejs, like DigitalOcean, some sort. Heroku has free, but also has sleep time.

<br />

### How to develop locally
1. Run ```yarn initialize``` to install all dependencies for both frontend and api 
2. Run ```yarn start``` if you want to develop locally. This will fire the frontend and api concurrenlty.
3. Run ```yarn start:vercel``` if you want to run Vercel locally
4. Run ```yarn deploy``` if you will deploy to Vercel platform

<br />



### Routes
- `/` --> for homepage
- `/join-whitelist` --> for signing/joining whitelist
- `/api/whitelisted` --> (temporary) just for checking all saved data

<br />

### Vercel test link
- https://test-private-sg-oc7aox1uq-melodiccrypter.vercel.app/
- mind, that this deployed version has issues, please check issues above
