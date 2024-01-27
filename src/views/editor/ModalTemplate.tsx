import { styled } from '@stitches/react';
import Modal from '@/components/Modal';
import { ICategory, ITemplate } from '@/types/interfaces';
import { useEffect, useRef, useState } from 'react';
import { Col, Input, Label, Row } from 'reactstrap';
import DropMenu, { IDropMenuItem } from '@/components/DropMenu';
import Thumbnail from '@/components/Thumbnail';
import { template as R } from '@/langs/views.langs';
import $api from '@/request/paths';
import { str } from '@/langs/common.langs';
import useRequest, { Method } from '@/hooks/useRequest';
import { MenuType, SizeType } from './Template.data';
import useValidCheck from '@/hooks/useValidCheck';

const StyledModal = styled('div', {
	img: {
		padding: '8px',
	},
});

const ModalTemplate = ({
	data,
	onClose,
	isEditMode = false,
}: {
	data: ITemplate;
	onClose: (isOk: boolean, value?: ITemplate) => void;
	isEditMode?: boolean;
}) => {
	const refTitle = useRef<HTMLInputElement>(null);
	const refCategory = useRef<HTMLInputElement>(null);
	// const refFile = useRef<HTMLInputElement>(null);
	const refType = useRef<HTMLInputElement>(null);
	const refSize = useRef<HTMLInputElement>(null);
	const refMedia = useRef<HTMLInputElement>(null);
	const refTag = useRef<HTMLInputElement>(null);
	const refCheck = useRef<HTMLInputElement>(null);

	const [modified, setModified] = useState<boolean>(false);
	const [categories, doRequestCategories] = useRequest<Array<ICategory>>();

	// const { showAlertError, showAlertSuccess } = useAlert();
	const { setCheckValid } = useValidCheck();

	useEffect(() => {
		doRequestCategories(Method.GET, $api.category.list, {});
	}, []);

	const onCloseModal = async (isOk: boolean) => {
		if (!isOk) return onClose(false);

		const category = setCheckValid(refCategory, R.modal.placeholder.category);
		if (!category) return;

		const title = setCheckValid(refTitle, R.modal.placeholder.subject);
		if (!title) return;

		const tag = setCheckValid(refTag, R.modal.placeholder.tag);
		if (!tag) return;

		// const media = setCheckValid(refMedia, R.modal.placeholder.media);
		// if (!media) return;

		// const size = setCheckValid(refSize, R.modal.placeholder.size);
		// if (!size) return;

		// const type = setCheckValid(refType, R.modal.placeholder.type);
		// if (!type) return;

		const premium = refCheck?.current?.checked as boolean;

		const params: ITemplate = {
			...data,
			title: title,
			categoryId: category,
			premium: premium,
			favorite: false,
			tag: tag,
			// type: type,
			// size: size,
			// media: media,
		};

		if (isEditMode) {
			if (!modified) return onClose(false);

			// const { id, productId } = data as IRequestItem;
			// const params = { id, productId, title, text: content, file };
			// res = await api.put($api.request.products, params);
		}

		onClose(true, params);
	};

	// const onClickThumbnail = () => {
	// 	console.log('썸네일');
	// };

	// const onSelectCategory = (selected: IDropMenuItem) => {
	// 	const { value } = selected;
	// 	setSelectedCategory(selected);
	// };

	const menus = (categories as Array<ICategory>)?.map((a) => {
		return { value: a.id, label: a.title };
	}) as IDropMenuItem[];

	const defaultCategory =
		data?.categoryId && menus
			? menus.find((a) => String(a.value) === String(data?.categoryId))
			: undefined;

	return (
		<Modal
			title={`${R.modal.title} ${isEditMode ? str.label.edit : str.label.save}`}
			footer={true}
			onClose={onCloseModal}
			size='lg'
			height='440px'
			overflow='hidden'
		>
			<StyledModal className='export'>
				<Row className='mt-2'>
					{/* 오른쪽 썸네일 */}
					<Col className='col-4'>
						<Thumbnail src={data?.image} size='lg' objectFit='scale-down' />
					</Col>

					{/* 왼쪽 입력폼 */}
					<Col className='col-8'>
						{/* 카테고리, 이름 */}
						<Row>
							<Col className='col-6'>
								<Label className='row'>{R.modal.category}</Label>
								<DropMenu
									className='row'
									width='100%'
									maxHeight='200px'
									menus={menus}
									ref={refCategory}
									defaultSelect={defaultCategory}
									onSelect={() => setModified(true)}
								/>
							</Col>
							<Col className='col-6'>
								<Label className='row'>{R.modal.subject}</Label>
								<Input
									className='row'
									defaultValue={data?.title}
									innerRef={refTitle}
									placeholder={R.modal.placeholder.subject}
									onChange={() => setModified(true)}
									spellCheck={false}
								/>
							</Col>
						</Row>

						{/* 파일 선택 */}
						{/* <Row className='mt-4'>
							<Col>
								<Input
									type='file'
									className='row'
									innerRef={refFile}
									defaultValue={isEditMode ? (data as ILibrary)?.files : ''}
									accept={'.png,.jpg,.jpeg,.pdf'}
									onChange={() => setModified(true)}
								/>
							</Col>
						</Row> */}

						{/* 태그 */}
						<Row className='mt-4'>
							<Col>
								<Input
									type='text'
									className='row'
									innerRef={refTag}
									defaultValue={data?.tag}
									accept={'.png,.jpg,.jpeg,.pdf'}
									onChange={() => setModified(true)}
									placeholder={R.modal.placeholder.tag}
									spellCheck={false}
								/>
							</Col>
						</Row>

						{/* 체크 */}
						<Row>
							<Col className='mt-4 p-0'>
								<Input
									type='checkbox'
									className='me-2'
									innerRef={refCheck}
									defaultChecked={data?.premium}
									onChange={() => setModified(true)}
								/>
								<Label className='m-0'>{R.modal.check}</Label>
							</Col>
						</Row>

						{/* 매체, 형식, 사이즈 */}
						<Row className='mt-4'>
							<Col className='col-4'>
								<DropMenu
									className='row'
									width='100%'
									menus={MenuType}
									ref={refMedia}
									onSelect={() => setModified(true)}
									placeholder='매체'
								/>
							</Col>
							<Col className='col-4'>
								<DropMenu
									className='row'
									width='100%'
									menus={SizeType}
									ref={refSize}
									onSelect={() => setModified(true)}
									placeholder='사이즈'
								/>
							</Col>
							<Col className='col-4'>
								<DropMenu
									className='row'
									width='100%'
									menus={MenuType}
									ref={refType}
									onSelect={() => setModified(true)}
									placeholder='형식'
								/>
							</Col>
						</Row>
					</Col>
				</Row>
			</StyledModal>
		</Modal>
	);
};

export default ModalTemplate;
