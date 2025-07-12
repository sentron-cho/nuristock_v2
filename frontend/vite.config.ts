import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// const envPath = path.resolve(new URL(import.meta.url).pathname, `.env.${mode}`);
	// dotenv.config({ path: envPath });
	const env = loadEnv(mode, process.cwd(), 'VITE_');

	// console.log({ env });
	console.log('[vite start]', { url: `http://${env?.VITE_API_URL}:${env?.VITE_PORT}` });

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
			port: Number(env.VITE_PORT), // 원하는 포트 번호
			proxy: {
				'/api': {
					target: env.VITE_API_URL,
					changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
		// resolve: {
		//   alias: {
		//     '@features': path.resolve(__dirname, 'src/features'),
		//     '@components': path.resolve(__dirname, 'src/components'),
		//     '@utils': path.resolve(__dirname, 'src/utils'),
		//   },
		// },
	};
});
