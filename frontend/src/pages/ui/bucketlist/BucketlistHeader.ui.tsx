import Flex from '@entites/Flex';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { Text } from '@entites/Text';
import { BucklistParamType } from '@features/bucketlist/api/bucketlist.dto';
import { toCost } from '@shared/libs/utils.lib';
import { ST } from '@shared/config/kor.lang';

const StyledContents = styled(Flex, {
	'&.bucket-header': {
		'.contents': {
			padding: '0px 10px',
		},
	},
});

export const BucketlistHeader = ({ params, onClick }: { params?: BucklistParamType; onClick?: () => void }) => {
	return (
		<ContentsHeader stickyTop={44}>
			{/* 입력 정보 */}
			<StyledContents className={clsx('bucket-header')} flex={1} direction={'column'} onClick={onClick}>
				<Flex className='contents' flex={1} gap={8} justify={'between'}>
					{params && (
						<Flex className='bucket-guide' direction={'column'} gap={4} align={'start'}>
							{/* <Title title='입력' /> */}
							<Flex justify={'between'}>
								<Text text={`${ST.BUCKETLIST.START_YEARS}/${ST.BUCKETLIST.YEARS}/${ST.BUCKETLIST.RATE}`} />
								<Text text={`${params.startYear}년/${params.years}년/${Math.round((params?.rate || 0) * 100)}%`} />
							</Flex>
							<Flex justify={'between'}>
								<Text text={ST.BUCKETLIST.PRINCIPAL} />
								<Text text={toCost(params.principal)} />
							</Flex>
							<Flex justify={'between'}>
								<Text text={ST.BUCKETLIST.ANNUAL} />
								<Text text={toCost(params.annual)} />
							</Flex>
						</Flex>
					)}
				</Flex>
			</StyledContents>
		</ContentsHeader>
	);
};
