<template lang="html">
    <div>
        <div class="game-detail">
            <div class="game-hero" />

            <div class="game-detail-container">
                <div class="game-info">
                    <placeholder image large />

                    <div>
                        <placeholder :lines="1" large class="title" />
                        <placeholder :lines="5" class="description" />
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Placeholder from '@/components/Placeholder/Placeholder';

export default {
    components: {
        Placeholder,
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

.game-detail {
    display: flex;
    justify-content: center;
    background: $color-light-gray;
    min-height: calc(100vh - #{$navHeight});

    @media($small) {
        margin: 0;
    }

    &.dark {
        .game-detail-container {
            background: #333;
            color: $color-gray;
        }
    }
}

.game-hero {
    background-color: $color-dark-gray;
    position: absolute;
    width: 100%;
    left: 0;
    height: 400px;
    z-index: 1;

    @media($small) {
        background: none !important;
    }
}

.game-info {
    display: grid;
    grid-template-columns: 180px auto;
    grid-gap: $gp * 2;
    margin: 0 $gp;

    @media($small) {
        grid-gap: 0;
        grid-template-columns: 1fr;
        text-align: center;

        .game-description {
            text-align: justify;
        }
    }

    .game-description {
        line-height: 1.4rem;
    }
}

.game-detail-container {
    background-color: rgba(255, 255, 255, 0.95);
    -webkit-box-shadow: 0 0 2px 0 $color-gray;
    box-shadow: 0 0 2px 0 $color-gray;
    width: $container-width;
    max-width: 100%;
    z-index: 1;
    margin: 100px;
    padding: $gp 0;
    border-radius: $border-radius;

    .title {
        width: 50%;
    }

    .description {
        width: 75%;
    }

    @media($small) {
        margin: 0;
        border-radius: 0;
    }
}
</style>
