export enum MenuLinkType {
  URL = "url",
  COURSE = "course",
  PRODUCT = "product",
  PAGE = "page",
  TAXONOMY = "taxonomy",
  POST = "post"
}

export type MenuLink = {
  id: number;
  title: string;
  type: MenuLinkType;
  value: string | null;
  url: string | null;
  new_tab: boolean;
  children: Omit<MenuLink, "children">[];
};
