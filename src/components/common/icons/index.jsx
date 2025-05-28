import { Logo } from '../icons/svgs/Logo';
import { Pencil } from '../icons/svgs/Pencil';
import { Square } from '../icons/svgs/Square';
import { Layers } from './svgs/Layers';
import { Vector } from './svgs/Vector';
import { UserIcon } from './svgs/UserIcon';
import { Userplus } from './svgs/Userplus';


export const Icon = ({ name, size, height, width, className }) => {
  const icons = {
    Logo,
    Pencil,
    Square,
    Vector,
    Layers,
    UserIcon,
    Userplus,
  };

  const SvgIcon = icons[name];
  if (!SvgIcon) {
    return null;
  }

  return <SvgIcon width={width} height={height} className={className} />;
};
