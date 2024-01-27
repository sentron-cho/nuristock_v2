import Loading from '@/components/Loading';
import { RootState } from '@/store/Store';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

export const BlankLayout = () => {
	const loading = useSelector<RootState>(
		(state) => state.main.loading
	) as string;

	return (
		<>
			<Outlet />
			{loading && <Loading />}
		</>
	);
};

export default BlankLayout;
