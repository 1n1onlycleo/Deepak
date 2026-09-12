# The GenZ Fashion — React + Node

## Automatic jersey catalogue
Put any JPG/JPEG/PNG/WEBP/GIF into `server/images`. The React site polls the API every 30 seconds and automatically shows new images, newest first. No React code change is needed.

## WhatsApp
Edit `client/src/main.jsx` and replace `REPLACE_WITH_OWNER_NUMBER` with the owner's WhatsApp number, digits only including country code (example Singapore: 6591234567).

## Run
`npm install`
`npm run install-all`
`npm run dev`

React: http://localhost:5173
API: http://localhost:4000

A pure static React build cannot safely enumerate arbitrary server-folder files at runtime, so this solution uses a tiny Express API alongside the React frontend.
