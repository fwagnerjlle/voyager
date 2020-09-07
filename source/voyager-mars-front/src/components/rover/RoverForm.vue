<template>
  <v-dialog
    v-model="renderDialog"
    scrollable
    persistent
    max-width="500px"
    content-class="rover-form"
    @keydown.esc="close()">
    <v-card>
      <v-card-title class="elevation-0 grey lighten-4">
        {{ rover.id ? 'Edit' : 'New'}} Rover
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-form ref="form" lazy-validation>
              <v-col cols="12">
                <v-text-field
                  label="Code"
                  v-model="rover.code"
                  :rules="[rules.required]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Name"
                  v-model="rover.name"
                  :rules="[rules.required]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :label="rover.id ? 'Current X Position' : 'Initial X Position'"
                  v-model="rover.x_position"
                  :rules="[rules.required, rules.onlyNumbers]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :label="rover.id ? 'Current Y Position' : 'Initial Y Position'"
                  v-model="rover.y_position"
                  :rules="[rules.required, rules.onlyNumbers]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :label="rover.id ? 'Current Cardinal Direction' : 'Initial Cardinal Direction'"
                  v-model="rover.cardinal_direction"
                  :rules="[rules.required, rules.onlyCardinals]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select label="Company"
                v-model="rover.id_company"
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
import api from '@/api/rover';
import apiCompany from '@/api/company';

export default {
  props: {
    showDialog: Boolean,
    value: Object,
  },

  data: () => ({
    renderDialog: true,
    rover: null,
    companies: [],
    rules: {
      required: value => !!value || 'Required.',
      onlyNumbers: (value) => {
        const pattern = /^[0-9]*$/;
        return pattern.test(value) || 'Invalid chars. Only accept numbers';
      },
      onlyCardinals: (value) => {
        const pattern = /^[S|N|W|E]?$/;
        return pattern.test(value) || 'Invalid chars. Only accept one occurrence of S (South), N (North), W (West) or E (East)';
      },
    },
    loading: false,
  }),

  created() {
    this.rover = Object.assign({}, this.value);
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
            const response = await api.create(this.rover);
            this.rover = response.data;
            Object.assign(this.value, this.rover);
            this.$emit('new:rover');
          } else {
            await api.update(this.rover.id, this.rover);
            Object.assign(this.value, this.rover);
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
  .rover-form form {
    width: 100%;
  }
</style>
