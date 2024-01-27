import { Button, Input } from 'reactstrap';
import * as Icon from 'react-feather';
import { Logo } from '@/assets/svg/images';
import Profile from '@/layouts/header/Profile';
import Notification from '@/layouts/header/Notification';
import { editor as R } from '@/langs/views.langs';

const EditorHeader = ({
	title,
	onClick,
}: {
	title: string;
	onClick: () => void;
}) => {
	return (
		<div className='header'>
			{/* 로고 */}
			<div className='logo'>
				<Logo />
			</div>

			{/* 타이틀 */}
			<div className='title-bar'>
				<Input
					type='text'
					// bsSize='lg'
					defaultValue={title}
					className='text-center'
					spellCheck={false}
					placeholder={R.placeholder.title}
				/>
			</div>

			{/* 라이브러리 버튼 */}
			<div className='side-menus'>
				<Notification />
				<Profile />

				<Button className='btn-library ms-3' onClick={onClick} color='primary'>
					<Icon.BookOpen className='me-2' size={16} />
					라이브러리
				</Button>
			</div>
		</div>
	);
};

export default EditorHeader;
