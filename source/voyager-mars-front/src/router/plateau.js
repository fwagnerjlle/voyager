import Layout from '@/layouts/Layout.vue';
import Admin from '@/pages/plateau/AdminPlateau.vue';

export default [{
  path: '/plateau',
  component: Layout,
  children: [
    {
      path: 'admin',
      name: 'plateau-admin',
      component: Admin,
    },
  ],
}];
