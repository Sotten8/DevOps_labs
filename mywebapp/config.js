import fs from 'fs';

const GLOBAL_CONFIG = process.env.CONFIG_PATH || '/etc/mywebapp/config.json';
const LOCAL_CONFIG = './config.json';

let configData = {};

if (fs.existsSync(GLOBAL_CONFIG)) {
  configData = JSON.parse(fs.readFileSync(GLOBAL_CONFIG));
} else if (fs.existsSync(LOCAL_CONFIG)) {
  configData = JSON.parse(fs.readFileSync(LOCAL_CONFIG));
} else {
  configData = {
    port: 5000,
    db_url: 'postgresql://task_user:PassTask1234@127.0.0.1:5432/task_tracker',
  };
}

export default configData;
