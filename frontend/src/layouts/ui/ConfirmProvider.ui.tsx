import { createContext, useContext, useState, ReactNode, ReactElement } from 'react';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { DialogButtons, DialogTitle } from '@entites/Dialog';
import { ST } from '@shared/config/kor.lang';

type ConfirmOptions = {
	title?: string;
	content: string | ReactElement;
	onClose?: (isOk: boolean) => void;
};

type ConfirmContextType = {
	showConfirm: (options: ConfirmOptions) => void;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
	const context = useContext(ConfirmContext);
	if (!context) throw new Error('useConfirm must be used within an ConfirmProvider');
	return context;
};

const StyledDialog = styled(Dialog, {
  '.MuiPaper-root': {
    width: '360px',
  },

	'.contents': {
		minHeight: '100px',
    maxHeight: '400px',
	},
});

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<ConfirmOptions>({ content: '' });

	const showConfirm = (options: ConfirmOptions) => {
		setOptions(options);
		setOpen(true);
	};

	const handleClose = (isOk: boolean) => {
		setOpen(false);
		options?.onClose?.(isOk);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // 기본 폼 제출 방지
			handleClose(true);
		}
	};

	return (
		<ConfirmContext.Provider value={{ showConfirm }}>
			{children}

      <StyledDialog
        maxWidth='xs'
			  fullWidth
        open={open}
        onClose={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      >
				<DialogTitle title={options.title} onClose={() => handleClose(false)} />

        <DialogContent>
          <Flex className='contents'>{options.content}</Flex>
        </DialogContent>

        <DialogActions>
          <DialogButtons onOk={() => handleClose(true)} onCancel={() => handleClose(false)} okText={ST.OK} />
				</DialogActions>
			</StyledDialog>
		</ConfirmContext.Provider>
	);
};
