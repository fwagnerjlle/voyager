import Layout from '@/layouts/Layout.vue';
import Admin from '@/pages/company/Admin.vue';

export default [{
  path: '/company',
  component: Layout,
  children: [
    {
      path: 'admin',
      name: 'company-admin',
      component: Admin,
    },
  ],
}];
