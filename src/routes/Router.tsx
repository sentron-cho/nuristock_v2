import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { path, $url } from '@/request/paths';
import Editor from '@/views/editor/Editor';
import React from 'react';
import { JSX } from 'react/jsx-runtime';

const Loadable =
	(Component: React.ComponentType) => (props: JSX.IntrinsicAttributes) =>
		<Component {...props} />;

/****Layouts*****/
const FullLayout = Loadable(lazy(() => import('@/layouts/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('@/layouts/BlankLayout')));

/***** Pages ****/
const Dashboard = Loadable(lazy(() => import('@/views/dashboard/Dashboard')));

/***** Auth Pages ****/
const Login = Loadable(lazy(() => import('@/views/auth/Login')));
const Register = Loadable(lazy(() => import('@/views/regist/Register')));
const Recover = Loadable(lazy(() => import('@/views/recove/Recover')));

const PageNotFound = Loadable(lazy(() => import('@/views/error/PageNotFound')));

/*****Routes******/
const Routes = [
	// 메인 루트
	{
		path: path.root,
		element: <Navigate to={$url.login.root} />,
	},
	// 로그인
	{
		path: path.login,
		element: <Login />,
	},
	// 회원 가입 및 찾기
	{
		path: path.auth,
		element: <BlankLayout />,
		children: [
			{
				path: '',
				element: <Navigate to={$url.login.root} />,
			},
			{ path: path.register, element: <Register /> },
			{ path: path.recover, element: <Recover /> },
		],
	},
	// 메인 페이지
	{
		path: path.apps,
		element: <FullLayout />,
		children: [
			{
				path: '',
				element: <Navigate to={$url.apps.dashboard} />,
			},
			{
				path: path.dashboard,
				exact: true,
				element: <Dashboard />,
			},
		],
	},
	// 에디터 페이지
	{
		path: path.editor,
		element: <BlankLayout />,
		children: [{ path: 'main', exact: true, element: <Editor /> }],
	},
	// 에러 페이지
	{ path: 'notfound', element: <PageNotFound /> },
	{ path: '*', element: <Navigate to='/notfound' /> },
];

export default Routes;
