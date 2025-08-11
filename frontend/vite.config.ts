import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), 'VITE_');

	console.log('[START]', { url: `${env?.VITE_HOST}:${env?.VITE_PORT}` });
	console.log('[API]', { url: `${env?.VITE_API_URL}` });

	return {
		plugins: [react(), tsconfigPaths()],
		logLevel: 'error',
		resolve: {
			alias: [
				// { find: '@src', replacement: resolve(__dirname, 'src') },
				{ find: '@features', replacement: resolve(__dirname, 'src/features') },
				{ find: '@styles', replacement: resolve(__dirname, 'src/styles') },
			],
		},
		server: {
			// host: env.VITE_HOST,
			port: Number(env.VITE_PORT), // 원하는 포트 번호
			// host: true, // 외부 접근 허용
			proxy: {
				'/api': {
					target: env?.VITE_API_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '/api'), // 경로 유지
				},
			},
		},
	};
});
