import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../features/common/ui/PageContainer.ui';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { ST } from '@shared/config/kor.lang';
import { Card, CardListWrap } from '@entites/Card';
import { SubTitle } from '@entites/Title';
import { Text } from '@entites/Text';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { toCost } from '@shared/libs/utils.lib';
import { useSelectDeposit } from '@features/deposit/api/deposit.api';
import { useDepositData } from '@features/deposit/hook/Deposit.hook';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {},
});

const DepositPage = () => {
	const { data } = useSelectDeposit();

	const { data: list } = useDepositData(data);

	return (
		<>
			<StyledPage>
				<Flex direction={'column'}>
					<PageTitleBar title={ST.ASSET} />

					<Flex className='contents-layer' direction={'column'}>
						<CardListWrap>
							<Card className={clsx('card')}>
								<Flex className={clsx('box border')} direction='column' gap={4}>
									{list?.map((item) => {
										return (
											<Flex justify={'between'}>
												<SubTitle title={dayjs(item.sdate).format('YYYY-MM-DD')} />
												<Text text={toCost(item?.price)} />
											</Flex>
										);
									})}
								</Flex>
							</Card>
						</CardListWrap>
					</Flex>
				</Flex>
			</StyledPage>
		</>
	);
};

DepositPage.displayName = 'DepositPage';
export default DepositPage;