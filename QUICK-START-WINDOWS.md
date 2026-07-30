# Windows Quick Start

Open PowerShell in the extracted project folder.

```powershell
node -v
npm -v
npm config set registry https://registry.npmjs.org/
npm cache verify
npm install --prefer-offline --no-audit --no-fund
npm run typecheck
npm run dev
```

Open the URL printed by Vite, normally:

```txt
http://127.0.0.1:5173/
```

Production check:

```powershell
npm run build
```

Do not upload these folders/files to GitHub:

```txt
node_modules
dist
.env
```
