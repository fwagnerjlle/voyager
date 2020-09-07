<template>
  <div>
    <v-breadcrumbs :items="itemsBreadcrumbs"></v-breadcrumbs>
    <AsyncComponent :component="companyTable" widthLoading class="fluid pa-0"/>
  </div>
</template>

<script>
import AsyncComponent from '@/components/common/AsyncComponent.vue';

export default {
  components: { AsyncComponent },
  data: () => ({
    companyTable: null,
    companyForm: null,
    itemsBreadcrumbs: [
      {
        text: 'Companies',
        disabled: true,
        href: '/company/admin',
      },
    ],
  }),
  mounted() {
    this.companyTable = 'company/CompanyTable';
  },
};
</script>
