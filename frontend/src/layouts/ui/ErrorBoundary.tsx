// import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
// import { useToast } from '../hooks/toast.hook';
// import { useEffect } from 'react';
// import { ST } from '@shared/config/kor.lang';

// const ErrorFallback = ({ error }: FallbackProps) => {
// 	const toast = useToast();

// 	// 에러 발생 시 토스트로 알림
// 	useEffect(() => {
// 		toast.error(error.message || ST.ERROR_UNKNOWN);
// 	}, [error, toast]);

// 	return (
// 		<div role='alert' style={{ padding: '2rem' }}>
// 			<h2>{ST.ERROR_PROBLEM}</h2>
// 			<pre style={{ color: 'red' }}>{error.message}</pre>
// 		</div>
// 	);
// };

// export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
// 	return (
// 		<ReactErrorBoundary
// 			FallbackComponent={ErrorFallback}
// 			onError={(error, info) => {
// 				console.error('ErrorBoundary caught:', error);
// 				console.error('Component Stack:', info?.componentStack);
// 			}}
// 		>
// 			{children}
// 		</ReactErrorBoundary>
// 	);
// };

import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useToast } from '../hooks/toast.hook';
import { ST } from '@shared/config/kor.lang';

type ErrorMap = { [key: string]: string };

export const ErrorType = {
	Unknown: 'Unknown',
	NetworkError: 'NetworkError',
	NotFound: 'NotFound',
}

const errorMessages: ErrorMap = {
	Unknown: ST.ERROR_UNKNOWN,
	NetworkError: ST.ERROR_NETWORK,
	NotFound: ST.ERROR_NOT_FOUND,
};

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
	const toast = useToast();

	const message = error.message || errorMessages[error.name] || ST.ERROR_UNKNOWN;

	React.useEffect(() => {
		toast.error(message);
	}, [message, toast]);

	return (
		<div role='alert' style={{ padding: '2rem', textAlign: 'center' }}>
			<h2 style={{ marginBottom: '1rem' }}>⚠️ {ST.ERROR_PROBLEM}</h2>
			<p style={{ color: '#e53935', marginBottom: '1rem' }}>{message}</p>
			<button
				onClick={resetErrorBoundary}
				style={{
					padding: '0.5rem 1.25rem',
					backgroundColor: '#1976d2',
					color: '#fff',
					borderRadius: '6px',
					border: 'none',
					cursor: 'pointer',
				}}
			>
				다시 시도
			</button>
		</div>
	);
};

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
	return (
		<ReactErrorBoundary
			FallbackComponent={ErrorFallback}
			onError={(error, info) => {
				console.error('ErrorBoundary caught:', error);
				console.error('Component Stack:', info?.componentStack);
			}}
			onReset={() => {
				// 페이지를 리셋하거나 상태 초기화 가능
				window.location.reload();
			}}
		>
			{children}
		</ReactErrorBoundary>
	);
};
