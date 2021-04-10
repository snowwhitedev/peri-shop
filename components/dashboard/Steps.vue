<template>
  <div class="p-3 md:py-6 w-full mt-8 flex flex-col">
    <div class="w-full flex flex-col justify-between bg-white shadow-md p-3">
      <span class="text-lg font-semibold text-gray-800 mb-1">{{ title }}</span>
      <span class="text-gray-600 text-base font-medium mb-2">{{ description }}</span>
      <div
        v-if="loading"
        class="w-full flex flex-col text-gray-700 font-medium shadow-md rounded-t rounded-b-none p-3"
      >
        <span>Loading steps...</span>
      </div>

      <div class="px-2">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex -mx-2"
        >
          <div class="w-1/3 px-2">
            <div class="text-sm">
              <span v-if="step.title === 'Select a Share'">Shares/Products/Services page</span>
              <span v-else-if="step.title === 'Location and Time'">Pickups page</span>
              <span v-else>{{ step.title }} page</span>
            </div>
          </div>
          <div class="w-1/3 px-2">
            <div class="h-12">
              <input
                :value="step.title"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                @blur="setStepTitle($event.target.value, step.title)"
              >
            </div>
          </div>
          <div class="w-1/3 px-2">
            <div class="h-12 text-right">
              <ToggleButton
                v-model="step.active"
                :index="index"
                onText="Disable"
                offText="Enable"
                @state-change="updateState(step.title)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="px-2">
        <div class="flex -mx-2">
          <div class="w-1/3 px-2">
            <div class="h-12">
              <div class="text-sm">
                <span>Enable/Disable Coupons</span>
              </div>
            </div>
          </div>
          <div class="w-1/3 px-2">
            <div class="h-12" />
          </div>
          <div class="w-1/3 px-2">
            <div class="h-12 text-right">
              <ToggleButton
                v-model="couponEnabled"
                :index="6"
                onText="Disable"
                offText="Enable"
                @state-change="updateCouponAvailability()"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-sm">
        <span v-if="uploading">Saving changes...</span>
        <span v-else>
          <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" @click="saveChanges">
            <span>Save Changes</span>
            <font-awesome-icon :icon="['fa', 'check']" />
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ToggleButton from '../toggleButton';

export default {
  name: 'SettingsSteps',
  components: {
    ToggleButton
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Settings'
    },
    description: {
      type: String,
      required: false,
      default: 'Edit step titles and enable/disable steps'
    },
    steps: {
      type: Array,
      required: true
    },
    storeId: {
      type: Number,
      required: true
    },
    updateState: {
      type: Function,
      required: true
    },
    updateCouponAvailability: {
      type: Function,
      required: true
    },
    couponEnabled: {
      type: Boolean,
      default: false
    },
    openNotification: {
      type: Function,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      uploading: false
    };
  },
  computed: {
    ...mapState(['token'])
  },
  created () {

  },
  methods: {
    // refactor to update steps title
    setStepTitle (value, title) {
      this.steps.forEach((step, index) => {
        if (step.title === title) {
          step.title = value;
          // remove edited step from array and replace with new values
          this.steps.splice(index, 1, step);
        }
      });
    },
    // save steps changes by store id
    async saveChanges () {
      try {
        this.uploading = true;
        await this.$axios.put(
          `/onboarding/stores/${this.storeId}`,
          { payload: { steps: JSON.stringify(this.steps) } },
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );

        return this.openNotification('Update successful!', 'is-success');
      } catch {
        this.openNotification(
          'Unable to save changes. An unexpected error occurred!',
          'is-primary'
        );
      } finally {
        this.uploading = false;
      }
    }
  }
};

</script>
