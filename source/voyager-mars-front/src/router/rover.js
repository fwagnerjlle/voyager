import Layout from '@/layouts/Layout.vue';
import Admin from '@/pages/rover/AdminRover.vue';

export default [{
  path: '/rover',
  component: Layout,
  children: [
    {
      path: 'admin',
      name: 'rover-admin',
      component: Admin,
    },
  ],
}];
