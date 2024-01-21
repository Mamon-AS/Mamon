# Mamon

## Initalize new codespace:
### Requirements
- node.js installed on the computer (https://nodejs.org/en/)

### Install 
- ...npm in vue folder:
```cmd
cd client
npm i
```
- ...npm in sanity folder:
```cmd
cd functions
npm i
```

## Steps to run in development:
### Start Sanity:
```cmd
cd functions
npx @sanity/cli start
```
### Start Vue, Tailwind:
```cmd
cd client
npm run dev
```

### Start Netlify server-side functions:
```cmd
cd client
netlify dev 
```
<!-- 
## Deploy
- ...to test:
Set up Pull Request to ```test```

- ...to prod:
Set up Pull Request to ```main```
-->