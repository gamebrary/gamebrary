<template lang="html">
  <div>
    <stripe-checkout
      ref="checkoutRef"
      mode="subscription"
      pk="pk_test_Plr6zbTURKQbfRUkcXYP58hl"
      :line-items="lineItems"
      success-url="http://localhost:4000/#/upgrade?state=success"
      cancel-url="http://localhost:4000/#/upgrade?state=cancel"
      @loading="load"
    />

    <pre>{{ lineItems }}</pre>
    <pre>{{ loading }}</pre>
    <!-- TODO: finish UI, set loading spinner -->

    <b-button @click="planSelected = 'monthly'">Monthly</b-button>
    <b-button @click="planSelected = 'yearly'">Yearly</b-button>
  </div>
</template>

<script>
import { StripeCheckout } from '@vue-stripe/vue-stripe';

export default {
  components: {
    StripeCheckout,
  },

  data() {
    return {
      loading: false,
      planSelected: null,
      monthlyPlan: {
        price: 'price_1KjFY4GpsgtQXdlaWZa44Gbj',
        quantity: 1,
      },
      yearlyPlan: {
        price: 'price_1KjFYeGpsgtQXdlajXFxtkDN',
        quantity: 1,
      },
    };
  },

  computed: {
    lineItems() {
      if (this.planSelected === 'monthly') return [this.monthlyPlan];
      if (this.planSelected === 'yearly') return [this.yearlyPlan];

      return [{}];
    },
  },

  watch: {
    planSelected() {
      this.$refs.checkoutRef.redirectToCheckout();
    },
  },

  methods: {
    load(value) {
      this.loading = value;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

