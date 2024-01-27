import { Suspense } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import Routes from '@/routes/Router';
import '@/assets/scss/style.scss';
import { globalStyles } from './global.styled';
import Session from './store/Session';
import { $url } from './request/paths';

function App() {
	globalStyles();
	const routing = useRoutes(Routes);
	const location = useLocation();
	const { pathname } = location;

	// 로그인 상태 확인 및 페이지 이동
	if (
		pathname.startsWith($url.editor.root) ||
		pathname.startsWith($url.apps.root)
	) {
		if (!Session.getUserId()) window.location.href = $url.login.root;
	}

	return (
		<Suspense>
			<div>{routing}</div>
		</Suspense>
	);
}

export default App;
