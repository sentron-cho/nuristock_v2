import { exportToCanvas } from '@excalidraw/excalidraw';
import {
	BinaryFileData,
	DataURL,
	ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types';
import {
	ExcalidrawElement,
	ExcalidrawImageElement,
	FileId,
	NonDeletedExcalidrawElement,
} from '@excalidraw/excalidraw/types/element/types';
import { toObjectKeys } from '@/utils/utils';
import {
	IDrawData,
	ILibrary,
	ILibraryData,
	IPostion,
} from '@/types/interfaces';

const ExcalUtil = (excalApi: ExcalidrawImperativeAPI) => {
	const api = excalApi;

	const getDrawItem = (
		elements: readonly NonDeletedExcalidrawElement[] | null,
		files?: BinaryFileData[] | null
	): IDrawData => {
		const data: IDrawData = {
			type: 'excalidraw',
			version: 1,
			source: 'https://scidraw.com',
		} as IDrawData;

		if (!elements) {
			console.error('is not elements');
			return data;
		}

		elements && elements.length > 0 && (data.elements = elements);
		if (files && files.length > 0) {
			data.files = files;
		} else {
			const images = getDrawImageFiles();
			images && images.length > 0 && (data.files = images);
		}

		return data;
	};

	const isElements = (): boolean => {
		try {
			const elements = api.getSceneElements();
			return elements && elements.length > 0;
		} catch (error) {
			console.error(error);
			return false;
		}
	};

	// const isEmptyElements = (): boolean => {
	// 	return !isElements();
	// };

	const getDrawImageFiles = (): BinaryFileData[] | null => {
		try {
			const files = api.getFiles();
			return toObjectKeys(files).map((a) => files[a]);
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	const getElements = (): readonly ExcalidrawElement[] | null => {
		try {
			const elements = api.getSceneElements();
			if (!elements || !elements.length) return null;

			return elements;
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	const getThumbnailImage = async (
		elements: readonly NonDeletedExcalidrawElement[] | null
	): Promise<string | null> => {
		if (!elements) {
			console.error('is not elements');
			return null;
		}

		try {
			const MAX_WIDTH = 256;
			const MAX_HEGHT = 256;

			const canvas = await exportToCanvas({
				elements,
				appState: {
					// ...initialData.appState,
					// currentItemBackgroundColor: '#00000000',
					viewBackgroundColor: 'transparent',
					exportWithDarkMode: false,
				},
				files: api.getFiles(),
				// maxWidthOrHeight: 1024,
				exportPadding: 30,
				getDimensions: (width: number, height: number) => {
					if (width <= MAX_WIDTH || height <= MAX_HEGHT) {
						return { width, height };
					} else {
						const scale = MAX_WIDTH / width;
						const reHeight = height < MAX_HEGHT ? height : MAX_HEGHT;
						const reWidth = width * scale;
						return { width: reWidth, height: reHeight, scale };
					}
				},
			});

			const ctx = canvas.getContext('2d');
			if (ctx) {
				const image = canvas.toDataURL();
				// setImage(image);
				return image;
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	const loadElement = (
		elements: readonly NonDeletedExcalidrawElement[] | null,
		files?: BinaryFileData[] | null
	) => {
		if (!elements) {
			console.error('is not elements');
			return null;
		}

		try {
			api.updateScene({ elements: elements });
			files && api.addFiles(files);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	};

	const addLibrary = (data: ILibraryData, pos?: IPostion) => {
		const id = `lib-${new Date().valueOf()}`;
		const elememt = {
			id: id,
			type: 'image',
			x: pos?.x && data?.width ? pos.x - Number(data.width) / 2 : 100,
			y: pos?.y && data?.height ? pos.y - Number(data.height) / 2 : 100,
			width: data?.width,
			height: data?.height,
			angle: 0,
			strokeColor: 'transparent',
			backgroundColor: 'transparent',
			roughness: 1,
			opacity: 100,
			groupIds: [],
			frameId: null,
			roundness: null,
			// seed: 1568789268,
			// version: 1,
			// versionNonce: 0,
			isDeleted: false,
			boundElements: null,
			updated: new Date().valueOf(),
			link: null,
			locked: false,
			status: 'pending',
			fileId: id as FileId,
			scale: [1, 1],
		} as unknown as ExcalidrawImageElement;
		const file: BinaryFileData = {
			mimeType: 'image/png',
			id: id as FileId,
			dataURL: data?.dataURL as DataURL,
			created: new Date().valueOf(),
		};

		return { elememt, file };
	};

	return {
		getDrawItem,
		isElements,
		// isEmptyElements,
		getDrawImageFiles,
		getElements,
		getThumbnailImage,
		loadElement,
		addLibrary,
	};
};

export default ExcalUtil;
