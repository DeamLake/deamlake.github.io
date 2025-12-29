import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 部署时，如果仓库名不是 username.github.io，需要设置 base 路径
// 默认使用环境变量 VITE_BASE 或 '/'
// 如果仓库名是 TuBaoWeb，则 base 应该是 '/TuBaoWeb/'
const getBase = () => {
  // 可以通过环境变量设置，或者根据仓库名自动设置
  // 如果是在 GitHub Actions 中，可以通过环境变量传递
  return process.env.VITE_BASE || '/';
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: getBase(),
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
      }
    };
});
