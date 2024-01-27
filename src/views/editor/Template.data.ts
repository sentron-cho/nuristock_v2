import { IDropMenuItem } from '@/components/DropMenu';
import { LibraryType, ValueOfLibraryType } from '@/types/types';

export const MenuType: Array<IDropMenuItem> = [
	// { value: LibraryType.all, label: ValueOfLibraryType.all },
	{ value: LibraryType.template, label: ValueOfLibraryType.template },
	{ value: LibraryType.image, label: ValueOfLibraryType.image },
	{ value: LibraryType.clipart, label: ValueOfLibraryType.clipart },
	{ value: LibraryType.modeling, label: ValueOfLibraryType.modeling },
];

export const SizeType: Array<IDropMenuItem> = [
	{ value: 'A4', label: 'A4' },
	{ value: 'A3', label: 'A3' },
	{ value: 'B4', label: 'B4' },
	{ value: 'A5', label: 'A5' },
];

export const MediaType: Array<IDropMenuItem> = [
	{ value: 'A', label: 'A' },
	{ value: 'B', label: 'B' },
	{ value: 'C', label: 'C' },
	{ value: 'D', label: 'D' },
];
