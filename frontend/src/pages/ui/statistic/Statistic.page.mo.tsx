import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../../features/common/ui/PageContainer.ui';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { ST } from '@shared/config/kor.lang';
import { StatisticResponse } from '@features/statistic/api/statistic.dto';
import { useMemo } from 'react';
import Flex from '@entites/Flex';
import { Title } from '@entites/Title';
import { Text } from '@entites/Text';
import { withCommas } from '@shared/libs/utils.lib';
import { StatisticTitle } from '@features/statistic/config/Statistic.data';

const StyledPage = styled(PageContainer, {
	background: '$white',

	'.contents-layer': {
		padding: '0',

		'.box': {
			// border: '1px solid $gray500',
			borderRadius: 4,

			'.th': {
				padding: '4px',
				backgroundColor: '$gray400',
			},

			'.tr': {
				padding: '0px 10px',
			},
		},

		'.minus': {
			color: '$minus',
		},
		'.plus': {
			color: '$plus',
		},
	},
});

export const StatisticPageMo = ({ data }: { data?: StatisticResponse }) => {
	const list = useMemo(() => data?.value || [], [data]);

	return (
		<>
			<StyledPage>
				<Flex direction={'column'}>
					<PageTitleBar title={ST.MENU.STATISTIC} />
					<Flex className='contents-layer' direction={'column'}>
						{list?.map((item, index) => {
							const { title } = item;

							return (
								<Flex key={index} className='box' direction={'column'}>
									{title && (
										<Flex className='th' align={'center'} justify={'center'}>
											<Title title={`${StatisticTitle[item.code]}`} />
										</Flex>
									)}
									{!title && (
										<Flex className='tr' align={'center'} height={30} justify={'between'}>
											<Text bold text={`${StatisticTitle[item.code]}`} />
											<Text text={withCommas(item.count)} />
										</Flex>
									)}
								</Flex>
							);
						})}
					</Flex>
				</Flex>
			</StyledPage>
		</>
	);
};
