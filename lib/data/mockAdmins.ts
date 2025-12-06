import { AdminUser } from '@/lib/stores/userStore';

export const mockAdmins: AdminUser[] = [
  {
    id: 'admin1',
    email: 'admin@dimanual.com',
    name: 'Admin User',
    role: 'admin',
    permissions: ['all'],
  },
  {
    id: 'admin2',
    email: 'content@dimanual.com',
    name: 'Content Creator',
    role: 'content_creator',
    permissions: ['content:create', 'content:edit', 'content:delete', 'blog:create', 'blog:edit'],
  },
  {
    id: 'admin3',
    email: 'moderator@dimanual.com',
    name: 'Community Moderator',
    role: 'moderator',
    permissions: ['questions:moderate', 'comments:moderate', 'faq:manage'],
  },
  {
    id: 'admin4',
    email: 'finance@dimanual.com',
    name: 'Finance Manager',
    role: 'finance',
    permissions: ['finance:view', 'finance:reports', 'subscriptions:manage'],
  },
  {
    id: 'admin5',
    email: 'support@dimanual.com',
    name: 'Support Admin',
    role: 'moderator',
    permissions: ['helpdesk:manage', 'tickets:assign', 'tickets:resolve'],
  },
  {
    id: 'admin6',
    email: 'editor@dimanual.com',
    name: 'Content Editor',
    role: 'content_creator',
    permissions: ['content:edit', 'blog:edit', 'content:review'],
  },
];

