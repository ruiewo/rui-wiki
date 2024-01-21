import { SvgType, getSvg } from '../lib/svg';

export const IconButton = ({
  type,
  onClick: onClick,
}: {
  type: SvgType;
  onClick: (e: MouseEvent) => void;
}) => (
  <button class={`iconButton ${type}`} onclick={onClick}>
    {getSvg(type)}
  </button>
);
