import { IButtonItem } from '@/components/ButtonGroup';
import { LibraryType, ValueOfLibraryType } from '@/types/types';

export const ButtonItems: IButtonItem[] = [
	{
		label: ValueOfLibraryType.image,
		value: LibraryType.image,
	},
	{
		label: ValueOfLibraryType.clipart,
		value: LibraryType.clipart,
	},
	{
		label: ValueOfLibraryType.modeling,
		value: LibraryType.modeling,
	},
	{
		label: ValueOfLibraryType.graph,
		value: LibraryType.graph,
	},
];
