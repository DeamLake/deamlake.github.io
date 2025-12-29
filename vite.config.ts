import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';

// GitHub Pages 部署时，如果仓库名不是 username.github.io，需要设置 base 路径
// 默认使用环境变量 VITE_BASE 或 '/'
// 如果仓库名是 TuBaoWeb，则 base 应该是 '/TuBaoWeb/'
const getBase = () => {
  // 可以通过环境变量设置，或者根据仓库名自动设置
  // 如果是在 GitHub Actions 中，可以通过环境变量传递
  const base = process.env.VITE_BASE || '/';
  // 调试输出（仅在构建时）
  if (process.env.NODE_ENV === 'production' || process.env.CI) {
    console.log(`[Vite Config] Base path set to: "${base}"`);
  }
  return base;
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // 插件：在构建后创建 .nojekyll 文件
        {
          name: 'create-nojekyll',
          closeBundle() {
            const nojekyllPath = path.resolve(__dirname, 'dist', '.nojekyll');
            writeFileSync(nojekyllPath, '');
            console.log('Created .nojekyll file for GitHub Pages');
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
          output: {
            // 确保 JavaScript 文件使用 .js 扩展名而不是 .mjs
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          }
        }
      }
    };
});
