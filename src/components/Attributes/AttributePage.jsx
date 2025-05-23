import { useLocation } from 'react-router-dom';
import categoryConfigs from '@/utils/categoryConfigs';
import CommonList from '../common/CommonList';

const AttributePage = () => {
  const { pathname } = useLocation();

  const config = categoryConfigs.find(conf => conf.path === pathname);

  if (!config) {
    return <div className="p-6 text-red-500">No component found for this path.</div>;
  }

  return (
    <>
      <CommonList
        title={config.title}
        buttonLabel={config.buttonLabel}
        placeholder={config.placeholder}
        route={config.navigateTo}
        data={config.data}
      />
    </>
  );
};

export default AttributePage;
