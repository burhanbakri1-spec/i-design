'use client';

import ResourcePage from '@/components/admin/ResourcePage';
import { categoriesConfig } from '@/components/admin/resourceConfigs';

export default function AdminCategoriesPage() {
  return <ResourcePage config={categoriesConfig} />;
}
