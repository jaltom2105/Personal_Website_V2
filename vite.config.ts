import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          projects: path.resolve(__dirname, 'projects.html'),
          resume: path.resolve(__dirname, 'resume.html'),
          experiments: path.resolve(__dirname, 'experiments.html'),
          'exp-circuit-hopper': path.resolve(__dirname, 'exp-circuit-hopper.html'),
          'exp-red-button': path.resolve(__dirname, 'exp-red-button.html'),
          'exp-photo-booth': path.resolve(__dirname, 'exp-photo-booth.html'),
          'project-unity-ml': path.resolve(__dirname, 'project-unity-ml.html'),
          'project-ai-portfolio': path.resolve(__dirname, 'project-ai-portfolio.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
