import { Logo } from '../icons/svgs/Logo';
import { Pencil } from '../icons/svgs/Pencil';

export const Icon = ({ name, size, height, width, className }) => {
  const icons = {
    Logo,
    Pencil,
  };

  const SvgIcon = icons[name];
  // placeholder
  if (!SvgIcon) {
    return null;
  }

  return <SvgIcon width={width} height={height} className={className} />;
};
