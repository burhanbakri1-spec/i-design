'use client';

import ResourcePage from '@/components/admin/ResourcePage';
import { usersConfig } from '@/components/admin/resourceConfigs';

export default function AdminUsersPage() {
  return <ResourcePage config={usersConfig} />;
}
