<template lang="html">
    <div>
        <bar :labels="labels" :datasets="datasets" v-if="type === 'bar'" />
        <line-chart :labels="labels" :datasets="datasets" v-if="type === 'line'" />
        <doughnut :labels="labels" :datasets="datasets" v-if="type === 'line'" />
        <pie :labels="labels" :datasets="datasets" v-if="type === 'line'" />
        <radar :labels="labels" :datasets="datasets" v-if="type === 'line'" />
        <polar-area :labels="labels" :datasets="datasets" v-if="type === 'line'" />
        <bubble :labels="labels" :datasets="datasets" v-if="type === 'line'" />
        <scatter :labels="labels" :datasets="datasets" v-if="type === 'line'" />
    </div>
</template>

<script>
import Bar from '@/components/Chart/Charts/Bar';
import LineChart from '@/components/Chart/Charts/LineChart';
import Doughnut from '@/components/Chart/Charts/Doughnut';
import Pie from '@/components/Chart/Charts/Pie';
import Radar from '@/components/Chart/Charts/Radar';
import PolarArea from '@/components/Chart/Charts/PolarArea';
import Bubble from '@/components/Chart/Charts/Bubble';
import Scatter from '@/components/Chart/Charts/Scatter';

export default {
    components: {
        Bar,
        LineChart,
        Doughnut,
        Pie,
        Radar,
        PolarArea,
        Bubble,
        Scatter,
    },
    props: {
        type: String,
        labels: Array,
        datasets: Array,
    },
};
</script>
