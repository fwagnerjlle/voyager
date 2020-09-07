<template>
  <div>
    <Component :is="loadComponent" v-if="isLoad"/>
    <v-progress-linear :indeterminate="true" v-else-if="widthLoading"/>
  </div>
</template>

<script>
  export default {
    props: {
      component: String,
      widthLoading: Boolean,
    },
    data: () => ({
      isLoad: false,
      loadComponent: null,
    }),
    mounted() {
      if (this.component) this.importComponent();
    },
    methods: {
      importComponent() {
        setTimeout(() => {
          import(/* webpackChunkname: "async-component" */`@/components/${this.component}`).then((c) => {
            this.loadComponent = c.default;
            this.isLoad = true;
          });
        }, 400);
      },
    },
    watch: {
      component() {
        this.importComponent();
      },
    },
  };
</script>
