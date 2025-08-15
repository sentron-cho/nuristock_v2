import { FC } from 'react';
import { Box, Stack } from '@mui/material';
import { ST } from '@shared/config/kor.lang';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { ChartLegendProps } from './Chart.type';
import { SubTitle } from './Title';
import Flex from './Flex';
import { Text } from './Text';

const StyledBox = styled(Box, {
	'&.chart-legend': {
		// '.left': {
		// 	width: '30%',
		// },

		// '.right': {
		// 	width: '70%',
		// },

		'.label, .text': {
			// maxWidth: '100px',
      fontSize: '12px',
      fontStretch: '80%'
    },
    
		'.text': {
      fontSize: '10px',
      fontStretch: '80%'
		},
	},
});

export const ChartLegend: FC<ChartLegendProps> = ({
	data,
	showRight = true,
	valueFormatter = (v) => v.toLocaleString('ko-KR') + ST.WON,
	onLegendClick,
}) => {
	return (
		<StyledBox className={clsx('chart-legend')} sx={{ flex: 1, minWidth: 0 }}>
			<Stack spacing={1.0}>
				{data.map((s) => (
					<Box
						key={s.key || s.name}
						display='flex'
						alignItems='center'
						justifyContent='space-between'
						gap={1.5}
						sx={{ cursor: onLegendClick ? 'pointer' : 'default' }}
						onClick={() => onLegendClick?.(s)}
					>
						<Flex fullWidth={false} className='left' gap={10} flex={1}>
							{/* 범례 색상 */}
							<Box
								sx={{
									width: 12,
									height: 12,
									borderRadius: '50%',
									bgcolor: s.color,
									flex: '0 0 auto',
								}}
							/>
							{/* 타이틀 */}
							<SubTitle className={clsx('title', 'ellipsis')} title={s.name} />
						</Flex>

						{showRight && (
							<Flex fullWidth={false} className='right' justify={'between'} flex={1}>
								{s?.label && <SubTitle className={clsx('label', 'ellipsis')} title={s.label} />}
								{s?.value && <Text className={clsx('text', 'ellipsis')} text={valueFormatter(s.value)} />}
							</Flex>
						)}
					</Box>
				))}
			</Stack>
		</StyledBox>
	);
};
