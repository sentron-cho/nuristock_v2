import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';

const ComponentCard = ({
  children,
  title,
  subtitle,
}: {
  children?: React.ReactNode;
  title?: string;
  subtitle?: React.ReactElement | string;
}) => {
  return (
    <Card>
      <CardTitle tag='h4' className='border-bottom px-4 py-3 mb-0'>
        {title}
      </CardTitle>
      <CardBody className='p-4'>
        <CardSubtitle className='text-muted mb-3'>
          {subtitle || ''}
        </CardSubtitle>
        <div>{children}</div>
      </CardBody>
    </Card>
  );
};

export default ComponentCard;
