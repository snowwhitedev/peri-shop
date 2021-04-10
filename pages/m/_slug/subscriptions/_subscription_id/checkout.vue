<template>
  <section>
    <div class="columns is-centered">
      <div class="column is-10">
        <SubscriptionSteps :path="'/checkout'" :slug="merchant.slug">
          <template v-slot:checkout>
            <h1 class="has-text-weight-bold is-size-5 is-capitalized">
              {{ getStepTitle("checkout") }}
            </h1>
            <h3 class="subtitle has-text-weight-light has-text-grey is-6 is-capitalized">
              {{ getStepSubtitle("checkout") }}
            </h3>

            <Featured v-if="summary" class="has-background-muted">
              <h1 class="subtitle is-6 is-capitalized has-text-weight-bold">
                Your Plan
              </h1>
              <Featured>
                <div class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item">
                      <p class="is-size-7">
                        Your subscription
                      </p>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <b-button
                        tag="router-link"
                        type="is-primary"
                        size="is-small"
                        :to="`/m/${merchant.slug}/subscriptions/${subscription_id}/share`"
                      >
                        Edit
                      </b-button>
                    </div>
                  </div>
                </div>

                <hr>

                <div class="columns">
                  <div class="column">
                    <p class="has-text-weight-bold is-size-6">
                      {{ summary.product.title }}
                    </p>
                    <p class="is-size-7">
                      {{ summary.product.description }}
                    </p>
                  </div>
                  <div class="column">
                    <div class="is-size-7 has-text-right">
                      <p class="is-capitalized has-text-grey">
                        {{
                          `$${summary.price.price}/${summary.price.interval}`
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </Featured>

              <Featured v-if="summary.addons && summary.addons.length > 0">
                <div class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item">
                      <p class="is-size-7">
                        Add-ons
                      </p>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <b-button
                        tag="router-link"
                        type="is-primary"
                        size="is-small"
                        :to="`/m/${merchant.slug}/subscriptions/${subscription_id}/addons`"
                      >
                        Edit
                      </b-button>
                    </div>
                  </div>
                </div>

                <hr>

                <div v-for="(addon, index) in summary.addons" :key="index" class="columns">
                  <div class="column">
                    <p class="has-text-weight-bold is-size-6">
                      {{ addon.title }}
                    </p>
                    <p class="is-size-7">
                      {{ addon.description }}
                    </p>
                  </div>
                  <div class="column">
                    <div class="is-size-7 has-text-right">
                      <p class="is-capitalized has-text-grey">
                        {{
                          `$${addon.price}`
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </Featured>

              <Featured>
                <div class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item">
                      <p class="is-size-7">
                        Time and Place
                      </p>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <b-button
                        tag="router-link"
                        type="is-primary"
                        size="is-small"
                        :to="`/m/${merchant.slug}/subscriptions/${subscription_id}/delivery`"
                      >
                        Edit
                      </b-button>
                    </div>
                  </div>
                </div>
                <hr>
                <div v-if="summary.pickup" class="columns is-mobile is-multiline">
                  <div
                    class="column is-full-mobile is-half-tablet  is-5-desktop"
                  >
                    <div class="has-text-centered has-background-black has-text-white box">
                      <p class="has-text-weight-bold is-capitalized is-size-5">
                        {{ summary.pickup.day_of_week }}
                      </p>
                      <p class="is-size-7">
                        {{
                          `${summary.pickup.start_time} - ${summary.pickup.end_time}`
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="column">
                    <div>
                      <p class="is-size-6 has-text-weight-bold is-capitalized">
                        {{ summary.pickup.title }}
                      </p>
                      <div>
                        <font-awesome-icon :icon="['fa', 'map-marker-alt']" />
                        <span class="is-size-7">pickup at:</span>
                      </div>
                      <div class="is-size-7 has-text-grey">
                        {{
                          `${summary.pickup.location.address}, ${summary.pickup.location.city}, ${summary.pickup.location.state}, ${summary.pickup.location.country}`
                        }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="summary.shipping" class="columns is-mobile">
                  <div class="column">
                    <p class="has-text-weight-bold is-size-6">
                      Shipping details
                    </p>
                    <div>
                      <div class="is-size-7">
                        <font-awesome-icon :icon="['fa', 'map-marker-alt']" />
                        <span class="has-text-weight-bold">Address:</span>
                      </div>
                      <p v-if="user.shipping_address" class="is-size-7 has-text-grey">
                        {{ `${user.shipping_address.address_line1}, ${user.shipping_address.address_line2}, ${user.shipping_address.city}, ${user.shipping_address.state} ${user.shipping_address.zip}` }}
                      </p>
                      <p v-else class="is-size-7 has-text-grey">
                        No shipping address set.
                      </p>
                      <div class="is-size-7">
                        <font-awesome-icon :icon="['fa', 'user']" />
                        <span class="has-text-weight-bold">Customer:</span>
                      </div>
                      <p class="is-size-7 has-text-grey">
                        {{ `${user.first_name}, ${user.last_name}` }}
                      </p>
                    </div>
                  </div>
                  <div class="column">
                    <div class="is-size-7 has-text-right">
                      <p class="is-capitalized has-text-grey">
                        {{
                          `$${summary.shipping.price}`
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </Featured>
            </Featured>

            <Featured v-if="summary">
              <div v-if="merchant.coupons_enabled">
                <div class="flex flex-col w-full">
                  <label
                    for="coupon"
                    class="mb-1 text-base font-medium text-gray-800"
                  >Do you have a coupon code?</label>
                  <div class="grid grid-flow-row grid-cols-12">
                    <input
                      v-model="coupon_code"
                      type="text"
                      name="coupon"
                      placeholder="Enter coupon code..."
                      :disabled="loading"
                      class="px-4 py-2 col-span-8 border border-gray-500 rounded rounded-r-none disabled:opacity-50"
                    >
                    <button
                      class="relative col-span-4 flex justify-center px-4 py-2 rounded-l-none text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md group hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600"
                      @click="claimCoupon"
                    >
                      <span v-if="loading">please wait...</span>
                      <span v-else>Claim Coupon</span>
                    </button>
                  </div>
                </div>
              </div>
              <h2 class="has-text-weight-bold is-capitalized">
                Order Summary
              </h2>
              <br>
              <div class="columns is-mobile">
                <div class="column">
                  <p class="is-size-7 has-text-grey">
                    {{ summary.product.title }}
                  </p>
                </div>
                <div class="column">
                  <div class="is-size-7 has-text-right">
                    <p class="is-capitalized">
                      {{ `$${summary.price.price} ` }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="summary.addons && summary.addons.length >= 1" class="columns is-mobile">
                <div class="column">
                  <p class="is-size-7 has-text-grey">
                    Addons
                  </p>
                </div>
                <div class="column">
                  <div class="is-size-7 has-text-right">
                    <p class="is-capitalized">
                      {{ `$${addons_price_total} ` }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="summary.shipping" class="columns is-mobile">
                <div class="column">
                  <p class="is-size-7 has-text-grey">
                    Shipping
                  </p>
                </div>
                <div class="column">
                  <div class="is-size-7 has-text-right">
                    <p class="is-capitalized">
                      {{ `$${summary.shipping.price} ` }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="discounted" class="columns is-mobile">
                <div class="column">
                  <p class="is-size-7 has-text-grey">
                    Discount
                  </p>
                </div>
                <div class="column">
                  <div class="is-size-7 has-text-right">
                    <p class="is-capitalized">
                      $-{{ coupon_amount }}
                    </p>
                  </div>
                </div>
              </div>
              <hr>
              <div class="columns is-mobile">
                <div class="column">
                  <p class="is-size-7 has-text-grey">
                    Subtotal
                  </p>
                </div>
                <div class="column">
                  <div class="is-size-7 has-text-right">
                    <p class="is-capitalized">
                      ${{
                        getPrice()
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </Featured>

            <b-button
              class="is-uppercase"
              type="is-dark"
              expanded
              @click="createOrder"
            >
              Place Order
            </b-button>
            <b-loading
              :is-full-page="false"
              :active.sync="isLoading"
              :can-cancel="false"
            />
          </template>
        </SubscriptionSteps>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Featured from '~/components/Featured';
export default {
  layout: 'shopping',
  components: {
    Featured
  },
  data () {
    return {
      subscription_id: this.$route.params.subscription_id,
      subscriptionLoaded: false,
      isLoading: false,
      loading: false,
      summary: null,
      coupon_code: null,
      valid_coupon_code: null,
      coupon_amount: null,
      coupon: {},
      discounted: false,
      addons_price_total: 0,
      subscriptionObj: null
    };
  },
  computed: {
    ...mapState('shopping', ['merchant', 'subscription']),
    ...mapGetters('shopping', ['getStepTitle', 'getStepSubtitle']),
    user: (vm) => {
      return vm.$store.state.user;
    }
  },
  async mounted () {
    try {
      const { subscription } = await this.$axios.$get(
      `/stores/${this.merchant.store_id}/subscriptions/${this.$route.params.subscription_id}`
      );
      this.subscriptionObj = subscription;
    } catch (error) {
      console.error(error);
      this.$buefy.notification.open({
        duration: 2000,
        closable: false,
        animation: 'fade',
        message: 'An unexpected error occurred!',
        position: 'is-bottom-right',
        type: 'is-primary'
      });
    }

    this.getSubscriptionByStore();
  },
  methods: {
    getPrice () {
      let price;
      if (Object.entries(this.coupon).length !== 0) {
        price = (Number(this.summary.price.price) + this.addons_price_total) - this.coupon_amount;
      } else if (this.summary.shipping && this.summary.shipping.price) {
        price = (Number(this.summary.price.price) + this.addons_price_total + Number(this.summary.shipping.price));
      } else {
        price = (Number(this.summary.price.price) + this.addons_price_total);
      }

      return price;
    },

    async getCouponAndCheckValidity (couponCode) {
      const user_id = this.user.user_id;
      try {
        const { coupon } = await this.$axios.$get(
          `/shop/coupons/${couponCode}`
        );

        const couponDate = new Date(coupon.expires);
        const formatter = new Intl.DateTimeFormat();
        const expiry = formatter.format(couponDate);
        const today = formatter.format(Date.now());

        const { subscription } = await this.$axios.$get(
        `/shop/subscriptions/${this.subscription.subscription_id}/coupon?user_id=${user_id}&coupon_id=${coupon.coupon_id}`
        );

        if (expiry < today || subscription) {
          this.loading = false;
          return false;
        }

        return coupon;
      } catch (error) {
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'An unexpected error occurred!',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    async claimCoupon () {
      try {
        this.loading = true;
        const coupon = await this.getCouponAndCheckValidity(this.coupon_code);

        if (!coupon) {
          this.loading = false;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'This coupon has expired or it has already been used!',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        }

        if (coupon.is_active) {
          this.valid_coupon_code = coupon.name;
          this.discounted = true;
          this.coupon = coupon;

          await this.$axios.$put(`/shop/subscriptions/${this.subscription.subscription_id}`, { coupon_id: coupon.coupon_id });

          if (coupon.isPercent) {
            this.coupon_amount =
              coupon.amount * 0.01 * this.summary.price.price;
          } else {
            this.coupon_amount = coupon.amount;
          }
        } else {
          this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Coupon code is invalid',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
        this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'An unexpected error occurred!',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      } finally {
        this.coupon_code = null;
      }
    },

    async getSubscriptionByStore () {
      this.isLoading = true;
      try {
        this.subscriptionLoaded = true;
        await this.getSubscriptionSummary(this.subscription_id);
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },

    async getSubscriptionSummary (subscription_id) {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/shop/subscriptions/${subscription_id}`
        );
        this.summary = response.summary;
        this.summary.subscription_id = subscription_id;
        this.$store.commit('shopping/setSubscription', this.summary);

        // get total price of selected addons
        if (this.summary.addons) {
          this.summary.addons.forEach((item) => {
            this.addons_price_total += Number(item.price);
          });
        }
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },

    convertToTime (hours) {
      const time = new Date(null);
      return new Date(time.setHours(hours)).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    async createOrder () {
      // check if the subscription for which customer is trying to check out is already active
      // hence, delete the existing instance on stripe and create a new one
      if (this.subscriptionObj.is_complete) {
        try {
          const subscription = await this.$axios.$delete(
            `${this.$config.API_URL}/stripe/stores/${this.merchant.store_id}/subscriptions/${this.subscriptionObj.stripe_subscription_id}`
          );

          if (subscription.deleted) {
            await this.$axios.$put(
          `${this.$config.API_URL}/shop/subscriptions/${this.subscription_id}`,
          {
            is_complete: false,
            updated_at: new Date()
          });
          }
        } catch (error) {
          console.log(error);
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'An unexpected error occurred!',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        }
      }

      this.$router.push(
        `/m/${this.merchant.slug}/subscriptions/${
          this.subscription_id
        }/stripeCheckout${
          this.valid_coupon_code ? '?coupon=' + this.valid_coupon_code : ''
        }`
      );
    },

    getDayOfTheWeekAbr (dayOfTheWeek) {
      return dayOfTheWeek.substring(0, 3);
    }
  },
  head () {
    return {
      title: `Per Diem | ${this.merchant ? this.merchant.name : ''} ${
        this.merchant && this.merchant.description
          ? `- ${this.merchant.description}`
          : ''
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

<style lang="scss" scoped>
.has-background-muted {
  background-color: #f3f6fb;
  border: none;
  .columns {
    margin: 0;
    .box {
      margin-bottom: 0;
    }
  }
}
.level {
  margin-bottom: 0;
}
hr {
  margin: 0.75rem 0;
}
.field {
  &.is-grouped {
    .field {
      margin-bottom: 0;
    }
    input {
      border: solid #d1dbec 1px;
    }
    #expiration,
    #cvc {
      width: 4.5rem !important;
    }
  }
}
</style>
