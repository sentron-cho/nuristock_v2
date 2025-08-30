import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../../features/common/ui/PageContainer.ui';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { IconAdd } from '@entites/Icons';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { StatisticItemType, StatisticResponse } from '@features/statistic/api/statistic.dto';
import { useMemo } from 'react';
import Flex from '@entites/Flex';
import { SubTitle } from '@entites/Title';
import { Text } from '@entites/Text';
import { withCommas } from '@shared/libs/utils.lib';

const StyledPage = styled(PageContainer, {
	background: '$white',

	'.head': {
		position: 'sticky',
		top: 84,
		padding: '10px',
		paddingBottom: '0',
		background: '$bgcolor',
		zIndex: 1,

		'.total': {
			paddingTop: 10,
			paddingBottom: 8,
			color: '$gray700',
		},
	},

	'.list-head': {
		padding: '0 10px',
		background: '$gray400',
		position: 'sticky',
		top: '80px',
		zIndex: 1,
	},

	'.contents-layer': {
		padding: '0',

		'.box': {
			// border: '1px solid $gray500',
			padding: '0px 10px',
			borderRadius: 4,

			'.row': {
				marginBottom: '4px',
				borderBottom: '1px solid $gray600',
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

export const StatisticPageMo = ({
	data,
	onClick,
}: {
	data?: StatisticResponse;
	onClick?: (eid?: string, item?: StatisticItemType) => void;
}) => {
	console.log({ data });

	const list = useMemo(() => data?.value || [], [data]);

	return (
		<>
			<StyledPage>
				<Flex direction={'column'}>
					<PageTitleBar
						title={ST.MARKET}
						buttonProps={{
							eid: EID.ADD,
							icon: <IconAdd />,
							title: ST.ADD,
							onClick: onClick,
						}}
					/>
					<Flex className='head' direction={'column'}>
						{list?.map((item, index) => (
							<Flex key={index} className='box' direction={'column'}>
								<Flex className='row' align={'center'} height={30} justify={'between'}>
									<SubTitle title={`${item.code}`} />
									<Text text={withCommas(item.count)} />
								</Flex>
							</Flex>
						))}
					</Flex>
				</Flex>
			</StyledPage>
		</>
	);
};
