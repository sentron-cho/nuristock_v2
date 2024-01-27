import { useState } from 'react';
import { Toast as ToastBox } from 'reactstrap';

const Toast = ({ text }: { visible: boolean; text: string }) => {
  const [visible, setVisible] = useState(false);
  const onDismiss = () => setVisible(false);

  return (
    <ToastBox color='info' isOpen={visible} toggle={onDismiss}>
      {text}
    </ToastBox>
  );
};

export default Toast;
