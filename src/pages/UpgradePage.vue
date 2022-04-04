<template lang="html">
  <div>
    <pre>{{ loading }}</pre>
    <stripe-checkout
      ref="checkoutRef"
      mode="subscription"
      pk="pk_live_5160DvBGpsgtQXdlaEzH237I6JOkwRhfO5s6nbrK9IG9erzIbkpW610yu7qE4PUjEQAc2GXbM20egr82H1mkRN5rn00qDa5dw1L"
      :line-items="lineItems"
      success-url="http://localhost:4000/#/upgrade"
      cancel-url="http://localhost:4000/#/upgrade"
      @loading="load"
    />

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
      lineItems: [
        {
          price: 'prod_LQ5kl5sCkdI7Kr',
          quantity: 1,
        },
      ],
    };
  },

  methods: {
    load(status) {
      console.log(status);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

