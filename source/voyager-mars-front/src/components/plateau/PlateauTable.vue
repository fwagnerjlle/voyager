<template>
  <div class="PlateauTable">
    <v-card flat>
      <div class="d-flex pb-6">
        <v-btn color="success" dark depressed @click="newPlateau()">Create New</v-btn>
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
        :items="plateaus"
        :items-per-page="10"
        :search="search"
        :options="options"
        class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                v-on="on"
                class="mr-2"
                @click="editPlateau(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                v-on="on"
                @click="deletePlateau(item)">
                mdi-delete
              </v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <PlateauForm
      v-if="showPlateauDialog"
      v-model="currentPlateau"
      @showDialog="showPlateauDialog = $event"
      @new:plateau="newPlateauHandler()"
    ></PlateauForm>
  </div>
</template>

<script>
  import api from '@/api/plateau';

  import PlateauForm from '@/components/plateau/PlateauForm.vue';

  export default {
    components: { PlateauForm },

    data: () => ({
      plateaus: [],
      plateau: {},
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
          text: 'X Position',
          value: 'upper_x_position',
        },
        {
          text: 'Y Position',
          value: 'upper_y_position',
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
      showPlateauDialog: false,
      currentPlateau: {},
    }),

    created() {
      this.fetch();
    },

    methods: {
      async fetch() {
        this.loading = true;
        try {
          const { data: plateaus } = await api.fetch({ search: this.search });
          this.plateaus = plateaus;
        } catch (error) {
          this.$store.commit('SET_MESSAGE', error.response.data);
        } finally {
          this.loading = false;
        }
      },
      newPlateau() {
        this.currentPlateau = {};
        this.showPlateauDialog = true;
      },
      newPlateauHandler() {
        this.plateaus.push(this.currentPlateau);
      },
      editPlateau(plateau) {
        this.currentPlateau = plateau;
        this.showPlateauDialog = true;
      },
      async deletePlateau(plateau) {
        try {
          this.loading = true;
          await api.delete(plateau.id);
          this.plateaus.splice(this.plateaus.indexOf(plateau), 1);
        } catch (error) {
          this.$store.commit('SET_MESSAGE', error.response.data);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
