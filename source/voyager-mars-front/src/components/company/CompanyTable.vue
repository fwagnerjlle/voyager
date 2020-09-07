<template>
  <div class="CompanyTable">
    <v-card flat>
      <div class="d-flex pb-6">
        <v-btn color="success" dark depressed @click="newCompany()">Create New</v-btn>
        <v-spacer/>
        <v-layout d-flex justify-end>
          <v-flex xs6>
            <v-text-field
              label="Search"
              v-model="search"
              append-icon="mdi-magnify"
              single-line
              hide-details
            />
          </v-flex>
        </v-layout>
      </div>
      <v-data-table
        :headers="headers"
        :items="companies"
        :items-per-page="10"
        :search="search"
        :options="options"
        class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editCompany(item)">
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteCompany(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <CompanyForm
      v-if="showCompanyDialog"
      v-model="currentCompany"
      @showDialog="showCompanyDialog = $event"
      @new:company="newCompanyHandler()"
    ></CompanyForm>
  </div>
</template>

<script>
  import api from '@/api/company';

  import CompanyForm from '@/components/company/CompanyForm.vue';

  export default {
    components: { CompanyForm },

    data: () => ({
      companies: [],
      company: {},
      headers: [
        {
          text: 'Code',
          value: 'code',
          align: 'start',
        },
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Description',
          value: 'description',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        },
      ],
      loading: false,
      search: '',
      options: {
        sortBy: ['code'],
      },
      showCompanyDialog: false,
      currentCompany: {},
    }),

    created() {
      this.fetch();
    },

    methods: {
      async fetch() {
        this.loading = true;
        try {
          const { data: companies } = await api.fetch({ search: this.search });
          this.companies = companies;
        } catch (error) {
          this.$store.commit('SET_MESSAGE', error.response.data);
        } finally {
          this.loading = false;
        }
      },
      newCompany() {
        this.currentCompany = {};
        this.showCompanyDialog = true;
      },
      newCompanyHandler() {
        this.companies.push(this.currentCompany);
      },
      editCompany(company) {
        this.currentCompany = company;
        this.showCompanyDialog = true;
      },
      async deleteCompany(company) {
        try {
          this.loading = true;
          await api.delete(company.id);
          this.companies.splice(this.companies.indexOf(company), 1);
        } catch (error) {
          this.$store.commit('SET_MESSAGE', error.response.data);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
