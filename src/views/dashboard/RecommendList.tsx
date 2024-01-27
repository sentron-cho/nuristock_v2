import { Button } from 'reactstrap';
import { SubTitle } from '@/components/Titlebar';
import { useState } from 'react';
import * as Icon from 'react-feather';
import { dashboard as R } from '@/langs/views.langs';
import { ITemplate } from '@/types/interfaces';
import { $url } from '@/request/paths';
import ModalAllTemps from './ModalAllTemps';
import { str } from '@/langs/common.langs';
import { useNavigate } from 'react-router-dom';
import useAlert from '@/hooks/useAlert';
import { EditTarget } from '@/types/types';
import Thumbnail from '@/components/Thumbnail';
import FlexWrap from '@/components/FlexWrap';
import Session from '@/store/Session';
import { StyledRecommend } from './RecommendList.style';

const RecommendList = ({
	items,
	doReload,
}: {
	items: ITemplate[] | null;
	doReload?: () => void;
}) => {
	const [isModal, setModal] = useState<boolean>(false);
	const navagate = useNavigate();
	const { showAlertError } = useAlert();

	const onClickPremium = () => {
		console.log('onClickPremium');
	};

	const onClickAllTemps = () => {
		setModal(true);
	};

	const onClick = (item: ITemplate) => {
		// console.log(item);
		if (item.image) {
			Session.setEditorParam({
				id: item.id as string,
				target: EditTarget.recommend,
			});
			navagate($url.editor.main);
		} else {
			showAlertError(str.alert.noservice);
		}
	};

	const onClickNew = () => {
		Session.removeEditorParam();
		navagate($url.editor.main);
	};

	return (
		<StyledRecommend>
			<SubTitle title={R.title.recommend}>
				<FlexWrap align='right'>
					<small
						role='button'
						className='text-primary'
						onClick={onClickAllTemps}
					>
						{R.link.templates}
					</small>
				</FlexWrap>
			</SubTitle>

			<div className='layout'>
				<span
					role='button'
					className='mt-3 text-center box'
					onClick={onClickNew}
				>
					<Button color='primary' className='new'>
						<Icon.Plus size={'50px'} />
					</Button>
					<h5 className='mt-2 text-center'>{R.label.new_template}</h5>
				</span>

				{items?.map((item: ITemplate, idx) => (
					<span
						role='button'
						key={`${idx}-${item.id}`}
						className='mt-3 text-center box'
						onClick={() => onClick(item)}
					>
						{item.premium && (
							<Icon.ThumbsUp
								fill='#555'
								className='icon-premium top-icon'
								onClick={onClickPremium}
							/>
						)}

						<Thumbnail src={item.image} size='md' alt='template' />

						<h5 className='mt-2 text-center'>{item.title}</h5>
					</span>
				))}
			</div>

			{isModal && (
				<ModalAllTemps
					onClose={() => {
						setModal(false);
						doReload?.();
					}}
				/>
			)}
		</StyledRecommend>
	);
};

export default RecommendList;
