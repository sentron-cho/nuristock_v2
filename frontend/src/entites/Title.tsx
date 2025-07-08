import { Typography } from '@mui/material';

export const Title = ({ title }: { title: string }) => {
	return (
		<Typography fontWeight={'bold'} fontSize={'large'} className='title'>
			{title}
		</Typography>
	);
};

export const SubTitle = ({ title }: { title: string }) => {
	return (
		<Typography fontWeight={'bold'} fontSize={'medium'} className='title'>
			{title}
		</Typography>
	);
};
