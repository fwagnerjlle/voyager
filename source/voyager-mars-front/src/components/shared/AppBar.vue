<template>
  <v-app-bar class="AppBar" fixed app :clipped-left="clipped" light :height="($store.state.less600 ? 56 : 72)" dark style="background-color: #192537;z-index: 199;">
    <v-app-bar-nav-icon @click.stop="isDrawer = !isDrawer" ></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<style>
  .v-toolbar__items button.v-btn.chat-notification-button,
  .v-toolbar__items button.v-btn.task-notification-button {
    height: 100%;
    padding-top: 6px;
  }

  .v-toolbar__items button.v-btn.chat-notification-button .v-icon.v-icon,
  .v-toolbar__items button.v-btn.task-notification-button .v-icon.v-icon {
    padding-bottom: 6px;
  }

  .app-bar-clear-notification {
    text-align: right;
  }

  .app-bar-notification-text {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.877);
    max-width: 600px;
  }

  .app-bar-no-notification {
    padding: 10px;
  }

  .app-bar-notification {
    cursor: pointer;
  }

  .app-bar-notification .v-list__tile {
    height: auto;
    padding: .5em 1em;
  }

  .app-bar-notification .v-list__tile .v-list__tile__content .v-list__tile__title {
    height: auto;
    padding: .5em 0;
    white-space: pre-line;
  }

  .btn-account .avatar {
    width: 35px;
    height: 35px;
  }

  .btn-top-bar .text-normal {
    text-transform: capitalize;
    font-size: 14px;
  }

  .AppBar .v-badge__badge {
    top: -6px !important;
    left: 105% !important;
  }
</style>


<script>
  export default {
    props: {
      clipped: Boolean,
      miniVariant: Boolean,
      drawer: Boolean,
      drawer2: Boolean,
      rightDrawer: Boolean,
      fixed: Boolean,
    },
    data: () => ({
      isDrawer: this ? this.drawer : true,
      isDrawer2: this ? this.drawer2 : true,
      isClipped: this ? this.clipped : false,
      isFixed: this ? this.fixed : true,
      isMiniVariant: this ? this.miniVariant : false,
      isRightDrawer: this ? this.rightDrawer : false,
      less600: false,
    }),

    watch: {
      drawer() {
        this.isDrawer = this.drawer;
      },
      drawer2() {
        this.isDrawer2 = this.drawer2;
      },
      isClipped() {
        this.$emit('clipped', this.isClipped);
      },
      isDrawer() {
        this.$emit('drawer', this.isDrawer);
      },
      isDrawer2() {
        this.$emit('drawer2', this.isDrawer2);
      },
      isFixed() {
        this.$emit('fixed', this.isFixed);
      },
      isMiniVariant() {
        this.$emit('miniVariant', this.isMiniVariant);
      },
      isRightDrawer() {
        this.$emit('rightDrawer', this.isRightDrawer);
      },
    },
  };
</script>
