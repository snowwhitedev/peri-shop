<template>
  <section>
    <div class="columns is-centered ">
      <div class="column is-10">
        <SubscriptionSteps :path="path" :slug="merchant.slug">
          <template v-slot:delivery>
            <div class="w-full flex flex-col items-center">
              <div class="flex flex-row shadow-lg rounded border border-gray-800 font-semibold  text-gray-800">
                <button
                  :disabled="isPickupActive === false"
                  class="text-lg p-2 rounded-r-none disabled:cursor-not-allowed"
                  :class="pickupState ? 'text-white bg-gray-800 ' : ''"
                  @click="toggleStates"
                >
                  Pickups
                </button>
                <button
                  :disabled="isShippingActive === false"
                  class="text-lg p-2 rounded-l-none border-l disabled:cursor-not-allowed"
                  :class="shippingState ? 'text-white bg-gray-800 ' : ''"
                  @click="toggleStates"
                >
                  Shipping
                </button>
              </div>
            </div>
            <div v-if="pickupState && isPickupActive">
              <h1 class="has-text-weight-bold is-size-5 is-capitalized">
                {{ getStepTitle('pickup') }}
              </h1>
              <h3
                class="subtitle has-text-weight-light has-text-grey is-6 is-capitalized"
              >
                {{ getStepSubtitle('pickup') }}
              </h3>
              <FeaturedList
                v-if="subscriptionLoaded"
                selected-mode="pickups"
                :selected-pickup="selectedPickup"
                :data="pickups"
                @selected="updateSelection($event)"
              />
              <br>
              <b-button
                class="is-capitalized"
                type="is-black"
                size="is-large"
                expanded
                :disabled="!selectedPickup"
                @click="savesubscriptionAsync()"
              >
                Next
              </b-button>
              <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false" />
            </div>
            <Shipping v-if="shippingState && isShippingActive" />
          </template>
        </SubscriptionSteps>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import FeaturedList from '~/components/FeaturedList';
import Shipping from '~/components/Shipping';
import SubscriptionSteps from '~/components/SubscriptionSteps';
import { WEEK_DAYS } from '@/store/contants';

export default {
  layout: 'shopping',
  components: {
    FeaturedList,
    Shipping,
    SubscriptionSteps
  },
  data () {
    return {
      pickupState: false,
      shippingState: false,
      selectedPickup: null,
      pickups: null,
      subscription: null,
      subscriptionLoaded: false,
      isLoading: false,
      path: '/delivery',
      isPickupActive: null,
      isShippingActive: null
    };
  },
  computed: {
    ...mapState('shopping', ['merchant', 'steps']),
    ...mapGetters('shopping', [
      'getStepTitle',
      'getStepSubtitle',
      'getRoutesDictionary'
    ]),
    ROUTES_DICTIONARY: (vm) => {
      return vm.getRoutesDictionary(vm.path);
    }
  },
  mounted () {
    this.getSubscriptionByStore();
    this.pickupState = true;
    this.steps.forEach((step) => {
      if (step.type === 'pickup') {
        this.isPickupActive = step.active;
      } else if (step.type === 'shipping') {
        this.isShippingActive = step.active;
      }
    });

    if (!this.isPickupActive) {
      this.shippingState = true;
      this.pickupState = false;
    }
  },
  methods: {
    toggleStates () {
      this.shippingState = this.pickupState;
      this.pickupState = !this.shippingState;
    },

    updateSelection (payload) {
      this.selectedPickup = payload.pickup;
    },
    async getSubscriptionByStore () {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/stores/subscriptions/${this.merchant.store_id}`);

        this.subscription = response.subscriptions.find(
          subscription => subscription.subscription_id == this.$route.params.subscription_id
        );
        this.getPickupsAsync();
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    setSavedPickup (pickup_id) {
      if (pickup_id) {
        this.selectedPickup = this.pickups.find(
          pickup => pickup.pickup_id == pickup_id
        );
      }

      this.subscriptionLoaded = true;
    },
    async savesubscriptionAsync () {
      try {
        this.$axios.setHeader('Authorization', this.$store.state.userToken);
        await this.$axios.$put(
          `${this.$config.API_URL}/shop/subscriptions/${this.subscription.subscription_id}`,
          {
            pickup_id: this.selectedPickup.pickup_id,
            updated_at: new Date()
          }
        );
        const route = this.ROUTES_DICTIONARY.find(
          route => route.path === this.path
        );
        const nextPath = this.ROUTES_DICTIONARY[route.stepIndex + 1];
        this.$router.push({
          path: `/m/${this.merchant.slug}/subscriptions/${this.subscription.subscription_id}${nextPath.path}`
        });
      } catch (e) {
        console.error(e.message);
      } finally {
        // Do Somethin
      }
    },
    sortItems (a, b) {
      const a_index = WEEK_DAYS.indexOf(a.day_of_week);
      const b_index = WEEK_DAYS.indexOf(b.day_of_week);

      return a_index < b_index ? 0 : 1;
    },
    async getPickupsAsync () {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/shop/pickups/singleProduct/${this.merchant.store_id}?product_id=${this.subscription.product_id}`);

        this.pickups = response.pickups;
        this.setSavedPickup(this.subscription.pickup_id);
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    }
  },
  head () {
    return {
      title: `Per Diem | ${this.merchant ? this.merchant.name : ''} ${
        this.merchant && this.merchant.description ? `- ${this.merchant.description}` : ''
      }`,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: this.merchant ? this.merchant.description : ''
        }
      ]
    };
  }
};
</script>
