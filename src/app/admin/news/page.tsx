'use client';

import ResourcePage from '@/components/admin/ResourcePage';
import { newsConfig } from '@/components/admin/resourceConfigs';

export default function AdminNewsPage() {
  return <ResourcePage config={newsConfig} />;
}
