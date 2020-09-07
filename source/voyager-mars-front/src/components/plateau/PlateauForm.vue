<template>
  <v-dialog
    v-model="renderDialog"
    scrollable
    persistent
    max-width="500px"
    content-class="plateau-form"
    @keydown.esc="close()">
    <v-card>
      <v-card-title class="elevation-0 grey lighten-4">
        {{ plateau.id ? 'Edit' : 'New'}} Plateau
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-form ref="form" lazy-validation>
              <v-col cols="12">
                <v-text-field
                  label="Code"
                  v-model="plateau.code"
                  :rules="[rules.required]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Name"
                  v-model="plateau.name"
                  :rules="[rules.required]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Upper X Position"
                  v-model="plateau.upper_x_position"
                  :rules="[rules.required, rules.onlyNumbers]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Upper Y Position"
                  v-model="plateau.upper_y_position"
                  :rules="[rules.required, rules.onlyNumbers]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select label="Company"
                v-model="plateau.id_company"
                :items="companies" item-text="code" item-value="id"
                >
                </v-select>
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
import api from '@/api/plateau';
import apiCompany from '@/api/company';

export default {
  props: {
    showDialog: Boolean,
    value: Object,
  },

  data: () => ({
    renderDialog: true,
    plateau: null,
    companies: [],
    rules: {
      required: value => !!value || 'Required.',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      },
      onlyNumbers: (value) => {
        const pattern = /^[0-9]*$/;
        return pattern.test(value) || 'Invalid chars. Only accept numbers';
      },
    },
    loading: false,
  }),

  created() {
    this.plateau = Object.assign({}, this.value);
  },

  mounted() {
    this.getCompanies();
  },

  methods: {
    close() {
      this.$emit('showDialog', false);
    },

    async getCompanies() {
      await apiCompany.fetch(false).then(
        (res) => { this.companies = res.data; },
        );
    },

    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        try {
          if (!this.value.id) {
            const response = await api.create(this.plateau);
            this.plateau = response.data;
            Object.assign(this.value, this.plateau);
            this.$emit('new:plateau');
          } else {
            await api.update(this.plateau.id, this.plateau);
            Object.assign(this.value, this.plateau);
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
  .plateau-form form {
    width: 100%;
  }
</style>
