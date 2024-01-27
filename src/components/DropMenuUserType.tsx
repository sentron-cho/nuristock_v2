import {
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
} from 'reactstrap';
import { register as R } from '@/langs/auth.langs';
import user1 from '@/assets/images/users/user1.jpg';
import user2 from '@/assets/images/users/user2.jpg';
import user3 from '@/assets/images/users/user3.jpg';
import user4 from '@/assets/images/users/other.jpg';
import { UserType } from '@/types/types';
import { styled } from '@stitches/react';
import { forwardRef, useEffect, useState } from 'react';

export const StyledDropMenuUserInfo = styled('div', {
	'& > .drop-box': {
		'.dropdown-toggle.btn-icon': {
			margin: '0',
			padding: '0',
			backgroundColor: 'transparent',
			border: 'none',

			'&::after': {
				border: 'none',
				content: 'none',
			},

			img: {
				border: '2px solid $border',
			},
		},

		'.dropdown-menu': {
			border: '1px solid $border',
			marginLeft: '5px',
			marginTop: '-20px',
			minWidth: '140px',
		},
	},
});

const DropItem = ({
	title,
	image,
	onClick,
	className = '',
}: {
	title: string;
	image: string;
	onClick: () => void;
	className?: string;
}) => {
	return (
		<DropdownItem onClick={onClick} className={`${className}`}>
			<div>
				<img
					src={image}
					alt='user'
					className='rounded-circle shadow'
					width='40'
				/>
				<span className='mx-2'>{title}</span>
			</div>
		</DropdownItem>
	);
};

const DropMenuUserType = forwardRef(
	(
		{
			onClick,
			type = UserType.none,
			className = '',
		}: {
			onClick?: (select: UserType) => void;
			type?: UserType;
			className?: string;
		},
		ref?: React.Ref<HTMLInputElement>
	) => {
		const [selected, setSelected] = useState<UserType>(type);

		useEffect(() => setSelected(type), [type]);

		const onClickDropdown = (type: UserType) => {
			setSelected(type);
			onClick && onClick(type);
		};

		return (
			<StyledDropMenuUserInfo className={`text-center ${className}`}>
				<UncontrolledDropdown className='drop-box my-4' direction='end'>
					{/* ref 제어를 위한 사용 */}
					<input
						ref={ref}
						value={selected}
						style={{ display: 'none' }}
						onChange={() => {}}
					/>
					<DropdownToggle caret className='btn-icon'>
						<img
							src={getUserTypeImage(selected)}
							alt='user'
							className='rounded-circle shadow'
							width='80'
							height='80'
						/>
					</DropdownToggle>
					<DropdownMenu>
						<DropItem
							title={R.dropmenu.professor}
							image={user1}
							onClick={() => onClickDropdown(UserType.professor)}
						></DropItem>
						<DropItem
							title={R.dropmenu.researcher}
							image={user2}
							onClick={() => onClickDropdown(UserType.researcher)}
						></DropItem>
						<DropItem
							title={R.dropmenu.student}
							image={user3}
							onClick={() => onClickDropdown(UserType.student)}
						></DropItem>
						<DropdownItem divider />
						<DropdownItem onClick={() => onClickDropdown(UserType.other)}>
							{R.dropmenu.other}
						</DropdownItem>
					</DropdownMenu>
				</UncontrolledDropdown>
			</StyledDropMenuUserInfo>
		);
	}
);

export default DropMenuUserType;

export const getUserTypeImage = (type: UserType) => {
	if (type === UserType.professor) {
		return user1;
	} else if (type === UserType.researcher) {
		return user2;
	} else if (type === UserType.student) {
		return user3;
	} else {
		return user4;
	}
};
