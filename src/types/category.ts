// Category interface for table display
export interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: CategoryType;
  children?: CategoryType[];
}
