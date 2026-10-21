// Static server for the MiniShop web app on port 4000. Playwright starts it automatically (webServer).
const express = require('express');
const path = require('path');
const app = express();
for (const f of ['shop.html', 'shop.js', 'shop-logic.js']) {
  app.get(f === 'shop.html' ? '/' : '/' + f, (req, res) => res.sendFile(path.join(__dirname, f)));
}
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`MiniShop listening on http://localhost:${port}`));
