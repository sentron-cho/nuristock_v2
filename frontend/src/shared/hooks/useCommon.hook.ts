import { useToast } from '@layouts/hooks/toast.hook';
import { useAlert } from '@layouts/ui/AlertProvider.ui';
import { useConfirm } from '@layouts/ui/ConfirmProvider.ui';

export const useCommonHook = () => {
	const toast = useToast();
	const alert = useAlert();
	const confirm = useConfirm();

	return {
		...toast,
		...alert,
		...confirm,
	};
};
