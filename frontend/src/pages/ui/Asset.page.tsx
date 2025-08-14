import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../features/common/ui/PageContainer.ui';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { ST } from '@shared/config/kor.lang';
import { Card, CardListWrap } from '@entites/Card';
import { SubTitle } from '@entites/Title';
import { Text } from '@entites/Text';
import { useSelectAsset } from '@features/asset/api/asset.api';
import { useAssetData } from '@features/asset/hook/Asset.hook';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { toCost } from '@shared/libs/utils.lib';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card-list': {
			padding: '10px 0',

			'.card': {
				'.box': {
					padding: '4px 10px',
				},
			},
		},
	},
});

const AssetPage = () => {
	const { data } = useSelectAsset();

	const { data: list } = useAssetData(data);

	return (
		<>
			<StyledPage>
				<PageTitleBar title={ST.ASSET} />

				<Flex className='contents-layer' direction={'column'} flex={1}>
					<CardListWrap>
						<Card className={clsx('card')}>
							<Flex className={clsx('box border')} direction='column' gap={4}>
								{list?.map((item) => {
									return (
										<Flex className='row' justify={'between'}>
											<SubTitle title={dayjs(item.sdate).format('YYYY-MM-DD')} />
											<Text text={toCost(item?.price)} />
										</Flex>
									);
								})}
							</Flex>
						</Card>
					</CardListWrap>
				</Flex>
			</StyledPage>
		</>
	);
};

AssetPage.displayName = 'AssetPage';
export default AssetPage;
