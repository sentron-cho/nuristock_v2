import { SnackbarKey, SnackbarOrigin, VariantType } from 'notistack';

type ToastOptions = {
  variant?: VariantType;
  anchorOrigin?: SnackbarOrigin;
};

let enqueueSnackbarRef: (message: string, options?: ToastOptions) => SnackbarKey;

export const setEnqueueSnackbar = (enqueueSnackbar: (message: string, options?: ToastOptions) => SnackbarKey) => {
  enqueueSnackbarRef = enqueueSnackbar;
};

export const toast = (type: VariantType, message: string, options?: Omit<ToastOptions, 'variant'>) => {
  if (!enqueueSnackbarRef) {
    console.warn('enqueueSnackbar가 아직 초기화되지 않았습니다.');
    return;
  }

  enqueueSnackbarRef(message, { variant: type, ...options });
};
