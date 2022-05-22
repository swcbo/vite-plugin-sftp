/*
 * @Author: swcbo
 * @Date: 2022-05-10 11:59:41
 * @LastEditors: swcbo
 * @LastEditTime: 2022-05-22 22:57:18
 * @FilePath: /vite-plugin-sftp/src/index.ts
 * @Description: sftp
 */
import type { Plugin } from 'vite';
import fs from 'fs';
import chalk from 'chalk';
import SftpClient, { ConnectOptions } from 'ssh2-sftp-client';
const sftp = new SftpClient();
export interface SftpPluginConfig extends ConnectOptions {
  remotePath: string;
  path: string;
  oldRemotePath?: string;
}
const vitePluginSftp = ({
  path,
  remotePath,
  oldRemotePath,
  ...data
}: SftpPluginConfig): Plugin => {
  return {
    name: 'vite-plugin-sftp',
    enforce: 'post',
    async closeBundle() {
      console.log('🚀deploy start');
      const isExist = await fs.existsSync(path);
      if (!isExist) {
        console.error(chalk.red(`deploy failure: ${path} not exist ❌`));
        return;
      }
      try {
        await sftp.connect(data);
        if (oldRemotePath) {
          if (await sftp.exists(`${remotePath}`)) {
            console.log(chalk.blue(`deploy remove ${oldRemotePath}`));
            await sftp.rmdir(`${oldRemotePath}`, true);
          }
          if (await sftp.exists(remotePath)) {
            console.log(
              chalk.blue(`deploy rename ${remotePath} to ${oldRemotePath}`),
            );
            await sftp.rename(remotePath, `${oldRemotePath}`);
          }
        }
        console.log(chalk.blue(`deploy uploadDir ${path} to ${remotePath}`));
        await sftp.uploadDir(path, remotePath);
        await sftp.end();
        console.log(chalk.green('deploy success✅'));
      } catch (err) {
        console.error(chalk.red(`deploy failure: ${err}❌`));
        if (oldRemotePath) {
          console.log(
            chalk.red(`deploy rename ${oldRemotePath} to  ${remotePath}`),
          );
          await sftp.rename(`${oldRemotePath}`, remotePath);
        }

        sftp.end();
      }
    },
  };
};
export default vitePluginSftp;
