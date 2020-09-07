<template>
  <div>
    <v-breadcrumbs :items="itemsBreadcrumbs"></v-breadcrumbs>
    <AsyncComponent :component="plateauTable" widthLoading class="fluid pa-0"/>
  </div>
</template>

<script>
import AsyncComponent from '@/components/common/AsyncComponent.vue';

export default {
  components: { AsyncComponent },
  data: () => ({
    plateauTable: null,
    plateauForm: null,
    itemsBreadcrumbs: [
      {
        text: 'Plateaus',
        disabled: true,
        href: '/plateau/admin',
      },
    ],
  }),
  mounted() {
    this.plateauTable = 'plateau/PlateauTable';
  },
};
</script>
