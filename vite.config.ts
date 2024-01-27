import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svgr(), // svg 컴포넌트 임포트 설정
		react(),
	],
	resolve: {
		// 절대 경로 임포트 설정
		alias: [{ find: '@', replacement: '/src' }],
	},
	define: {
		'process.env.IS_PREACT': JSON.stringify('true'),
	},
	server: {
		proxy: {
			'/scidraw': {
				target: 'http://141.164.36.231:8080',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/scidraw/, '/scidraw/v1'),
				secure: false,
				ws: true,
			},
		},
	},
});
