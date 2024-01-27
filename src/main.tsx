import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/store/Store';
import MainAlert from './views/main/MainAlert.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>

			{/* 공통으로 사용하기 위한 Alert */}
			<MainAlert />
		</Provider>
	</React.StrictMode>
);
