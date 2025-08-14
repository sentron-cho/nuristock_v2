import Flex from '@entites/Flex';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { OptionType } from '@shared/config/common.type';
import { TitleNavigation } from '@entites/TitleNavigation';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { InvestmentItemType } from '@features/investment/api/investment.dto';
import { Title } from '@entites/Title';
import { useInvestmentPerValueHook } from '@features/investment/hook/Investment.hook';
import { ST } from '@shared/config/kor.lang';
import { Text } from '@entites/Text';

const StyledContents = styled(Flex, {
	'&.investment-header': {
		'.contents': {
			padding: '20px 10px',

			'.rate': {
				color: '$gray700',
				fontSize: 12,
			}
		},

		'.up': {
			color: '$plus',
		},
		'.down': {
			color: '$minus',
		},
	},
});

export const InvestmentDetailHeader = ({
	value,
	options,
	data,
	onClickNavi,
}: {
	value?: string;
	options?: OptionType[];
	data?: InvestmentItemType;
	onClickNavi?: (value?: string) => void;
}) => {
	const { list } = useInvestmentPerValueHook(data, ['rate4', 'rate3', 'rate2']);

	const onClick = (value?: string) => {
		onClickNavi?.(value);
	};

	return (
		<ContentsHeader stickyTop={44}>
			{/* 타이틀 및 네비게이션 */}
			<TitleNavigation withTitleValue height={28} options={options} value={value} onClick={onClick} />

			{/* 주당가치 */}
			<StyledContents className={clsx('investment-header')} flex={1} direction={'column'}>
				<Flex className='contents' flex={1} gap={8} justify={'between'}>
					{list?.map((item) => (
						<Flex direction={'column'} gap={4}>
							<Text className={'rate'} text={`[W ${data?.[item?.target]}]`} />
							<Title className={clsx('value', item?.updown)} title={`${item?.value}${ST.WON}`} />
						</Flex>
					))}
				</Flex>
			</StyledContents>
		</ContentsHeader>
	);
};
