<template>
  <v-dialog
    v-model="renderDialog"
    scrollable
    persistent
    max-width="500px"
    content-class="company-form"
    @keydown.esc="close()">
    <v-card>
      <v-card-title class="elevation-0 grey lighten-4">
        {{ company.id ? 'Edit' : 'New'}} Company
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-form ref="form" lazy-validation>
              <v-col cols="12">
                <v-text-field
                  label="Code"
                  v-model="company.code"
                  :rules="[rules.required]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Name"
                  v-model="company.name"
                  :rules="[rules.required]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Description"
                  v-model="company.description">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email"
                  v-model="company.email"
                  :rules="[rules.required, rules.email]">
                </v-text-field>
              </v-col>
            </v-form>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="elevation-0 px-6 pb-4">
        <v-btn color="blue accent-3" outlined dark depressed @click="close()" :disabled="loading">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" depressed @click="save()" :loading="loading">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/api/company';

export default {
  props: {
    showDialog: Boolean,
    value: Object,
  },

  data: () => ({
    renderDialog: true,
    company: null,
    rules: {
      required: value => !!value || 'Required.',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      },
    },
    loading: false,
  }),

  created() {
    this.company = Object.assign({}, this.value);
  },

  methods: {
    close() {
      this.$emit('showDialog', false);
    },

    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        try {
          if (!this.value.id) {
            const response = await api.create(this.company);
            this.company = response.data;
            Object.assign(this.value, this.company);
            this.$emit('new:company');
          } else {
            await api.update(this.company.id, this.company);
            Object.assign(this.value, this.company);
          }
        } catch (error) {
          this.$store.commit('SET_MESSAGE', error.response.data);
        } finally {
          this.loading = false;
        }

        this.close();
      }
    },
  },
};
</script>

<style>
  .company-form form {
    width: 100%;
  }
</style>
