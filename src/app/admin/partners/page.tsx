'use client';

import ResourcePage from '@/components/admin/ResourcePage';
import { partnersConfig } from '@/components/admin/resourceConfigs';

export default function AdminPartnersPage() {
  return <ResourcePage config={partnersConfig} />;
}
