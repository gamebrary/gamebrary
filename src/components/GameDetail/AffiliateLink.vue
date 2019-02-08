<template lang="html">
    <div class="amazon">
        <a
            v-if="affiliateLinks[game.id]"
            :href="affiliateLinks[game.id]"
            target="_blank"
            class="link warning small"
        >
            <i class="fab fa-amazon"></i>
            Buy on Amazon
        </a>

        <small>
            Buy <strong>{{ game.name }}</strong> using this affiliate
            link to support the ongoing development of <strong>Gamebrary</strong>.
        </small>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            affiliateLinks: {
                25076: 'https://www.amazon.com/gp/product/B01M5DZ525/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01M5DZ525&linkCode=as2&tag=gamebrary-20&linkId=eebf6bebe3b3c40e9037df82a9c739b2',
                1020: 'https://www.amazon.com/gp/product/B00KVSQ848/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B00KVSQ848&linkId=5531dceef24e8525579dd7d595fe6b34',
                19565: 'https://www.amazon.com/gp/product/B01GW8YDLK/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B01GW8YDLK&linkId=1c1d07437257541efddde63a1feae6ea',
                96209: 'https://www.amazon.com/gp/product/B07DL2SY2B/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B07DL2SY2B&linkId=0dabbea30bba72441ffa9de34045ed4a',
                19560: 'https://www.amazon.com/gp/product/B01GW8XOY2/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B01GW8XOY2&linkId=d17ddb750a05bc64874e0005993fe32e',
                6036: 'https://www.amazon.com/gp/product/B00JK00S0S/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B00JK00S0S&linkId=1bda795fa94cee2377f1949695b5a603',
                14362: 'https://www.amazon.com/gp/product/B01GW8XTXS/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B01GW8XTXS&linkId=42e700761c62f0451a37f097949c7d76',
                18150: 'https://www.amazon.com/gp/product/B01BLE1CA0/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B01BLE1CA0&linkId=982ad57b479db2ec2d48ad04395c11bc',
                54996: 'https://www.amazon.com/gp/product/B07CCBRLJR/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B07CCBRLJR&linkId=de39a38031fbb45199cb91e45f6a80e4',
                11156: 'https://www.amazon.com/gp/product/B00ZQC73O8/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B00ZQC73O8&linkId=18215811589c314c4fc767c8cc099a32',
                121: 'https://www.amazon.com/gp/product/B00NXSRP72/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B00NXSRP72&linkId=134fd690c0200cf082a34df37cc93762',
                14363: 'https://www.amazon.com/gp/product/B01FT72NOO/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=gamebrary-20&creative=9325&linkCode=as2&creativeASIN=B01FT72NOO&linkId=cb8d066db8b56467c7832364fabe9695',
            },
        };
    },

    computed: {
        ...mapState(['game']),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

.amazon {
    display: grid;
    grid-template-columns: auto auto;
    margin-top: $gp;
    grid-gap: $gp;

    a.link {
        color: $color-darkest-gray;
        align-items: center;
        display: grid;
        grid-template-columns: 10px auto;
        grid-gap: $gp / 2;
    }
}
</style>
