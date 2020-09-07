import Index from '@/pages/Index.vue';
import Layout from '@/layouts/Layout.vue';

export default [{
  path: '/',
  component: Layout,
  children: [
    {
      path: '/',
      name: 'home',
      component: Index,
    },
  ],
}];
