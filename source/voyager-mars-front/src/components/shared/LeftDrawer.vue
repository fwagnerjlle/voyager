<template>
  <v-navigation-drawer
    fixed
    :mini-variant="miniVariant"
    :clipped="clipped"
    v-model="isDrawer"
    enable-resize-watcher
    app
    class="elevation-4 left-drawer LeftDrawer"
    :width="$store.state.less600 ? 250 : 161"
    dark
  >
    <v-toolbar flat class="logo-drawer-wrap transparent top-toolbar-height" style="z-index: 10;">
      <v-list class="pa-0">
        <v-avatar class="logo-drawer no-hover-color" to="/" >
          <img :src="logo" class="logo-drawer" alt="Voyager Logo">
        </v-avatar>
      </v-list>
    </v-toolbar>

    <v-list dense v-if="!miniVariant" >
      <template v-for="item in items">
      <v-list-group append-icon="" v-model="item.model" :key="item.text" >
        <v-list-item slot="activator" class="left-drawer-item" :to="item.to" active-class="active-drawer">
          <v-list-item-action style="min-width: 30px;">
            <v-icon class="text-drawer" style="color: rgba(62, 137, 108, 1) !important;">{{item.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content class="align-center justify-center">
            <v-list-item-title class="text-xs-left white--text">{{item.text}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action style="min-width: 0px;">
            <v-icon v-if="item.children" class="align-center justify-center mr-4">{{item.model ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
          </v-list-item-action>
        </v-list-item>

        <v-list-item
          v-for="(child, i) in item.children"
          :key="i"
          class="child-drawer"
          :to="child.to"
        >
          <v-list-item-content >
            <v-list-item-title class="white--text">{{child.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      </template>
    </v-list>

    <v-list v-else dense>
      <template  v-for="item in items">
        <v-list-group append-icon="" v-model="item.model" :key="item.text">
          <v-list-item slot="activator" :to="item.to" active-class="cyan--text text--accent-3">
            <v-list-item-action>
              <v-tooltip right>
                <v-icon  slot="activator" style="color: #D94255 !important;">{{item.icon}}</v-icon>
                <span>{{item.text}}</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>

          <v-list-item
            v-for="(child, i) in item.children"
            :key="i"
            style="background-color: #1565C0"
            :to="child.to"
            active-class="cyan--text text--accent-3"
          >
            <v-list-item-action>
              <v-tooltip right>
                <v-icon class="display-1" slot="activator">{{child.icon}}</v-icon>
                <span>{{child.text}}</span>
              </v-tooltip>
            </v-list-item-action>

          </v-list-item>
        </v-list-group>

      </template>
    </v-list>

  </v-navigation-drawer>
</template>

<script>
import isEmpty from 'lodash/isEmpty';

import logo from '@/assets/images/logo256.png';

export default {
  props: {
    clipped: Boolean,
    miniVariant: Boolean,
    drawer: Boolean,
    logout: Function,
    navItems: Array,
  },
  data: () => ({
    isDrawer: this ? this.drawer : true,
    isMiniVariant: this ? this.miniVariant : false,
    logo,
    items: [
      {
        icon: 'mdi-view-dashboard',
        text: 'Dashboard',
        to: '/',
      },
      {
        icon: 'mdi-domain',
        text: 'Companies',
        to: '/company/admin',
      },
      {
        icon: 'mdi-domain',
        text: 'Plateaus',
        to: '/plateau/admin',
      },
      {
        icon: 'mdi-domain',
        text: 'Rovers',
        to: '/rover/admin',
      },
    ],
  }),
  methods: {
    isEmpty,
  },
  watch: {
    drawer() {
      this.isDrawer = this.drawer;
    },
    isDrawer() {
      this.$emit('drawer', this.isDrawer);
    },
    isMiniVariant() {
      this.$emit('miniVariant', this.isMiniVariant);
    },
  },
};
</script>

<style>
.LeftDrawer .v-list-item {
  padding: 0;
}

.v-application--is-ltr .LeftDrawer .v-list-item__action:first-child,
.v-application--is-ltr .LeftDrawer .v-list-item__icon:first-child {
  margin-right: 2px;
  margin-left: 13px;
}

.LeftDrawer.left-drawer {
  background-color: #182437!important;
}

.LeftDrawer .logo-drawer-wrap  {
  height: auto !important;
}

.LeftDrawer .logo-drawer-wrap .v-toolbar__content {
  text-align: center;
  align-items: center;
  justify-content: center;
  height: auto !important;
  padding-top: 15px;
  padding-bottom: 15px;
}

.LeftDrawer .logo-drawer img {
  display: block;
}

.LeftDrawer .v-list {
  padding: 0;
}

.LeftDrawer .v-list-item--link:before {
  background-color: #415060;
}

.LeftDrawer .child-drawer .v-list-item__content {
  padding-left: 3em;
}

.LeftDrawer .v-navigation-drawer__content {
  overflow-y: overlay;
}
</style>
