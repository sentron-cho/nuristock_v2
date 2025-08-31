import { FC } from 'react';
import { Box, Stack } from '@mui/material';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { ChartLegendProps } from './Chart.type';
import Flex from './Flex';
import { Text } from './Text';

const StyledBox = styled(Box, {
	'&.chart-legend': {
		'.title': {
			maxWidth: '64px',
			// fontSize: '14px',
		},

		'.label, .text': {
			// maxWidth: '100px',
			// fontSize: '12px',
			fontStretch: '80%',
		},

		'.right': {
			paddingLeft: '20px',
		},

		'.text': {
			// fontSize: '10px',
			fontStretch: '80%',
			color: '$gray700',
		},
	},
});

export const ChartLegend: FC<ChartLegendProps> = ({
	data,
	valueFormatter = (v) => v.toLocaleString(),
	onClick,
}) => {
	return (
		<StyledBox className={clsx('chart-legend')} sx={{ flex: 1, minWidth: 0 }}>
			<Stack spacing={0.4}>
				{data.map((s) => (
					<Box
						key={s.key || s.name}
						display='flex'
						alignItems='center'
						justifyContent='space-between'
						sx={{ cursor: onClick ? 'pointer' : 'default' }}
						onClick={() => onClick?.(s)}
					>
						<Flex fullWidth={false} className='left' gap={10} flex={1} height={18}>
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
							<Flex gap={4} flex={1}>
								<Text size='xs' bold className={clsx('title', 'ellipsis')} text={s.name} />
								{s?.value && <Text size='xxs' className={clsx('text', 'ellipsis')} text={`[${valueFormatter(s.value)}]`} />}
							</Flex>

							{s?.label && (
								<Flex flex={1} justify={'end'}>
									<Text bold className={clsx('label', 'ellipsis')} text={s.label} />
								</Flex>
							)}
						</Flex>
					</Box>
				))}
			</Stack>
		</StyledBox>
	);
};
