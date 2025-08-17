import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { BucketlistPageMo } from './Bucketlist.page.mo';

const BucketlistPage = () => {
  const { isMobile } = useCommonHook();

  return (
    <>
      {isMobile && (
        <BucketlistPageMo />
      )}
      {!isMobile && (
        <BucketlistPageMo />
      )}
    </>
  );
};

BucketlistPage.displayName = 'BucketlistPage';
export default BucketlistPage;
