import ButtonGroup from '@/components/ButtonGroup';
import FlexWrap from '@/components/FlexWrap';
import { styled } from '@stitches/react';
import { useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { ButtonItems } from './Editor.data';
import InputSearch from '@/components/InputSearch';
import { editor as R } from '@/langs/views.langs';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';
import SidebarLibraryList from './SiderbarLibraryList';
import { ICategory, ILibrary } from '@/types/interfaces';
import $api from '@/request/paths';
import useRequest, { Method } from '@/hooks/useRequest';
import Session from '@/store/Session';
import { LibraryType } from '@/types/types';
// import ModalLibrary from '../library/ModalLibrary';
import { filteredListItems } from '@/utils/utils';

const StyledLibrary = styled('div', {
	position: 'fixed',
	top: 0,
	right: 0,
	width: '100vw',
	height: '100vh',
	zIndex: '1000',

	'div.bg': {
		position: 'absolute',
		top: 0,
		left: 0,
		background: '$dark',
		opacity: '0.1',
		width: '100%',
		height: '100%',
	},

	'.side-bar': {
		height: '100%',
		width: '400px',
		background: 'white',
		position: 'absolute',
		top: '0',
		right: '0',
	},
});

const SidebarLibrary = ({
	onClose,
	onSelect,
}: {
	onClose: () => void;
	onSelect?: (item: ILibrary) => void;
}) => {
	const [categories, doRequestCategories] = useRequest<Array<ICategory>>();
	const [libraries, doRequestLibraries] = useRequest<Array<ILibrary>>();
	const [, doRequestLibrary] = useRequest<ILibrary>();
	const [selectedType, setSelectedType] = useState<LibraryType>(
		ButtonItems[0].value as LibraryType
	);
	const [search, setSearch] = useState<string>();
	const [modal, setModal] = useState<boolean>(false);
	// const [loaded, setLoaded] = useState<boolean>();

	useEffect(() => {
		doReload();
	}, []);

	const doReload = () => {
		doRequestCategories(Method.GET, $api.category.library, {
			params: { userId: Session.getUserId() },
		});

		doRequestLibraries(Method.GET, $api.library.all, {
			params: {},
		});
	};

	const onSelectItem = (item: ILibrary) => {
		item?.id &&
			doRequestLibrary(Method.GET, $api.library.get(item.id)).then((res) => {
				if (res?.data) {
					onSelect?.(res?.data as ILibrary);
				}
			});
	};

	const onCloseModal = (isOk: boolean) => {
		if (isOk) {
			doReload();
		}

		setModal(false);
	};

	return (
		<StyledLibrary className={`libarary-bar`}>
			<div className='bg' onClick={onClose} />

			<SimpleBar className='side-bar' style={{ height: '100%' }}>
				<div className='p-4'>
					{/* 타이틀 */}
					<h1 className='fw-bold fs-4 mb-4'>라이브러리</h1>

					{/* 버튼그룹 */}
					<FlexWrap className='btn-types'>
						<ButtonGroup
							items={ButtonItems}
							defaultSelected={selectedType}
							size={'md'}
							width='100%'
							onClick={(type) => setSelectedType(type as LibraryType)}
						/>
					</FlexWrap>

					{/* 검색바 */}
					<InputSearch
						onClick={setSearch}
						placeholder={R.placeholder.search}
						className='mt-3'
						rightButton={
							<Button color='primary'>
								<Icon.Plus onClick={() => setModal(true)} />
							</Button>
						}
					/>

					{/* 라이브러리 목록 */}
					<SidebarLibraryList
						categories={categories || []}
						libraries={filteredListItems(libraries, search, selectedType)}
						className={'mt-3'}
						onSelect={onSelectItem}
					/>
				</div>
			</SimpleBar>

			{/* 추가 팝업 */}
			{/* {modal && (
				<ModalLibrary
					type={selectedType as LibraryType}
					isEditMode={false}
					categories={categories}
					onClose={onCloseModal}
				/>
			)} */}
		</StyledLibrary>
	);
};

export default SidebarLibrary;
