export default {
    namespaced: true,
    state: {
        loggedIn: localStorage.getItem('logged_in') || false,
        token: localStorage.getItem('access_token') || null,
    },
    getters: {
        loggedIn: state => state.loggedIn,
    },
    mutations: {
        login(state, loggedInInfo) {
            state.loggedIn = true
            state.token = loggedInInfo.access_token
            localStorage.setItem('access_token', state.token)
            localStorage.setItem('logged_in', true)
          },
          logout(state, loggedOutInfo) {
            state.loggedIn = false
            state.token = null
            localStorage.removeItem('access_token')
            localStorage.removeItem('logged_in')
          },
    },
    actions: {
          async login(context, form) {
            const {data:loggedInInfo} = await axios.post('/login', {
                'email': form.email,
                'password': form.password,
            })
            context.commit('login', loggedInInfo)
          },
          async register(context, form) {
            const {data:loggedInInfo} = await axios.post('/register', {
                'name': form.name,
                'email': form.email,
                'password': form.password,
                'confirmed': form.confirmed
            })
            context.commit('login', loggedInInfo)
          },
          async logout(context) {
            const {data:loggedOutInfo} = await axios.post('/logout')
            context.commit('logout', loggedOutInfo)
          },
    },
}