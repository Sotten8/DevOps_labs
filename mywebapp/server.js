import app from './app.js';
import config from './config.js';

const PORT = config.port || 5000;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server started at http://127.0.0.1:${PORT}`);
});
