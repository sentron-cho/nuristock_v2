import Flex from '@entites/Flex';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { OptionType } from '@shared/config/common.type';
import { TitleNavigation } from '@entites/TitleNavigation';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { ResearchItemType } from '@features/research/api/research.dto';
import { useResearchPerValueHook } from '@features/research/hook/Research.hook';
import { ST } from '@shared/config/kor.lang';
import { Text } from '@entites/Text';
import { MarketSiseDataType } from '@features/market/api/market.dto';
import { toCost } from '@shared/libs/utils.lib';
import { URL } from '@shared/config/url.enum';
import { useCommonHook } from '@shared/hooks/useCommon.hook';

const StyledContents = styled(Flex, {
	'&.investment-header': {
		'.contents': {
			padding: '20px 10px',

			'.rate': {
				color: '$gray700',
				fontSize: 12,
			},
		},

		'.up': {
			color: '$plus',
		},
		'.down': {
			color: '$minus',
		},
	},
});

export const ResearchDetailHeader = ({
	value,
	options,
	data,
	sise,
	onClickNavi,
}: {
	value?: string;
	options?: OptionType[];
	data?: ResearchItemType;
	sise?: MarketSiseDataType;
	onClickNavi?: (value?: string) => void;
}) => {
	const { isMobile } = useCommonHook();
	const { list } = useResearchPerValueHook(data, ['rate4', 'rate3', 'rate2']);

	const onClick = (value?: string) => {
		onClickNavi?.(value);
	};

	const onClickTitle = () => {
		if (value) {
			isMobile ? window.open(`${URL.REST.NAVER}?code=${value.replace('A', '')}`) : window.open(`${URL.REST.FNGUIDE(value)}`);
		}
	};

	return (
		<ContentsHeader stickyTop={44}>
			{/* 타이틀 및 네비게이션 */}
			<TitleNavigation
				withTitleValue
				height={28}
				options={options}
				value={value}
				onClick={onClick}
				onClickTitle={onClickTitle}
			/>

			{/* 주당가치 */}
			<StyledContents className={clsx('investment-header')} flex={1} direction={'column'}>
				<Flex className='contents' flex={1} gap={8} justify={'between'}>
					<Flex direction={'column'} gap={4}>
						<Text className={'rate'} text={`[${ST.SISE}]`} />
						<Text bold className={clsx('value')} text={`${toCost(sise?.sise)}`} />
					</Flex>

					{list?.map((item, index) => (
						<Flex key={`inhe-${index}`} direction={'column'} gap={4}>
							<Text className={'rate'} text={`[W ${data?.[item?.target]}]`} />
							<Text bold className={clsx('value', item?.updown)} text={`${item?.value}${ST.WON}`} />
						</Flex>
					))}
				</Flex>
			</StyledContents>
		</ContentsHeader>
	);
};
