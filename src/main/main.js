import electron from '~/main/lib/electron';
import ConfigExec from '~/main/class/ConfigExec';

const [_1, _2, configString, projectPath] = process.argv;
const config = JSON.parse(configString);
new ConfigExec({ config, projectPath, }).start();

electron.start();
