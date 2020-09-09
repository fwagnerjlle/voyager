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
          <v-form ref="form" lazy-validation>
            <v-row>
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
            </v-row>
          </v-form>
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
            await api.create(this.plateau);
          } else {
            await api.update(this.plateau.id, this.plateau);
          }
          this.$emit('edit:plateau');
          this.close();
        } catch (error) {
          this.$store.commit('SET_MESSAGE', error.response.data);
        } finally {
          this.loading = false;
        }
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
