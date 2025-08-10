import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { ProfitPerCodePageMo } from './ProfitPerCode.page.mo';
import { IconArrowLeft } from '@entites/Icons';
import { styled } from '@styles/stitches.config';

const ProfitPerCode = () => {
	const { isMobile, onBack } = useCommonHook();

	return (
		<>
			{isMobile && <ProfitPerCodePageMo />}
			{!isMobile && <ProfitPerCodePageMo />}

			<BackButton fontSize='large' onClick={onBack} />
		</>
	);
};

ProfitPerCode.displayName = 'ProfitPerCode';
export default ProfitPerCode;

const BackButton = styled(IconArrowLeft, {
	position: 'fixed',
	left: '10px',
	bottom: '10px',
	zIndex: 100,
	color: '$white',
	background: '$primary',
	borderRadius: '100px',
	padding: '4px',

	'&:hover': {
		opacity: 0.8,
	},
});
