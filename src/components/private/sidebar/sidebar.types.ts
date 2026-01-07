export interface MenuItem {
  name: string;
  href?: string;
  icon: string;
  badge?: string;
  children?: MenuItem[];
}

