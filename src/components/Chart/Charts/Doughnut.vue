<script>
import { Doughnut } from 'vue-chartjs';

export default {
    extends: Doughnut,

    props: {
        labels: Array,
        datasets: Array,
    },

    data() {
        return {
            settings: {
                responsive: true,
                maintainAspectRatio: false,
            },
        };
    },

    mounted() {
        const { labels, datasets } = this;

        if (labels && datasets) {
            this.renderChart({
                labels,
                datasets,
            }, this.settings);
        }
    },
};
</script>
