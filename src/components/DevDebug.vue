<template lang="html">
    <div class="dev-debug">
        <section>
            <h2>Buttons</h2>
            <h3>Sizes</h3>

            <section>
                <button class="xsmall primary">xsmall</button>
                <button class="small primary">small</button>
                <button class="default primary">default</button>
                <button class="large primary">large</button>
                <button class="xlarge primary">xlarge</button>
            </section>

            <h3>Styles</h3>

            <section>
                <button class="small">default</button>
                <button class="small primary">primary</button>
                <button class="small success">success</button>
                <button class="small accent">accent</button>
                <button class="small info">info</button>
                <button class="small error">error</button>
                <button class="small warning">warning</button>
            </section>
        </section>

        <section>
            <h2>Tag</h2>

            <tag
                label="my tag"
                hex="#ff00cc"
            />

            <tag
                label="my tag"
                hex="#333333"
            />
        </section>
    </div>
</template>

<script>
import Tag from '@/components/Tag';

export default {
    components: {
        Tag,
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles";

.dev-debug {
    width: 400px;
    flex-shrink: 0;
    padding-right: $gp;
    border-radius: $border-radius;
    color: $color-light-gray;
}

section {
    background: $color-gray;
    padding: $gp / 2;
}
</style>
