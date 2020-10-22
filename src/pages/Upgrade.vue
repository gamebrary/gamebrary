<template lang="html">
  <div>
    <b-jumbotron
      :header="$t('upgrade.title')"
      :lead="$t('upgrade.subtitle')"
      :bg-variant="nightMode ? 'dark' : ''"
      :text-variant="nightMode ? 'white' : ''"
      :border-variant="nightMode ? 'dark' : ''"
      header-level="5"
      fluid
    />

    <b-container>
      <table class="table table-striped text-center">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Standard</th>
            <th scope="col">Pro</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td class="text-right">Boards</td>
            <td>3</td>
            <td>Unlimited</td>
          </tr>

          <tr>
            <td class="text-right">Tags</td>
            <td>10</td>
            <td>Unlimited</td>
          </tr>

          <tr>
            <td class="text-right">Filters</td>
            <td>
              <icon name="x" />
            </td>

            <td>
              Board filters
              Filter by Tags, Progress, Notes
            </td>
          </tr>

          <tr>
            <td class="text-right">Search</td>
            <td>
              <icon name="x" />
            </td>

            <td>
              Search notes
            </td>
          </tr>

          <tr>
            <td class="text-right">Deal alerts</td>
            <td>
              In app only
            </td>

            <td>
              In app + via email
            </td>
          </tr>

          <tr>
            <td class="text-right">Notes</td>
            <td>
              Basic
            </td>

            <td>
              Advanced:

              Notes dashboard, search, rich text, upload images, etc...

            </td>
          </tr>

          <tr>
            <td class="text-right">Custom boards</td>
            <td><icon name="x" /></td>
            <td>Custom wallpaper</td>
          </tr>

          <tr>
            <td class="text-right">Public profile</td>
            <td><icon name="x" /></td>
            <td>
              <icon name="check" />
              Claim your profile
            </td>
          </tr>

          <tr>
            <td class="text-right">List sorting</td>
            <td>Manual</td>
            <td>Automatic</td>
          </tr>

          <tr>
            <td class="text-right">Public profile</td>
            <td><icon name="x" /></td>
            <td>
              <icon name="check" />
              Claim your profile
            </td>
          </tr>

          <tr>
            <td class="text-right">Public profile</td>
            <td>
              Basic
            </td>
            <td>
              <icon name="check" />
              Advanced:

              Claim your profile
              custom url
            </td>
          </tr>

          <tr>
            <td class="text-right">STEAM INTEGRATION</td>
            <td>
              x
            </td>
            <td>
              <icon name="check" />
            </td>
          </tr>

          <tr>
            <td class="text-right">Game Watch (add game to db
              , cron querys db and emails results, logs data)</td>
            <td>
              x
            </td>
            <td>
              <icon name="check" />
            </td>
          </tr>

          <tr>
            <td class="text-right">CSV Import / Export</td>
            <td>
              x
            </td>
            <td>
              <icon name="check" />
            </td>
          </tr>

          <tr>
            <td class="text-right">Track game progress</td>
            <td><icon name="x" /></td>
            <td><icon name="check" /></td>
          </tr>

          <tr>
            <td class="text-right"></td>
            <td>
              Free
            </td>
            <td>
              $4/Mo or $40/yr (save 2 months)
            </td>
          </tr>
        </tbody>
      </table>

      <b-button variant="success" size="lg">
        Upgrade
      </b-button>

      <div class="text-center mt-4">
        <h2>GamePro enhances your all-in-one Discord voice, video, and text chat.</h2>
        <p class="lead">Check out the perks you'll get.</p>


        <b-row class="text-center">
          <b-col cols="4">
            <b-card
              title="Feature"
              img-src="https://picsum.photos/600/200/?image=1"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2"
            >
              <b-card-text>
                Some quick example text to build on the card title
                and make up the bulk of the card's content.
              </b-card-text>
            </b-card>
          </b-col>

          <b-col cols="4">
            <b-card
              title="Feature"
              img-src="https://picsum.photos/600/200/?image=1"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2"
            >
              <b-card-text>
                Some quick example text to build on the card title
                and make up the bulk of the card's content.
              </b-card-text>
            </b-card>
          </b-col>

          <b-col cols="4">
            <b-card
              title="Feature"
              img-src="https://picsum.photos/600/200/?image=1"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2"
            >
              <b-card-text>
                Some quick example text to build on the card
                itle and make up the bulk of the card's content.
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
      </div>

    </b-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['nightMode']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
