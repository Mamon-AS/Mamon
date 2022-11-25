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
### Start Vue:
```cmd
cd client
npm run dev
```

## Deploy:
Set up Pull Request to ```main```