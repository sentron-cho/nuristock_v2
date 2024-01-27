import React, { Suspense } from 'react';
import { JSX } from 'react/jsx-runtime';
import Loading from '@/components/Loading';

// ===========================|| LOADABLE - LAZY LOADING ||=========================== //
export const Loadable =
	(Component: React.ComponentType) => (props: JSX.IntrinsicAttributes) => {
		return (
			<Suspense fallback={<Loading />}>
				<Component {...props} />
			</Suspense>
		);
	};
