'use strict';

const fs = require('fs');
const chalk = require('chalk');
const SftpClient = require('ssh2-sftp-client');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
const chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
const SftpClient__default = /*#__PURE__*/_interopDefaultLegacy(SftpClient);

const sftp = new SftpClient__default();
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
      const isExist = await fs__default.existsSync(path);
      if (!isExist) {
        console.error(chalk__default.red(`deploy failure: ${path} not exist \u274C`));
        return;
      }
      try {
        await sftp.connect(data);
        if (oldRemotePath) {
          if (await sftp.exists(`${remotePath}`)) {
            console.log(chalk__default.blue(`deploy remove ${oldRemotePath}`));
            try {
              await sftp.rmdir(`${oldRemotePath}`, true);
            } catch (error) {
            }
          }
          if (await sftp.exists(remotePath)) {
            console.log(chalk__default.blue(`deploy rename ${remotePath} to ${oldRemotePath}`));
            await sftp.rename(remotePath, `${oldRemotePath}`);
          }
        }
        console.log(chalk__default.blue(`deploy uploadDir ${path} to ${remotePath}`));
        await sftp.uploadDir(path, remotePath);
        await sftp.end();
        console.log(chalk__default.green("deploy success\u2705"));
      } catch (err) {
        console.error(chalk__default.red(`deploy failure: ${err}\u274C`));
        if (oldRemotePath) {
          console.log(chalk__default.red(`deploy rename ${oldRemotePath} to  ${remotePath}`));
          await sftp.rename(`${oldRemotePath}`, remotePath);
        }
        sftp.end();
      }
    }
  };
};

module.exports = vitePluginSftp;
