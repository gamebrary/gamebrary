<template lang="html">
  <b-container fluid>
    <stripe-checkout
      ref="checkoutRef"
      mode="subscription"
      pk="pk_test_Plr6zbTURKQbfRUkcXYP58hl"
      :line-items="lineItems"
      success-url="http://localhost:4000/#/upgrade?state=success"
      cancel-url="http://localhost:4000/#/upgrade?state=cancel"
      @loading="load"
    />

    <b-card class="text-center">
      <h2>Level up your video game collection!</h2>
      <p class="lead-text">
        Organize your video game collection with Gamebrary.
      </p>

      <b-button-group>
        <b-button
          :variant="planSelected === 'monthly' ? 'info' : 'light'"
          @click="planSelected = 'monthly'"
        >
          Monthly billing
        </b-button>
        <b-button
          :variant="planSelected === 'yearly' ? 'info' : 'light'"
          v-b-tooltip.top="'2 Months free'"
          @click="planSelected = 'yearly'"
        >
          Yearly billing
        </b-button>
      </b-button-group>

      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col" class="text-muted">
              Gamebrary Free
              <br />
              <h2 class="price">
                $0{{ pricingLabel }}
              </h2>
            </th>
            <th scope="col" class="text-success">
              Gamebrary Pro
              <br />
              <h2 class="price">
                ${{ `${amountToPay}${pricingLabel}` }}
              </h2>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Unlimited game boards
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              Search
            </td>
            <td class="text-muted">
              Basic
            </td>
            <td class="text-success">
              Advanced
            </td>
          </tr>

          <tr>
            <td>
              Board filters
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              Customizations
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              Speedruns
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              Steam integration
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              Tags
            </td>
            <td>
              5
            </td>
            <td>
              Unlimited
            </td>
          </tr>

          <tr>
            <td>
              Notes
            </td>
            <td>
              Plain text
            </td>
            <td>
              Custom notes, rich text.
            </td>
          </tr>

          <tr>
            <td>
              Custom URL
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              Progress tracking
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              Keyboard shortcuts
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              Feature
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              List sorting
            </td>
            <td>
              Basic
            </td>
            <td>
              Advanced
            </td>
          </tr>

          <tr>
            <td>
              Multiple list views
            </td>
            <td>
              Basic
            </td>
            <td>
              Multiple
            </td>
          </tr>

          <tr>
            <td>
              Import/Export
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              Public profile
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>Shared feature</td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>

          <tr>
            <td>
              Customer support
            </td>
            <td>
              <i class="fa-solid fa-times text-muted" />
            </td>
            <td>
              <i class="fa-solid fa-check text-success" />
            </td>
          </tr>
        </tbody>
      </table>

      <b-button size="lg" variant="success" @click="checkout">
        Go Pro!
      </b-button>
    </b-card>

    <b-alert show class="mt-3">
      Students and Developers get Pro for free!
    </b-alert>

    <b-alert show class="mt-3">
      F.A.Q.

      NO REFUNDS
      We use stripe for payments

    </b-alert>
  </b-container>
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
      planSelected: 'monthly',
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
      return this.planSelected === 'yearly'
        ? [this.yearlyPlan]
        : [this.monthlyPlan];
    },

    pricingLabel() {
      return this.planSelected === 'yearly'
        ? '/year'
        : '/month';
    },

    amountToPay() {
      return this.planSelected === 'yearly'
        ? '50'
        : '5';
    },
  },

  methods: {
    load(value) {
      this.loading = value;
    },

    checkout() {
      this.$refs.checkoutRef.redirectToCheckout();
    }
  },
};
</script>
