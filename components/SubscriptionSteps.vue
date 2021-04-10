<template>
  <div>
    <div class="columns is-centered is-mobile">
      <div class="column is-narrow">
        <client-only>
          <figure class="image is-128x128">
            <img :src="logo" alt="Per Diem">
          </figure>
        </client-only>
      </div>
    </div>
    <client-only>
      <b-steps
        v-model="activeStep"
        :type="type"
        size="is-medium"
        :has-navigation="hasNavigation"
        :mobile-mode="mobileMode"
        :icon-pack="iconPack"
        @input="getPath($event)"
      >
        <template v-for="(route, index) in ROUTES_DICTIONARY">
          <b-step-item
            :key="index"
            :step="index + 1"
            :label="getLabel(route.path)"
            :icon="getIcon(route.path)"
          >
            <br>
            <slot :name="route.path == '/' ? 'welcome' : route.path == '/share' ? 'shares' : route.path.substring(1)" />
          </b-step-item>
        </template>
      </b-steps>
    </client-only>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'SubscriptionSteps',
  props: {
    path: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      type: 'is-primary',
      hasNavigation: false,
      mobileMode: null,
      iconPack: 'fas',
      activeStep: 0
    };
  },
  computed: {
    ...mapState('shopping', ['merchant']),
    ...mapGetters('shopping', [
      'getStepIcon',
      'getStepIconTitle',
      'getStepStatus',
      'getRoutesDictionary'
    ]),
    logo: (vm) => {
      return vm.merchant.logo;
    },
    ROUTES_DICTIONARY: (vm) => {
      return vm.getRoutesDictionary(vm.path);
    }
  },
  created () {
    this.activeStep = this.getActiveStep();
  },
  methods: {
    getLabel (routePath) {
      if (routePath === this.$config.WELCOME_PATH) {
        return 'Welcome';
      }

      if (routePath === this.$config.SHARES_PATH) {
        return this.getStepIconTitle('products');
      }

      if (routePath === this.$config.DELIVERY_PATH) {
        return 'Time and Place';
      }

      return this.getStepIconTitle(routePath.substring(1));
    },

    getIcon (routePath) {
      if (routePath === this.$config.WELCOME_PATH) {
        return 'sign-in-alt';
      }

      if (routePath === this.$config.SHARES_PATH) {
        return this.getStepIcon('products');
      }

      if (routePath === this.$config.DELIVERY_PATH) {
        return this.getStepIcon('pickup');
      } else {
        return this.getStepIcon(routePath.substring(1));
      }
    },
    getPath (index) {
      const routes = this.getRoutesDictionary(this.path);
      const route = routes.find(
        route => route.stepIndex === index
      );
      if (route.path === this.$config.WELCOME_PATH) {
        this.$router.push({
          path: `/m/${this.merchant.slug}/`
        });
      } else {
        this.$router.push({
          path: `/m/${this.merchant.slug}/subscriptions/${this.$route.params.subscription_id}${route.path}`
        });
      }
    },
    getActiveStep () {
      const routes = this.getRoutesDictionary(this.path);
      let stepIndex = null;
      routes.filter(
        route => route.path == this.path
      ).map((r) => {
        if (r.path == this.path) {
          stepIndex = r.stepIndex;
        }
      });
      return stepIndex;
    }
  }
};
</script>

<style lang="scss">
$primary: #e53318;

.step-item {
  .step-title {
    font-size: 0.9rem !important;
  }

  .step-marker {
    background-color: #dbdbdb !important;
    color: #546e7a !important;
    border: none !important;
  }

  &.is-active {
    .step-marker {
      background-color: $primary !important;
      color: white !important;
      border: none !important;
    }
  }

  &.is-previous {
    .step-marker {
      background-color: $primary !important;
      color: white !important;
      border: none !important;
    }
  }
}
</style>
