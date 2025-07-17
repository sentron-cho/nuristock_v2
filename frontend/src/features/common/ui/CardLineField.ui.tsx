import { ST } from '@shared/config/kor.lang';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { styled } from '@styles/stitches.config';
import { Text } from '@entites/Text';

const StyledLineFiled = styled(Flex, {

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
			<Flex className='left' gap={10} flex={1}>
				<Text className='title' text={title} />
				<Flex className='middle' fullWidth={false} flex={1} gap={4} align={'end'}>
					{text && (
						<Flex fullWidth={false}>
							<Text className='text' bold text={text} />
							{suffix?.text && <Text bold text={suffix.text} />}
						</Flex>
					)}
					{date && <Text size='xxs' className={'date'} text={`[${date}]`} flex={1}/>}
				</Flex>
			</Flex>
			<Flex className='right' gap={2} justify={'end'} fullWidth={false}>
				<Text bold text={value || 0} />
				{suffix?.value && <Text text={suffix.value} />}
			</Flex>
		</StyledLineFiled>
	);
};
