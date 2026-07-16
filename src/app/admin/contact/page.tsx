'use client';

import ResourcePage from '@/components/admin/ResourcePage';
import { contactConfig } from '@/components/admin/resourceConfigs';

export default function AdminContactPage() {
  return <ResourcePage config={contactConfig} />;
}
