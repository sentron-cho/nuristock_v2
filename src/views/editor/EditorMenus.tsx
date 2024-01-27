import { MainMenu } from '@excalidraw/excalidraw';
import * as Icon from 'react-feather';

const EditorMenus = ({
	onClickMenu,
}: {
	onClickMenu: (type: string) => void;
}) => {
	const onClick = (type: string) => {
		onClickMenu(type);
	};

	return (
		<MainMenu>
			<MainMenu.Item onSelect={() => onClick('open')} icon={<Icon.Folder />}>
				템플릿 열기
			</MainMenu.Item>
			<MainMenu.Item onSelect={() => onClick('save')} icon={<Icon.Save />}>
				템플릿 저장
			</MainMenu.Item>
			<MainMenu.Item onSelect={() => onClick('update')} icon={<Icon.Edit3 />}>
				템플릿 정보 변경
			</MainMenu.Item>
			<MainMenu.Item
				onSelect={() => onClick('export')}
				icon={<Icon.UploadCloud />}
			>
				템플릿 내보내기
			</MainMenu.Item>
			{/* <MainMenu.Item
				onSelect={() => onClick('import')}
				icon={<Icon.DownloadCloud />}
			>
				최근 템플릿 가져오기
			</MainMenu.Item> */}
			<MainMenu.Separator />
			<MainMenu.DefaultItems.ClearCanvas />
			<MainMenu.Separator />
			<MainMenu.DefaultItems.ChangeCanvasBackground />
			<MainMenu.Separator />
			<MainMenu.Item onSelect={() => onClick('close')} icon={<Icon.LogOut />}>
				종료
			</MainMenu.Item>
		</MainMenu>
	);
};

export default EditorMenus;
