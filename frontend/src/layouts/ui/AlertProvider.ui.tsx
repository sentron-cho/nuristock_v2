import { createContext, useContext, useState, ReactNode, ReactElement } from 'react';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { DialogButtons, DialogTitle } from '@entites/Dialog';
import { ST } from '@shared/config/kor.lang';

type AlertOptions = {
	title?: string;
	content: string | ReactElement;
	onClose?: (isOk: boolean) => void;
};

type AlertContextType = {
	showAlert: (options: AlertOptions) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
	const context = useContext(AlertContext);
	if (!context) throw new Error('useAlert must be used within an AlertProvider');
	return context;
};

const StyledDialog = styled(Dialog, {
  '.MuiPaper-root': {
    width: '360px',
  },

	'.contents': {
		minHeight: '60px',
    maxHeight: '400px',
	},
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<AlertOptions>({ content: '' });

	const showAlert = (options: AlertOptions) => {
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
		<AlertContext.Provider value={{ showAlert }}>
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
          <DialogButtons onOk={() => handleClose(true)} okText={ST.OK} />
				</DialogActions>
			</StyledDialog>
		</AlertContext.Provider>
	);
};
