<template>
    <v-dialog
        v-model="renderDialog"
        scrollable
        persistent
        max-width="600px"
        content-class="move-form"
        @keydown.esc="close()">
        <v-card>
        <v-card-title class="elevation-0 grey lighten-4">
            Move Rover {{ rover.code }}
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                label="Instruction"
                                placeholder="Put your instruction here. L (rotate left), R (rotate right) or M (move)"
                                v-model="instruction"
                                :rules="[rules.required, rules.validChars]">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
        </v-card-text>
        <v-card-actions class="elevation-0 px-6 pb-4">
            <v-btn color="blue accent-3" outlined dark depressed @click="close()" :disabled="loading">Close</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success" depressed @click="moveRover()" :loading="loading">Move</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import api from '@/api/rover';

export default {
  props: {
    showDialog: Boolean,
    value: Object,
  },

  data: () => ({
    renderDialog: true,
    rover: null,
    rules: {
      required: value => !!value || 'Required.',
      validChars: (value) => {
        const pattern = /^[L-R-M]+$/;
        return pattern.test(value) || 'Invalid chars. Only accept L, R or M';
      },
    },
    loading: false,
    instruction: '',
  }),

  created() {
    this.rover = Object.assign({}, this.value);
  },

  methods: {
    close() {
      this.$emit('showDialog', false);
    },

    async moveRover() {
        try {
          const response = await api.move(this.rover.id, { instruction: this.instruction });
          this.rover = response.data;
          Object.assign(this.value, this.rover);
        } catch (error) {
          this.$store.commit('SET_MESSAGE', error.response.data);
        }
        this.close();
    },
  },
};
</script>
