'use client';

import ResourcePage from '@/components/admin/ResourcePage';
import { peopleConfig } from '@/components/admin/resourceConfigs';

export default function AdminPeoplePage() {
  return <ResourcePage config={peopleConfig} />;
}
