import type { Plugin } from 'vite';
import { ConnectOptions } from 'ssh2-sftp-client';
export interface SftpPluginConfig extends ConnectOptions {
    remotePath: string;
    path: string;
    oldRemotePath?: string;
}
declare const vitePluginSftp: ({ path, remotePath, oldRemotePath, ...data }: SftpPluginConfig) => Plugin;
export default vitePluginSftp;
