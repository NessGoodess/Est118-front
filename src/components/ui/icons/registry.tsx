import type { ComponentType } from "react";
import Icon, { type IconProps } from "./Icon";

type SvgIcon = ComponentType<Pick<IconProps, "className">>;

/**
 * This is the catalog of app icons.
 */
export const AppIcons = {
  eye: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  ),
  edit: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </Icon>
  ),
  trash: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </Icon>
  ),
  download: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </Icon>
  ),
  camera: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" /><circle cx="12" cy="13" r="3" />
    </Icon>
  ),
  reload: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
    </Icon>
  ),
  switchcamera: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
      <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
      <circle cx="12" cy="12" r="3" />
      <path d="m18 22-3-3 3-3" />
      <path d="m6 2 3 3-3 3" />
    </Icon>
  ),
  powerOff: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M14.564 14.558a3 3 0 1 1-4.122-4.121" /><path d="m2 2 20 20" /><path d="M20 20H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 .819-.175" /><path d="M9.695 4.024A2 2 0 0 1 10.004 4h3.993a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v7.344" />
    </Icon>
  ),
  power: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M12 2v10" /><path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </Icon>
  ),
  book: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M8 2v4" /><path d="M12 2v4" /><path d="M16 2v4" /><rect width="16" height="18" x="4" y="4" rx="2" /><path d="M8 10h6" /><path d="M8 14h8" /><path d="M8 18h5" />
    </Icon>
  ),
  arrowLeft: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </Icon>
  ),
  users: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  ),
  groups: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  ),
  print: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /><rect x="6" y="14" width="12" height="8" rx="1" />
    </Icon>
  ),
  sun: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </Icon>
  ),
  moon: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </Icon>
  ),
  monitor: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </Icon>
  ),
  /** Mobile drawer — classic hamburger (clearest “open nav”) */
  menu: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </Icon>
  ),
  /** Desktop: expand sidebar (panel + chevron) */
  sidebarOpen: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m14 9 3 3-3 3" />
    </Icon>
  ),
  /** Desktop: collapse sidebar */
  sidebarClose: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m15 15-3-3 3-3" />
    </Icon>
  ),
  bell: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </Icon>
  ),
  search: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Icon>
  ),
  user: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  ),
  atSign: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </Icon>
  ),
  lock: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
  ),
  check: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  ),
  alert: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Icon>
  ),
  info: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </Icon>
  ),
  x: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icon>
  ),
  clock: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  ),
  calendar: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </Icon>
  ),
  calendarTime: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M16 14v2.2l1.6 1" /><path d="M16 2v3" /><path d="M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338" /><path d="M3 9h5.859" /><path d="M8 2v3" /><circle cx="16" cy="16" r="6" />
    </Icon>
  ),
  globe: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icon>
  ),
  timer: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
  ),
  dashboard: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </Icon>
  ),

  idCard: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M13.5 8h-3" /><path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" /><path d="M16.899 22A5 5 0 0 0 7.1 22" /><path d="m9 2 3 6" /><circle cx="12" cy="15" r="3" />
    </Icon>
  ),
  /** Clipboard */
  clipboard: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </Icon>
  ),
  /** List with checks */
  listCheck: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M13 5h8" />
      <path d="M13 12h8" />
      <path d="M13 19h8" />
      <path d="m3 17 2 2 4-4" />
      <path d="m3 7 2 2 4-4" />
    </Icon>
  ),
  /** Check List/Checkbox */
  checklist: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M13 5h8" />
      <path d="M13 12h8" />
      <path d="M13 19h8" />
      <path d="m3 17 2 2 4-4" />
      <rect x="3" y="4" width="6" height="6" rx="1" />
    </Icon>
  ),
  /** Simple Plus*/
  plus: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </Icon>
  ),
  /** User + plus*/
  userPlus: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M2 21a8 8 0 0 1 13.292-6" />
      <circle cx="10" cy="8" r="5" />
      <path d="M19 16v6" />
      <path d="M22 19h-6" />
    </Icon>
  ),
  /** Gear */
  settings: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  ),
  /** Chart column (bar chart) */
  chartColumn: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 16v-5" />
      <path d="M12 16V8" />
      <path d="M17 16v-3" />
    </Icon>
  ),
  /** Message circle */
  messageCircle: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </Icon>
  ),
  chevronLeft: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="m15 18-6-6 6-6" />
    </Icon>
  ),
  chevronRight: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="m9 18 6-6-6-6" />
    </Icon>
  ),
  chevronDown: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  ),
  /** Log out */
  logOut: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Icon>
  ),
  tag: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </Icon>
  ),
  verticalCommit: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M12 3v6" /><circle cx="12" cy="12" r="3" /><path d="M12 15v6" />
    </Icon>
  ),
  mail: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Icon>
  ),
  phone: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Icon>
  ),
  calendarDays: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
      <path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
    </Icon>
  ),
  venusMars: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <circle cx="12" cy="11" r="5" />
      <path d="M12 16v6" />
      <path d="M10 20h4" />
      <path d="M17 2h4v4" />
      <path d="m21 2-5.46 5.46" />
    </Icon>
  ),
  mapPin: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  ),
  map: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </Icon>
  ),
  home: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </Icon>
  ),
  building: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" /><path d="M12 6h.01" /><path d="M16 6h.01" />
      <path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" />
      <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
    </Icon>
  ),
  hash: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </Icon>
  ),
  graduationCap: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </Icon>
  ),
  school: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <polyline points="10 2 10 10 13 7 16 10 16 2" />
    </Icon>
  ),
  star: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Icon>
  ),
  starHalf: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2" />
    </Icon>
  ),
  heart: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </Icon>
  ),
  palette: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </Icon>
  ),
  ticket: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
      <path d="M13 5v2" /><path d="M13 11v2" /><path d="M13 17v2" />
    </Icon>
  ),
  cog: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M11 10.27 7 3.34" /><path d="m11 13.73-4 6.93" /><path d="M12 22v-2" />
      <path d="M12 2v2" /> <path d="M14 12h8" /> <path d="m17 20.66-1-1.73" />
      <path d="m17 3.34-1 1.73" /><path d="M2 12h2" /><path d="m20.66 17-1.73-1" />
      <path d="m20.66 7-1.73 1" /> <path d="m3.34 17 1.73-1" /> <path d="m3.34 7 1.73 1" />
      <circle cx="12" cy="12" r="2" /> <circle cx="12" cy="12" r="8" />
    </Icon>
  ),
  factory: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M12 16h.01" /> <path d="M16 16h.01" />
      <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
      <path d="M8 16h.01" />
    </Icon>
  ),
  cpu: ({ className }: Pick<IconProps, "className">) => (
    <Icon className={className}>
      <path d="M12 20v2" /><path d="M12 2v2" /><path d="M17 20v2" /><path d="M17 2v2" />
      <path d="M2 12h2" /><path d="M2 17h2" /><path d="M2 7h2" /><path d="M20 12h2" />
      <path d="M20 17h2" /><path d="M20 7h2" /><path d="M7 20v2" /><path d="M7 2v2" />
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="8" y="8" width="8" height="8" rx="1" />
    </Icon>
  ),
} as const satisfies Record<string, SvgIcon>;

export type AppIconName = keyof typeof AppIcons;
