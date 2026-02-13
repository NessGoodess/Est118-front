export interface MenuItem {
  name: string;
  href?: string;
  icon: string;
  badge?: string;
  /** Permission required to see this item (e.g. 'view users'). If omitted, item is visible to all authenticated users. */
  permission?: string;
  children?: MenuItem[];
}

