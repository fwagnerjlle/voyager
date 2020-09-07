<template>
  <v-app>
    <LeftDrawer :clipped="clipped" :drawer="drawer" :fixed="fixed" :miniVariant="miniVariant"  @drawer="val => { drawer = val}"/>
    <AppBar :clipped="clipped" :drawer="drawer" :drawer2="drawer2" :fixed="fixed" :miniVariant="miniVariant" @clipped="val => {clipped = val}"
          @drawer="val => { drawer = val}" @drawer2="val => { drawer2 = val}" @fixed="val => {fixed = val}" @miniVariant="val => { miniVariant = val }"/>
    <v-main class="content-main">
      <v-container fluid container-grey>
        <v-fade-transition mode="out-in">
          <router-view/>
        </v-fade-transition>
      </v-container>
    </v-main>
    <v-snackbar  v-model="isMessage" :error="$store.state.message.type === 'error'" :success="$store.state.message.type === 'success'" :info="$store.state.message.type === 'info'">
      {{this.$store.state.message.msg}}
      <v-btn text class="white--text" @click.native="isMessage = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import LeftDrawer from '../components/shared/LeftDrawer.vue';
import AppBar from '../components/shared/AppBar.vue';

export default {
  components: { LeftDrawer, AppBar },
  data() {
    return {
      clipped: !this.$store.state.less600 ? this.$store.state.less600 : !this.$store.state.less600,
      drawer: this.$store.state ? !this.$store.state.less600 : true,
      fixed: true,
      miniVariant: false,
      isMessage: false,
      usersChat: [],
      drawer2: false,
      pushed: false,
    };
  },

  watch: {
    '$store.state.windowWidth': function () {
      this.clipped = !this.$store.state.less600
        ? this.$store.state.less600 : !this.$store.state.less600;
      this.drawer = !this.drawer ? false : !this.$store.state.less600;
    },
    '$store.state.isMessage': function () {
      this.isMessage = this.$store.state.isMessage;
    },
    isMessage() {
      if (!this.isMessage) this.$store.commit('SET_MESSAGE', {});
    },
  },
};
</script>
