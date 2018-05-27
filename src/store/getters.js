export default {
    auth: state => Boolean(state.token && state.user),
};
