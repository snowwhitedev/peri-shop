<template>
  <div>
    <h1 class="has-text-weight-bold is-size-5 is-capitalized">
      {{ getStepTitle('shipping') }}
    </h1>
    <h3
      class="subtitle has-text-weight-light has-text-grey is-6 is-capitalized"
    >
      {{ getStepSubtitle('shipping') }}
    </h3>

    <div
      v-if="showForm"
      class="w-full block p-3 shadow-md bg-gray-200"
    >
      <div class="flex flex-row w-full mb-2">
        <div class="w-full flex flex-col items-center">
          <span class="text-xl text-gray-600 font-semibold"><font-awesome-icon :icon="['fa', 'address-card']" /> Fill in address for shipping</span>
        </div>
      </div>

      <div class="w-full flex flex-col bg-white rounded shadow-lg my-2 p-2">
        <div class="grid grid-cols-6 gap-2 w-full">
          <div class="col-span-3 w-full">
            <b-tooltip
              label="First name"
              class="w-full"
              type="is-info"
              position="is-top"
            >
              <input
                id="first-name"
                v-model="form.first_name"
                placeholder="First Name"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
            </b-tooltip>
          </div>
          <div class="col-span-3 w-full">
            <b-tooltip
              label="Last name"
              class="w-full"
              type="is-info"
              position="is-top"
            >
              <input
                id="last-name"
                v-model="form.last_name"
                placeholder="Last Name"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
            </b-tooltip>
          </div>
          <div class="col-span-6 w-full">
            <b-tooltip
              label="Street address"
              class="w-full"
              type="is-info"
              position="is-top"
            >
              <input
                id="address1"
                v-model="form.shipping_address.address_line1"
                placeholder="Address line 1"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
            </b-tooltip>
          </div>
          <div class="col-span-6 w-full">
            <b-tooltip
              label="Apartment,suite,other..."
              class="w-full"
              type="is-info"
              position="is-top"
            >
              <input
                id="address2"
                v-model="form.shipping_address.address_line2"
                placeholder="Address line 2"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
            </b-tooltip>
          </div>
          <div class="col-span-3 w-full">
            <b-tooltip
              label="City"
              class="w-full"
              type="is-info"
              position="is-top"
            >
              <input
                id="city"
                v-model="form.shipping_address.city"
                placeholder="City"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
            </b-tooltip>
          </div>
          <div class="col-span-3 w-full">
            <b-tooltip
              label="State"
              class="w-full"
              type="is-info"
              position="is-top"
            >
              <input
                id="state"
                v-model="form.shipping_address.state"
                placeholder="State"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
            </b-tooltip>
          </div>
          <div class="col-span-3 w-full">
            <b-tooltip
              label="Zip code"
              class="w-full"
              type="is-info"
              position="is-top"
            >
              <input
                id="zip"
                v-model="form.shipping_address.zip"
                placeholder="Zip/postal code"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
            </b-tooltip>
          </div>
          <div class="relative col-span-6 w-full flex flex-col items-center mt-2">
            <div v-if="error" class="col-span-6 w-full bg-red-200 p-2 rounded m-2">
              <span
                class="text-xs text-red-700 font-semibold font-ubuntu"
              >{{ errorMessage }}</span>
            </div>
            <div class="col-span-6 w-full py-3">
              <button
                class="w-full py-2 px-4 shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-700 hover:bg-red-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                @click="validateAndSubmitAddressFields"
              >
                <!-- <span v-if="isLoading">Creating...</span> -->
                <span>Add shipping address</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FeaturedList
      v-if="subscriptionLoaded"
      selected-mode="shipping"
      :selected-shipping="selectedShipping"
      :data="shipping"
      @selected="updateSelection($event)"
    />
    <br>
    <b-button
      class="is-capitalized"
      type="is-black"
      size="is-large"
      expanded
      :disabled="!selectedShipping || incompleteFields"
      @click="savesubscriptionAsync()"
    >
      Next
    </b-button>
    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false" />
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import FeaturedList from '~/components/FeaturedList';

export default {
  name: 'Shipping',
  components: {
    FeaturedList
  },
  data () {
    return {
      showForm: true,
      incompleteFields: true,
      selectedShipping: null,
      shipping: null,
      subscriptionData: null,
      subscriptionLoaded: false,
      isLoading: false,
      payload: [],
      path: '/delivery',
      form: {
        first_name: '',
        last_name: '',
        shipping_address: {
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          zip: ''
        }
      },
      store_shipping_id: '',
      error: false,
      errorMessage: ''
    };
  },
  computed: {
    ...mapState('shopping', ['merchant', 'subscription']),
    ...mapGetters('shopping', [
      'getStepTitle',
      'getStepSubtitle',
      'getRoutesDictionary'
    ]),
    ROUTES_DICTIONARY: (vm) => {
      return vm.getRoutesDictionary(this.path);
    },
    user: (vm) => {
      return vm.$store.state.user;
    }
  },
  mounted () {
    this.getSubscriptionByStore();
    if (this.user.shipping_address) {
      this.showForm = false;
      this.incompleteFields = false;
    }

    // preset form fields if user information is available
    if (this.user.first_name && this.user.last_name) {
      this.form.first_name = this.user.first_name;
      this.form.last_name = this.user.last_name;
    }

    this.error = false;
  },
  methods: {
    async validateAndSubmitAddressFields () {
      const arr = [this.form.first_name, this.form.last_name, this.form.city, this.form.state, this.form.zip, this.form.address_line1, this.form.address_line2];
      const stringHasValue = Object.values(arr).some(x => (x === null || x === ''));

      if (stringHasValue) {
        this.error = true;
        this.errorMessage = 'All fields are required.';
        return;
      }

      try {
        this.form.shipping_address = JSON.stringify(this.form.shipping_address);
        const result = await this.$axios.$put(`${this.$config.API_URL}/shop/users/${this.user.user_id}`, this.form);

        this.$store.commit('setUser', result.user);
        this.error = false;
        this.showForm = false;
        this.incompleteFields = false;
      } catch (error) {
        this.error = true;
        this.errorMessage = 'Error adding address, please try again!';
        return false;
      }
    },

    updateSelection (data) {
      const shipping_data = {
        product_id: this.subscription.product.stripe_product_id,
        interval: this.subscription.price.interval,
        amount: '',
        store_shipping_id: data.shipping.store_shipping_id
      };

      // loop through payload to make sure duplicate objects are not registered
      // and to make sure items removed from the selected shipping object are removed from payload
      if (this.payload.length >= 1) {
        this.payload.forEach((_item, index) => {
          this.payload.splice(index, 1);
        });
      }

      shipping_data.amount = Number(data.shipping.price);
      this.payload.push(shipping_data);
      this.selectedShipping = data.shipping;
    },
    async getSubscriptionByStore () {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/stores/subscriptions/${this.merchant.store_id}`);

        this.subscriptionData = response.subscriptions.find(
          subscription => subscription.subscription_id == this.$route.params.subscription_id
        );
        this.getShippingAsync();
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    setSavedShipping (store_shipping_id) {
      if (store_shipping_id) {
        this.selectedShipping = this.shipping.find(
          item => item.store_shipping_id == store_shipping_id
        );

        // update stripe price payload for shipping on page load
        const shipping_data = {
          product_id: this.subscription.product.stripe_product_id,
          interval: this.subscription.price.interval,
          amount: '',
          store_shipping_id: this.selectedShipping.store_shipping_id
        };

        // loop through payload to make sure duplicate objects are not registered
        // and to make sure items removed from the selected shipping object are removed from payload
        if (this.payload.length >= 1) {
          this.payload.forEach((_item, index) => {
            this.payload.splice(index, 1);
          });
        }

        // loop through event data to get currently selected shipping object and add it to payload
        // for stripe
        shipping_data.amount = Number(this.selectedShipping.price);
        this.payload.push(shipping_data);
      }

      this.subscriptionLoaded = true;
    },
    async savesubscriptionAsync () {
      this.isLoading = true;
      let stripe_price_id = null;
      try {
        this.$axios.setHeader('Authorization', this.$store.state.userToken);

        if (this.payload.length >= 1) {
          // create stripe price for shipping
          stripe_price_id = await this.$axios.$post(`${this.$config.API_URL}/stripe/stores/${this.merchant.store_id}/prices`, { payload: this.payload });
        }

        await this.$axios.$put(
          `${this.$config.API_URL}/shop/subscriptions/${this.subscriptionData.subscription_id}`,
          {
            shipping_stripe_price_id: stripe_price_id.prices[0],
            store_shipping_id: this.selectedShipping.store_shipping_id,
            updated_at: new Date()
          }
        );
        const route = this.ROUTES_DICTIONARY.find(
          route => route.path === this.path
        );
        const nextPath = this.ROUTES_DICTIONARY[route.stepIndex + 1];
        this.$router.push({
          path: `/m/${this.merchant.slug}/subscriptions/${this.subscriptionData.subscription_id}${nextPath.path}`
        });
        this.isLoading = false;
      } catch (e) {
        console.error(e.message);
        this.isLoading = false;
        this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'An unexpected error occurred!',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      } finally {
        // Do Somethin
      }
    },
    async getShippingAsync () {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/stores/${this.merchant.store_id}/shippings`);

        this.shipping = response.shipping;
        this.setSavedShipping(this.subscriptionData.store_shipping_id);
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
