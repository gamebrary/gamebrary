export default {
    data() {
        return {
            timer: 1500,
        };
    },

    methods: {
        $error(title) {
            this.$swal({
                title,
                toast: true,
                timer: this.timer,
                position: 'bottom-end',
                type: 'error',
                showConfirmButton: false,
            });
        },

        $success(title) {
            this.$swal({
                position: 'bottom-end',
                title,
                type: 'success',
                toast: true,
                showConfirmButton: false,
                timer: this.timer,
            });
        },
    },
};
