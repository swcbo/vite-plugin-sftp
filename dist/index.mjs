import fs from 'fs';
import chalk from 'chalk';
import SftpClient from 'ssh2-sftp-client';

const sftp = new SftpClient();
const vitePluginSftp = ({
  path,
  remotePath,
  oldRemotePath,
  ...data
}) => {
  return {
    name: "vite-plugin-sftp",
    enforce: "post",
    async closeBundle() {
      console.log("\u{1F680}deploy start");
      const isExist = await fs.existsSync(path);
      if (!isExist) {
        console.error(chalk.red(`deploy failure: ${path} not exist \u274C`));
        return;
      }
      try {
        await sftp.connect(data);
        if (oldRemotePath) {
          if (await sftp.exists(`${remotePath}`)) {
            console.log(chalk.blue(`deploy remove ${oldRemotePath}`));
            try {
              await sftp.rmdir(`${oldRemotePath}`, true);
            } catch (error) {
            }
          }
          if (await sftp.exists(remotePath)) {
            console.log(chalk.blue(`deploy rename ${remotePath} to ${oldRemotePath}`));
            await sftp.rename(remotePath, `${oldRemotePath}`);
          }
        }
        console.log(chalk.blue(`deploy uploadDir ${path} to ${remotePath}`));
        await sftp.uploadDir(path, remotePath);
        await sftp.end();
        console.log(chalk.green("deploy success\u2705"));
      } catch (err) {
        console.error(chalk.red(`deploy failure: ${err}\u274C`));
        if (oldRemotePath) {
          console.log(chalk.red(`deploy rename ${oldRemotePath} to  ${remotePath}`));
          await sftp.rename(`${oldRemotePath}`, remotePath);
        }
        sftp.end();
      }
    }
  };
};

export { vitePluginSftp as default };
