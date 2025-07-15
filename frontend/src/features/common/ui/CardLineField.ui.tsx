
import { ST } from '@shared/config/kor.lang';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { styled } from '@styles/stitches.config';
import { Text } from '@entites/Text';

const StyledLineFiled = styled(Flex, {
	fontSize: '$sm',

	'.MuiTypography-root': {
		fontSize: '$sm',
	},

	'.left': {
		width: '200px',
	},

	'.right': {
		textAlign: 'right',
		flex: 1,
		fontSize: '$xs',
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
}: {
	title: string;
	type?: string;
	date?: string;
	value?: string | number;
	text?: string;
	suffix?: { text?: string; value?: string };
	className?: string;
}) => {
	return (
		<StyledLineFiled className={clsx('col', type, className)} justify={'between'}>
			<Flex className='left' gap={10} width={120}>
				<Text className='title' text={title} />
				<Flex className='middle' flex={1}>
					{text && (
						<Flex>
							<Text className='text' bold text={text} />
							{suffix?.text && <Text bold text={suffix.text} />}
						</Flex>
					)}
					{date && <Text className={'date'} text={`[${date}]`} />}
				</Flex>
			</Flex>
			<Flex className='right' gap={2} justify={'end'} flex={1}>
				<Text bold text={value || 0} />
				{suffix?.value && <Text text={suffix.value} />}
			</Flex>
		</StyledLineFiled>
	);
};
