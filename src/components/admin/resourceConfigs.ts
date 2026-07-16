import type { ResourceConfig } from './ResourcePage';

const yesNo = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
];

export const projectStatusOptions = [
  'CONCEPT',
  'DESIGN',
  'UNDER_CONSTRUCTION',
  'COMPLETED',
  'ON_HOLD',
  'CANCELLED',
].map((value) => ({ label: value, value }));

export const projectsConfig: ResourceConfig = {
  title: 'Projects',
  endpoint: 'admin/projects',
  createLabel: 'New Project',
  createHref: '/admin/projects/new',
  secondaryActionLabel: 'Import Legacy Projects',
  secondaryActionHref: '/admin/projects/import',
  secondaryActionAdminOnly: true,
  projectActions: true,
  rowLink: (row) => `/admin/projects/${row.id}/edit`,
  filters: [
    { name: 'status', label: 'Status', type: 'select', options: projectStatusOptions },
    { name: 'published', label: 'Published', type: 'select', options: yesNo },
    { name: 'featured', label: 'Featured', type: 'select', options: yesNo },
  ],
  fields: [
    { name: 'coverImage', label: 'Image', form: false },
    { name: 'title', label: 'Title', required: true },
    { name: 'city', label: 'City' },
    { name: 'country', label: 'Country' },
    { name: 'year', label: 'Year', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: projectStatusOptions },
    { name: 'published', label: 'Published', type: 'checkbox' },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
    { name: 'updatedAt', label: 'Updated', form: false },
  ],
};

export const categoriesConfig: ResourceConfig = {
  title: 'Categories',
  endpoint: 'admin/categories',
  fields: [
    { name: 'name', label: 'Name', required: true },
    { name: 'slug', label: 'Slug' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'parentId', label: 'Parent ID' },
  ],
};

export const newsConfig: ResourceConfig = {
  title: 'News',
  endpoint: 'admin/news',
  filters: [
    { name: 'published', label: 'Published', type: 'select', options: yesNo },
    { name: 'featured', label: 'Featured', type: 'select', options: yesNo },
  ],
  fields: [
    { name: 'coverImage', label: 'Image', form: false },
    { name: 'title', label: 'Title', required: true },
    { name: 'slug', label: 'Slug' },
    { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
    { name: 'content', label: 'Content', type: 'textarea', table: false },
    { name: 'coverImage', label: 'Cover Image', table: false },
    { name: 'externalUrl', label: 'External URL', type: 'url' },
    { name: 'published', label: 'Published', type: 'checkbox' },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
    { name: 'publishedAt', label: 'Published At', type: 'date' },
    { name: 'seoTitle', label: 'SEO Title', table: false },
    { name: 'seoDescription', label: 'SEO Description', type: 'textarea', table: false },
  ],
};

export const peopleConfig: ResourceConfig = {
  title: 'People',
  endpoint: 'admin/people',
  fields: [
    { name: 'image', label: 'Image', form: false },
    { name: 'name', label: 'Name', required: true },
    { name: 'slug', label: 'Slug' },
    { name: 'jobTitle', label: 'Job Title' },
    { name: 'biography', label: 'Biography', type: 'textarea', table: false },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone' },
    { name: 'image', label: 'Image URL', table: false },
    { name: 'officeId', label: 'Office ID', table: false },
    { name: 'published', label: 'Published', type: 'checkbox' },
    { name: 'sortOrder', label: 'Sort', type: 'number' },
  ],
};

export const officesConfig: ResourceConfig = {
  title: 'Offices',
  endpoint: 'admin/offices',
  fields: [
    { name: 'image', label: 'Image', form: false },
    { name: 'name', label: 'Name', required: true },
    { name: 'slug', label: 'Slug' },
    { name: 'city', label: 'City', required: true },
    { name: 'country', label: 'Country', required: true },
    { name: 'address', label: 'Address' },
    { name: 'phone', label: 'Phone' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'latitude', label: 'Latitude', type: 'number', table: false },
    { name: 'longitude', label: 'Longitude', type: 'number', table: false },
    { name: 'description', label: 'Description', type: 'textarea', table: false },
    { name: 'image', label: 'Image URL', table: false },
    { name: 'published', label: 'Published', type: 'checkbox' },
    { name: 'sortOrder', label: 'Sort', type: 'number' },
  ],
};

export const partnersConfig: ResourceConfig = {
  title: 'Partners',
  endpoint: 'admin/partners',
  fields: [
    { name: 'logo', label: 'Logo', form: false },
    { name: 'name', label: 'Name', required: true },
    { name: 'slug', label: 'Slug' },
    { name: 'website', label: 'Website', type: 'url' },
    { name: 'logo', label: 'Logo URL', table: false },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
};

export const usersConfig: ResourceConfig = {
  title: 'Users',
  endpoint: 'admin/users',
  fields: [
    { name: 'name', label: 'Name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', table: false },
    { name: 'role', label: 'Role', type: 'select', options: ['ADMIN', 'EDITOR'].map((value) => ({ label: value, value })) },
    { name: 'isActive', label: 'Active', type: 'checkbox' },
    { name: 'createdAt', label: 'Created', form: false },
    { name: 'updatedAt', label: 'Updated', form: false },
  ],
};

export const contactConfig: ResourceConfig = {
  title: 'Contact Messages',
  endpoint: 'admin/contact',
  canCreate: false,
  canEdit: false,
  contactStatusActions: true,
  fields: [
    { name: 'name', label: 'Name', form: false },
    { name: 'email', label: 'Email', form: false },
    { name: 'phone', label: 'Phone', form: false },
    { name: 'subject', label: 'Subject', form: false },
    { name: 'status', label: 'Status', form: false },
    { name: 'message', label: 'Message', form: false },
    { name: 'ipAddress', label: 'IP', form: false },
    { name: 'userAgent', label: 'User-Agent', form: false },
    { name: 'createdAt', label: 'Created', form: false },
  ],
  filters: [
    { name: 'status', label: 'Status', type: 'select', options: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((value) => ({ label: value, value })) },
  ],
};
