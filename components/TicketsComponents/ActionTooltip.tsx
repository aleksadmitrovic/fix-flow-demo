import { Tooltip } from '@heroui/tooltip';

type ActionTooltipProps = {
  content: string;
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  icon: React.ReactNode;
  onClick?: () => void;
  hidden?: boolean;
};

const colorMap = {
  default: 'text-default-500',
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

export function ActionTooltip({
  content,
  color,
  icon,
  onClick,
  hidden,
}: ActionTooltipProps) {
  return (
    <Tooltip
      className="bg-slate-100 text-teal-700"
      content={content}
      offset={-7}
    >
      <span
        hidden={hidden}
        onClick={onClick}
        className={`text-lg cursor-pointer active:opacity-50 ${colorMap[color]}`}
      >
        {icon}
      </span>
    </Tooltip>
  );
}
