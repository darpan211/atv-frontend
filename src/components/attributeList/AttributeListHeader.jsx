import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function AttributeListHeader({ title, buttonLabel, route }) {
  const navigate = useNavigate();

  const handleRoute = () => {
    navigate(route);
  };
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      <Button onClick={handleRoute} className="bg-[#6F4E37] text-white hover:bg-[#a98f7d]">
        {buttonLabel}
      </Button>
    </div>
  );
}
