import { AppIcons } from "@/components/ui/icons/registry";

interface IconProps {
  className?: string;
}

/**
 * Sidebar icon map — aliases to AppIcons only.
 * Config keys that differ from registry names are mapped here.
 */
export const SidebarIcons: Record<string, React.FC<IconProps>> = {
  dashboard: AppIcons.dashboard,
  calendar: AppIcons.calendarTime,
  students: AppIcons.idCard,
  groups: AppIcons.groups,
  edit: AppIcons.edit,
  menu: AppIcons.menu,
  print: AppIcons.print,
  clipboard: AppIcons.clipboard,
  listCheck: AppIcons.listCheck,
  checklist: AppIcons.checklist,
  settings: AppIcons.settings,
  plus: AppIcons.userPlus,
  add: AppIcons.plus,
  list: AppIcons.listCheck,
  check: AppIcons.checklist,
  reports: AppIcons.chartColumn,
  chat: AppIcons.messageCircle,
  chevron: AppIcons.chevronRight,
  chevronDown: AppIcons.chevronDown,
  logout: AppIcons.logOut,
  nfc: AppIcons.tag,
};

export const getIcon = (iconName: string): React.FC<IconProps> => {
  return SidebarIcons[iconName] || SidebarIcons.dashboard;
};
