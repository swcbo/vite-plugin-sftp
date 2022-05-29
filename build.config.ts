/*
 * @Author: swcbo
 * @Date: 2022-05-29 22:45:57
 * @LastEditors: swcbo
 * @LastEditTime: 2022-05-29 22:52:55
 * @FilePath: /vite-plugin-sftp/build.config.ts
 * @Description:
 */
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  entries: ['./src/index'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
