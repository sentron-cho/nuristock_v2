import { Row } from 'reactstrap';
import TitleBar from '@/components/Titlebar';
import { useEffect, useState } from 'react';
import { modal } from '@/langs/views.langs';
import { ICategory, ITemplate } from '@/types/interfaces';
import $api from '@/request/paths';
import api from '@/request/apis';
import Modal from '@/components/Modal';
import InputSearch from '@/components/InputSearch';
import DropMenu, { IDropMenuItem } from '@/components/DropMenu';
import ListView, { IListItem } from '@/components/ListView';
import { styled } from '@stitches/react';
import Loading from '@/components/Loading';
import NoData from '@/components/NoData';
import { str } from '@/langs/common.langs';
import FlexWrap from '@/components/FlexWrap';
import { TemplateList, TemplateListAll } from './TemplateList';
import useRequest, { Method } from '@/hooks/useRequest';
import Session from '@/store/Session';

interface IMenuTypes extends IDropMenuItem {
	sub: Array<IDropMenuItem>;
}

const StyledModal = styled('div', {
	display: 'flex',

	'.l-cats': {
		width: '240px',
	},

	'.r-temps': {
		width: 'calc(100% - 240px)',

		'.label': {
			padding: '15px 0',
		},

		'.list': {
			overflowY: 'auto',
			height: 'calc(100% - 100px)',
			position: 'relative',
		},
	},
});

const ModalAllTemps = ({ onClose }: { onClose: () => void }) => {
	const MenuType: Array<IMenuTypes> = [
		{
			value: 'type',
			label: '형식',
			sub: [{ value: 'size', label: '사이즈(비율)' }],
		},
		{
			value: 'journal',
			label: '저널',
			sub: [
				{ value: '1', label: '과학저널 상위 1' },
				{ value: '2', label: '과학저널 상위 2' },
				{ value: '3', label: '과학저널 상위 3' },
				{ value: '4', label: '과학저널 상위 4' },
				{ value: '5', label: '과학저널 상위 5' },
			],
		},
		{
			value: 'present',
			label: '프레젠테이션',
			sub: [
				{ value: 'wide', label: '16:9' },
				{ value: 'nomal', label: '4:3' },
			],
		},
		{
			value: 'publish',
			label: '출판',
			sub: [
				{ value: 'a4', label: 'A4' },
				{ value: 'a5', label: 'A5' },
				{ value: 'b5', label: 'B5' },
				{ value: 'b6', label: 'B6' },
			],
		},
	];

	const All = { id: 'all', label: modal.template.label };

	const [loaded, setLoaded] = useState<boolean>(false);
	// const [categoryList, setCategoryList] = useState<Array<ICategory>>([]);
	const [categories, setCategories] = useState<Array<IListItem>>([]);
	const [templates, setTemplates] = useState<Array<ITemplate>>([]);
	const [filters, setFilters] = useState<Array<ITemplate>>([]);
	const [label, setLabel] = useState<string>(modal.template.label);
	const [search, setSearch] = useState<string>('');
	const [sizeMenu, setSizeMenu] = useState<Array<IDropMenuItem>>(
		MenuType[0].sub
	);
	const [selected, setSelected] = useState<IListItem>(All);
	const [clear, setClear] = useState<string>('');

	const [, doRequestCategories] = useRequest<Array<ICategory>>();
	// const [, doRequestTemplates] = useRequest<Array<ITemplate>>();
	const [, doRequestFavorite] = useRequest<Array<ITemplate>>();

	useEffect(() => {
		doRequestCategories(Method.GET, $api.category.template, {
			params: { userId: Session.getUserId() },
		}).then((res) => {
			console.log(res);
			const array = (res?.data as Array<ICategory>).map((a) => ({
				id: a.id,
				label: a.title,
			})) as Array<IListItem>;

			const items = res?.data as Array<ICategory>;
			if (items) {
				// setCategoryList(items); // 원본(템플릿 데이터 포함)
				setCategories([...array]); // 목록(항목 리스트만)

				const list = new Array<ITemplate>();
				// TODO : 자기 자신것만 가져와야 하지 않을까?
				items.forEach((category) =>
					list.push(
						...category.templates.filter((a) => a.owner === Session.getUserId())
					)
				);

				console.log(list);
				setTemplates(list as Array<ITemplate>);
				setFilters(list as Array<ITemplate>);
			}

			setLoaded(true);
		});
	}, []);

	const doReload = async (categoryId: string, search: string = 'all') => {
		if (!templates) return;

		if (categoryId === 'all') {
			setFilters([...templates]);
		} else {
			setFilters(
				templates.filter((a) => a.categoryId === categoryId) as Array<ITemplate>
			);
		}
	};

	const onClickSearch = (value: string | undefined) => {
		console.log(value);

		const isCategory = (itemId: string, selectId: string) =>
			selectId === 'all' ? true : itemId === selectId;

		if (!value) {
			setFilters(
				templates.filter((item) => isCategory(item.categoryId, selected.id))
			);
			setSearch('');
			setLabel(selected.label);
			return;
		}

		if (templates) {
			const array = templates.filter((item) => {
				return (
					isCategory(item.categoryId, selected.id) &&
					item?.title?.includes(value)
				);
			});
			setSearch(value || '');
			setFilters(array);
			setLabel(modal.template.filteredResult);
		}
	};

	const onSelectType = (selected: IDropMenuItem) => {
		const subMenu = MenuType.find((a) => a.value === selected.value);
		setSizeMenu(subMenu?.sub || MenuType[0].sub);
	};

	const onSelectItem = (item: IListItem) => {
		if (item?.id === selected?.id) return;

		setSelected(item);
		doReload(item.id);
		setLabel(item.label);

		// 필터링 값 초기화
		// setFilters([]);
		setClear(new Date().valueOf().toString());
	};

	const onClickFavorite = async (item: ITemplate) => {
		console.log(item);

		// 원격에서 데이터 업데이트
		await doRequestFavorite(Method.POST, $api.template.update, {
			data: { id: item.id, favorite: !item.favorite },
		});

		// 로컬 데이터 업데이트
		const temp = templates.find((a) => a.id === item.id);
		temp && (temp.favorite = !item.favorite);

		doReload?.(selected.id);
	};

	const onClickFavoriteAll = async (items: ITemplate[]) => {
		// try {
		// 	const checked = items.filter((a) => a.favorite);
		// 	const params = items.map((item) => {
		// 		return {
		// 			id: item.id,
		// 			favorite: !(checked.length === items.length),
		// 		};
		// 	});
		// 	await api.put($api.template.item, params);
		// 	doReload?.(selected.id);
		// } catch (error) {
		// 	// !! ErrorBoundary 처리
		// 	console.error(error);
		// }
	};

	if (!categories || !filters) return <Loading />;

	return (
		<Modal onClose={onClose} size='xl' overflow='hidden'>
			<StyledModal className='h-100 px-1'>
				{/* 왼쪽 목록 */}
				<ListView
					select={selected}
					items={[All, ...categories]}
					onSelect={onSelectItem}
					className='l-cats h-100 me-4'
				/>

				{/* 오른쪽 템플릿 */}
				<div className='r-temps h-100'>
					{/* 검색 */}
					<InputSearch
						clear={clear}
						onClick={onClickSearch}
						placeholder={modal.template.placeholder}
					/>

					{/* 타이틀 */}
					<TitleBar title={label} className='label m-0'>
						<FlexWrap align='right'>
							<DropMenu
								className='mx-3'
								menus={MenuType}
								defaultSelect={MenuType[0]}
								onSelect={onSelectType}
								width='140px'
							/>
							<DropMenu menus={sizeMenu} width='140px' />
						</FlexWrap>
					</TitleBar>

					{/* 템플릿 */}
					<Row className='list m-0'>
						{!loaded && <Loading />}
						{filters?.length <= 0 && (
							<NoData
								title={search ? str.search.nosearch : str.search.notemplate}
							/>
						)}

						{selected.id === 'all' ? (
							<TemplateListAll
								categorys={categories}
								templates={filters}
								onClickFavorite={onClickFavorite}
								onClickFavoriteAll={onClickFavoriteAll}
							/>
						) : (
							<TemplateList
								key={selected.id}
								items={filters}
								onClickFavorite={onClickFavorite}
							/>
						)}
					</Row>
				</div>
			</StyledModal>
		</Modal>
	);
};

export default ModalAllTemps;
