import { Logo } from '../icons/svgs/Logo';
import { Pencil } from '../icons/svgs/Pencil';
import { Square } from '../icons/svgs/Square';
import { Layers } from './svgs/Layers';
import { Vector } from './svgs/Vector';
import { UserIcon } from './svgs/UserIcon';
import { Userplus } from './svgs/Userplus';
import { Upload } from './svgs/Upload';
import { Close } from './svgs/Close';
import { Close1 } from './svgs/Close1';

export const Icon = ({ name, size, height, width, className }) => {
  const icons = {
    Logo,
    Pencil,
    Square,
    Vector,
    Layers,
    UserIcon,
    Userplus,
    Upload,
    Close,
    Close1,
  };

  const SvgIcon = icons[name];
  if (!SvgIcon) {
    return null;
  }

  return <SvgIcon width={width} height={height} className={className} />;
};
