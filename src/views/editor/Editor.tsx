import { Excalidraw } from '@excalidraw/excalidraw';
import { useEffect, useState } from 'react';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import useAlert from '@/hooks/useAlert';
import { IDrawData, ILibrary, IPostion, ITemplate } from '@/types/interfaces';
import $api from '@/request/paths';
import { str } from '@/langs/common.langs';
import useLoading from '@/hooks/useLoading';
import ModalTemplate from './ModalTemplate';
// import { editor as R } from '@/langs/views.langs';
import EditorMenus from './EditorMenus';
import ExcalUtil from './Editor.utils';
import useRequest, { Method } from '@/hooks/useRequest';
import Session from '@/store/Session';
import { EditTarget, LibraryType } from '@/types/types';
import SidebarLibrary from './SidebarLibrary';
import { StyledEditor } from './Editor.style';
import EditorHeader from './EditorHeader';

const Editor = () => {
	const [excalidrawAPI, setExcalidrawAPI] =
		useState<ExcalidrawImperativeAPI | null>(null);
	const [loadedTemplate, setLoadedTemplate] = useState<ITemplate | null>(null);
	const [savedTemplate, setSavedTemplate] = useState<ITemplate | null>(null);
	const [modalSave, setModalSave] = useState<ITemplate | null>(null);
	const [modalUpdate, setModalUpdate] = useState<ITemplate | null>(null);
	const [showLibrary, setShowLibrary] = useState<boolean>(false);
	const [pos, setPos] = useState<IPostion>({ x: 100, y: 100 });

	const { onLoading } = useLoading();
	const [, doRequestSave] = useRequest();
	const [, doRequestUpdate] = useRequest();
	const [, doRequestGetTemplate] = useRequest();
	// const [image, setImage] = useState<string | null>(null);

	const { showAlertError, showAlertSuccess } = useAlert();

	useEffect(() => {
		const { id, target } = Session.getEditorParam();
		// console.log({ id, target });

		if (id && target) {
			onLoading(true);

			doRequestGetTemplate(Method.GET, $api.template.get(id), {
				params: { userId: Session.getUserId() },
			}).then((res) => {
				if (res?.data) {
					const data = res.data as ITemplate;

					onLoadData(data);
					setLoadedTemplate(data);
				}
			});
		}

		clearPosition();
	}, [excalidrawAPI]);

	useEffect(() => {
		// window.onkeydown = (e) => {
		// 	e.stopImmediatePropagation();
		// 	onClickSave();
		// 	console.log(e);
		// };

		return () => {};
	}, []);

	const clearPosition = () => {
		const root = document.querySelector('.excalidraw');
		if (root) {
			const { clientHeight, clientWidth } = root;
			setPos({ x: clientWidth / 2, y: clientHeight / 2 });
		}
	};

	const onLoadData = async (data: ITemplate) => {
		if (!excalidrawAPI) return;

		const exutil = ExcalUtil(excalidrawAPI);
		const elements = exutil.getElements();
		// if (!exutil.isElements())
		// 	return showAlertError('알수 없는 오류가 발생했습니다.');

		if (elements && elements.length > 0) {
			return showAlertError('편집중인 데이터가 있습니다.');
		} else {
			try {
				if (data && 'data' in data) {
					const { files, elements } = data.data as IDrawData;
					// console.log('[onLoadData]', { files, elements });
					exutil.loadElement(elements, files);
				} else {
					showAlertError('손상된 데이터입니다.');
				}
			} catch (error) {
				showAlertError(str.alert.error(error));
			}
		}
	};

	// const onClickImport = (id: string = '-1') => {
	// 	if (!excalidrawAPI) return;

	// 	const exutil = ExcalUtil(excalidrawAPI);
	// 	const elements = exutil.getElements();
	// 	if (!exutil.isElements())
	// 		return showAlertError('알수 없는 오류가 발생했습니다.');

	// 	if (elements && elements.length > 0) {
	// 		return showAlertError('편집중인 데이터가 있습니다.');
	// 	} else {
	// 		importJson(id);
	// 	}
	// };

	// const importJson = async (id: string = '-1') => {
	// 	if (!excalidrawAPI) return;

	// 	try {
	// 		const data = (await api.get($api.editor.data, {
	// 			params: { id: id },
	// 		})) as object;

	// 		const exutil = ExcalUtil(excalidrawAPI);

	// 		if (data && 'data' in data) {
	// 			const { files, elements } = data.data as IDrawData;
	// 			// console.log('[importJson]', { files, elements });
	// 			exutil.loadElement(elements, files);

	// 			showAlertSuccess('데이터 가져오기 성공!');
	// 		} else {
	// 			showAlertError('손상된 데이터입니다.');
	// 		}
	// 	} catch (error) {
	// 		showAlertError(str.alert.error(error));
	// 	}
	// };

	const onClickSave = async () => {
		if (!excalidrawAPI) return;

		const exutil = ExcalUtil(excalidrawAPI);
		if (!exutil.isElements())
			return showAlertError('내보내기 할 데이터가 없습니다.');

		const elements = exutil.getElements();
		const image = await exutil.getThumbnailImage(elements);
		// console.log('[onClickSave]', image);
		const data = exutil.getDrawItem(elements);
		// console.log(data);
		const userId = Session.getUserId();

		// 모달 띄우기
		const isShowModal = () => {
			const { target } = Session.getEditorParam();

			if (savedTemplate) return false;
			else if (loadedTemplate) {
				switch (target) {
					case EditTarget.recent:
					case EditTarget.editing:
					case EditTarget.favorite:
						return false;
					default:
						return true;
				}
			} else return true;
		};

		const isSave = isShowModal();
		if (isSave) {
			// 저장할 데이터 초기화
			let params: ITemplate = {
				title: ``,
				data: data,
				image: image || '',
				categoryId: '1',
				favorite: false,
				tag: '',
				premium: false,
				recommed: false,
				message: '',
				owner: userId,
			};

			setModalSave(params);
		} else {
			// console.log({ data, image });

			// 데이터 저장
			await doRequestUpdate(Method.POST, $api.template.update, {
				data: { ...getDrawTemplate(), data: data, image: image },
			});

			showAlertSuccess(str.alert.save);
		}
	};

	const onCloseSaveModal = async (isOk: boolean, value?: ITemplate) => {
		if (isOk && value) {
			// 데이터 저장
			const res = await doRequestSave(Method.POST, $api.template.save, {
				data: value,
			});
			showAlertSuccess(str.alert.save);

			const id = res?.data as string;
			setLoadedTemplate(null); // 로드한 템플릿 제거
			setSavedTemplate({ ...value, id: id }); // 작업 템플릿 저장
			Session.setEditorParam({ id: id, target: EditTarget.editing });
		}

		setModalSave(null);
	};

	const getDrawTemplate = () => {
		const { target } = Session.getEditorParam();

		if (savedTemplate) return savedTemplate;
		else if (loadedTemplate) {
			switch (target) {
				case EditTarget.recent:
				case EditTarget.editing:
				case EditTarget.favorite:
					return loadedTemplate;
				default:
					return null;
			}
		} else return null;
	};

	const onClickUpdate = async () => {
		if (!excalidrawAPI) return;

		const exutil = ExcalUtil(excalidrawAPI);
		const elements = exutil.getElements();
		if (!exutil.isElements())
			return showAlertError('업데이트 할 데이터가 없습니다.');

		const image = await exutil.getThumbnailImage(elements);
		const data = exutil.getDrawItem(elements);
		const userId = Session.getUserId();
		const template = getDrawTemplate();

		if (template) {
			let params: ITemplate = {
				...template,
				image: image || '',
				data: data,
				owner: userId,
			};

			setModalUpdate(params);
		}
	};

	const onCloseUpdateModal = async (isOk: boolean, value?: ITemplate) => {
		if (isOk && value) {
			// 데이터 저장
			await doRequestUpdate(Method.POST, $api.template.update, {
				data: value,
			});

			showAlertSuccess(str.alert.save);

			setSavedTemplate({ ...value }); // 작업 템플릿 저장
		}

		setModalUpdate(null);
	};

	const onClickClose = () => {
		window.history.back();
		Session.removeEditorParam();
	};

	const onClickMenu = (type: string) => {
		if (type === 'open') alert('서비스 준비중 입니다.');
		else if (type === 'save') onClickSave();
		else if (type === 'update') onClickUpdate();
		else if (type === 'export') alert('서비스 준비중 입니다.');
		else if (type === 'close') onClickClose();
	};

	const getTitle = () => {
		const { target } = Session.getEditorParam();

		if (savedTemplate) return savedTemplate.title;
		else if (loadedTemplate) {
			switch (target) {
				case EditTarget.recent:
				case EditTarget.editing:
				case EditTarget.favorite:
					return loadedTemplate.title;
				default:
					return '';
			}
		} else return '';
	};

	const onClickHeader = () => {
		setShowLibrary(true);
	};

	const onSelectLibrary = async (item: ILibrary) => {
		console.log(item);
		if (!excalidrawAPI) return;

		const exutil = ExcalUtil(excalidrawAPI);
		// if (!exutil.isElements())
		// 	return showAlertError('알수 없는 오류가 발생했습니다.');

		// 드로잉 데이트(???)
		if (!item.data || item.data?.elements) {
			return showAlertError('라이브러리 데이터가 아닙니다.');
		}

		const elements = exutil.getElements();

		// 템플릿 타입
		const { templateId, mimeType } = item.data;

		if (mimeType === LibraryType.template) {
			const { data } = await doRequestGetTemplate(
				Method.GET,
				$api.template.get(templateId as string)
			);

			const templates = data as unknown as ITemplate;
			if (templates?.data?.elements) {
				const elementItems = templates.data.elements.map((a) => ({
					...a,
					id: `lib${new Date().valueOf().toString()}`,
					x: pos.x,
					y: pos.y,
				}));

				console.log(elementItems);
				const items = elements
					? [...elements, ...elementItems]
					: [...elementItems];
				excalidrawAPI.updateScene({ elements: items });
			}
		} else {
			const { elememt, file } = exutil.addLibrary(item.data, pos);
			const items = elements ? [...elements, elememt] : [elememt];
			excalidrawAPI.updateScene({ elements: items });
			excalidrawAPI.addFiles([file]);
		}

		setPos({ x: pos.x - 20, y: pos.y - 20 });
	};

	const onCloseLibrary = () => {
		setShowLibrary(false);
		clearPosition();
	};

	return (
		<StyledEditor className='app-editor'>
			{/* 헤더 */}
			<EditorHeader title={getTitle()} onClick={onClickHeader} />

			{/* 에디터 프레임 */}
			<div className='frame'>
				{/* 에디터 */}
				<Excalidraw
					// UIOptions={canvasActions: {} }
					// initialData={{
					// 	appState: { viewBackgroundColor: '#aaa', width: 1000 },
					// }}
					langCode={'ko-KR'}
					libraryReturnUrl='https://daum.net'
					excalidrawAPI={(api) => setExcalidrawAPI(api)}
				>
					{/* 우측 메뉴 */}
					<EditorMenus onClickMenu={onClickMenu} />
				</Excalidraw>
			</div>

			{/* 템플릿 저장 모달 */}
			{modalSave && (
				<ModalTemplate data={modalSave} onClose={onCloseSaveModal} />
			)}

			{/* 템플릿 정보변경 모달 */}
			{modalUpdate && (
				<ModalTemplate
					isEditMode={true}
					data={modalUpdate}
					onClose={onCloseUpdateModal}
				/>
			)}

			{showLibrary && (
				<SidebarLibrary onClose={onCloseLibrary} onSelect={onSelectLibrary} />
			)}
			{/* {image && <ModalPreview data={image} onClose={() => setImage(null)} />} */}
		</StyledEditor>
	);
};

export default Editor;
