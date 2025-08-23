import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { IconArrowLeft } from '@entites/Icons';
import { styled } from '@styles/stitches.config';
import { ProfitPerDayPageMo } from './ProfitPerDay.page.mo';

const ProfitPerDayPage = () => {
	const { isMobile, onBack } = useCommonHook();

	return (
		<>
			{isMobile && <ProfitPerDayPageMo />}
			{!isMobile && <ProfitPerDayPageMo />}

			<BackButton fontSize='large' onClick={onBack} />
		</>
	);
};

ProfitPerDayPage.displayName = 'ProfitPerDayPage';
export default ProfitPerDayPage;

const BackButton = styled(IconArrowLeft, {
	position: 'fixed',
	left: '10px',
	bottom: '10px',
	zIndex: '$footerButton',
	color: '$white',
	background: '$primary',
	borderRadius: '100px',
	padding: '4px',

	'&:hover': {
		opacity: 0.8,
	},
});
