import { useLocation } from 'react-router-dom';
// import AddAttributeForm from './AddAttributeForm';
import AddAttributeForm from '../common/AddAttributeForm';
import attributeMap from '@/utils/openAddFrom';

export default function AddAttributePage() {
  const { pathname } = useLocation();
  const config = attributeMap[pathname];

  if (!config) {
    return <p>Invalid path!</p>;
  }

  return (
    <AddAttributeForm title={config.title} label={config.label} buttonText={config.buttonText} />
  );
}
