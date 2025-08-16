import { ST } from '@shared/config/kor.lang';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { styled } from '@styles/stitches.config';
import { Text, TextProps } from '@entites/Text';

const StyledLineFiled = styled(Flex, {
	'&.col': {
		lineHeight: '20px',
		height: '20px',
	},
});

export const CardLineFiled = ({
	title,
	type,
	date,
	value,
	text,
	suffix = { text: ST.WON, value: ST.WON },
	className,
	options,
	height,
	onClick,
}: {
	title: string;
	type?: string;
	date?: string;
	value?: string | number;
	text?: string;
	suffix?: { text?: string; value?: string };
	className?: string;
	options?: {
		title?: TextProps;
		text?: TextProps;
		value?: TextProps;
	};
	height?: string | number;
	onClick?: () => void;
}) => {
	return (
		<StyledLineFiled
			className={clsx('col', type, className)}
			justify={'between'}
			style={height ? { lineHeight: height, height: height } : {}}
			onClick={(e) => {
				if (onClick) {
					e?.stopPropagation();
					onClick();
				}
			}}
		>
			<Flex className='left' gap={10} flex={1}>
				<Text className='title' {...options?.title} text={title} />
				<Flex className='middle' fullWidth={false} flex={1} gap={4} align={'end'}>
					{text && (
						<Flex fullWidth={false} gap={2}>
							<Text className='text' bold {...options?.text} text={text} />
							{suffix?.text && <Text bold {...options?.text} text={suffix.text} />}
						</Flex>
					)}
					{date && <Text size='xxs' className={'date'} text={`[${date}]`} flex={1} />}
				</Flex>
			</Flex>
			<Flex className='right' gap={2} justify={'end'} fullWidth={false}>
				<Text bold {...options?.value} text={value || 0} />
				{suffix?.value && <Text {...options?.value} text={suffix.value} />}
			</Flex>
		</StyledLineFiled>
	);
};
