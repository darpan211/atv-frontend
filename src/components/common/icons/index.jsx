import { Logo } from '../icons/svgs/Logo';
import { Pencil } from '../icons/svgs/Pencil';
import { Square } from '../icons/svgs/Square';
import { Layers } from './svgs/Layers';
import { Vector } from './svgs/Vector';
import { UserIcon } from './svgs/UserIcon';
import { Userplus } from './svgs/Userplus';
import { Upload } from './svgs/Upload';
import { Close } from './svgs/Close';
import { Main } from './svgs/Main';
import { Grid } from './svgs/Grid';
import { Main1 } from './svgs/Main1';
import { Grid1 } from './svgs/Grid1';
import { DeleteIcon } from './svgs/DeleteIcon';
import { EditIcon } from './svgs/EditIcon';
import { Arrow } from './svgs/Arrow';
import { Eye } from './svgs/Eye';
import { EditPencil } from './svgs/EditPencil';

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
    Main,
    Grid,
    Main1,
    Grid1,
    DeleteIcon,
    EditIcon,
    Arrow,
    Eye,
    EditPencil,
  };

  const SvgIcon = icons[name];
  if (!SvgIcon) {
    return null;
  }

  return <SvgIcon width={width} size={size} height={height} className={className} />;
};
