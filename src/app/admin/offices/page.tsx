'use client';

import ResourcePage from '@/components/admin/ResourcePage';
import { officesConfig } from '@/components/admin/resourceConfigs';

export default function AdminOfficesPage() {
  return <ResourcePage config={officesConfig} />;
}
