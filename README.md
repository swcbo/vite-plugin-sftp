# vite-plugin-sftp

vite 插件,用于上传文件到指定服务器。

## 安装

npm:

```
npm install vite-plugin-sftp --save-dev
```

yarn:

```
yarn add vite-plugin-sftp -D
```

## 使用方法

- for a Vite project, in `vite.config.js`:

```tsx
import vitePluginSftp from 'vite-plugin-sftp';
const path = require('path');
const sftp = vitePluginSftp({
  port: 22,
  host: 'xxx.xxx.xxx.xxx',
  username: 'root',
  password: 'xxx',
  path: path.resolve(__dirname, 'dist'),
  remotePath: '/home/dist',
  oldRemotePath: '/home/dist_old',
});
```

## API 介绍

| 参数          | 描述                   | 默认 | 必填 |
| ------------- | ---------------------- | ---- | ---- |
| port          | 服务器端口             | --   | 是   |
| host          | 服务器地址             | --   | 是   |
| username      | 服务器登陆用户名       | --   | 是   |
| password      | 服务器登录密码         | --   | 是   |
| path          | 本地打包路径           | --   | 是   |
| remotePath    | 服务器上的目标路径     | --   | 是   |
| oldRemotePath | 服务器上的备份目标路径 | --   | 否   |
