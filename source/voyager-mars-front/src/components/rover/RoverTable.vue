<template>
  <div class="RoverTable">
    <v-card flat>
      <div class="d-flex pb-6">
        <v-btn color="success" dark depressed @click="newRover()">Create New</v-btn>
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
        :items="rovers"
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
                @click="editRover(item)">
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
                class="mr-2"
                @click="moveRover(item)">
                mdi-arrow-all
              </v-icon>
            </template>
            <span>Move</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                v-on="on"
                @click="deleteRover(item)">
                mdi-delete
              </v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <RoverForm
      v-if="showRoverDialog"
      v-model="currentRover"
      @showDialog="showRoverDialog = $event"
      @edit:rover="createOrEditRoverHandler()"
    ></RoverForm>
    <MoveRoverForm
      v-if="showMoveRoverDialog"
      v-model="currentRover"
      @showDialog="showMoveRoverDialog = $event"
    ></MoveRoverForm>
  </div>
</template>

<script>
  import api from '@/api/rover';

  import RoverForm from '@/components/rover/RoverForm.vue';
  import MoveRoverForm from '@/components/rover/MoveRoverForm.vue';

  export default {
    components: { RoverForm, MoveRoverForm },

    data: () => ({
      rovers: [],
      rover: {},
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
          text: 'Current X Position',
          value: 'x_position',
        },
        {
          text: 'Current Y Position',
          value: 'y_position',
        },
        {
          text: 'Current Cardinal Direction',
          value: 'cardinal_direction',
        },
        {
          text: 'Company',
          value: 'company.name',
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
      showRoverDialog: false,
      showMoveRoverDialog: false,
      currentRover: {},
    }),

    created() {
      this.fetch();
    },

    methods: {
      async fetch() {
        this.loading = true;
        try {
          const { data: rovers } = await api.fetch({ search: this.search });
          this.rovers = rovers;
        } catch (error) {
          this.$store.commit('SET_MESSAGE', error.response.data);
        } finally {
          this.loading = false;
        }
      },
      newRover() {
        this.currentRover = {};
        this.showRoverDialog = true;
      },
      async createOrEditRoverHandler() {
        const { data: rovers } = await api.fetch({ search: this.search });
        this.rovers = rovers;
      },
      editRover(rover) {
        this.currentRover = rover;
        this.showRoverDialog = true;
      },
      moveRover(rover) {
        this.currentRover = rover;
        this.showMoveRoverDialog = true;
      },
      async deleteRover(rover) {
        try {
          this.loading = true;
          await api.delete(rover.id);
          this.rovers.splice(this.rovers.indexOf(rover), 1);
        } catch (error) {
          this.$store.commit('SET_MESSAGE', error.response.data);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
