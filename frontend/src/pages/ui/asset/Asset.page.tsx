import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { AssetPageMo } from './Asset.page.mo';
import { useSelectAsset } from '@features/asset/api/asset.api';

const BucketlistPage = () => {
	const { isMobile } = useCommonHook();

	const { data } = useSelectAsset();

	return (
		<>
			{isMobile && <AssetPageMo data={data} />}
			{!isMobile && <AssetPageMo data={data} />}
		</>
	);
};

BucketlistPage.displayName = 'BucketlistPage';
export default BucketlistPage;
