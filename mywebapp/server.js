import app from './app.js';
import config from './config.js';

const PORT = config.port || 5000;

const listenTarget = process.env.LISTEN_FDS ? { fd: 3 } : PORT;

app.listen(listenTarget, () => {
  if (process.env.LISTEN_FDS) {
    console.log('Server started using systemd socket activation');
  } else {
    console.log(`Server started at http://127.0.0.1:${PORT}`);
  }
});
