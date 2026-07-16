'use client';

import ResourcePage from '@/components/admin/ResourcePage';
import { projectsConfig } from '@/components/admin/resourceConfigs';

export default function AdminProjectsPage() {
  return <ResourcePage config={projectsConfig} />;
}
