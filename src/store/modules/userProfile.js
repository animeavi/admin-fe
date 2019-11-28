import { fetchUser, fetchUserStatuses } from '@/api/users'

const userProfile = {
  state: {
    statuses: [],
    statusesLoading: true,
    user: {},
    userProfileLoading: true
  },
  mutations: {
    SET_STATUSES: (state, statuses) => {
      state.statuses = statuses
    },
    SET_STATUSES_LOADING: (state, status) => {
      state.statusesLoading = status
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_USER_PROFILE_LOADING: (state, status) => {
      state.userProfileLoading = status
    }
  },
  actions: {
    async FetchUserProfile({ commit, dispatch, getters }, { userId, godmode }) {
      commit('SET_USER_PROFILE_LOADING', true)

      const userResponse = await fetchUser(userId, getters.authHost, getters.token)
      commit('SET_USER', userResponse.data)
      commit('SET_USER_PROFILE_LOADING', false)

      dispatch('FetchUserStatuses', { userId, godmode })
    },
    async FetchUserStatuses({ commit, getters }, { userId, godmode }) {
      commit('SET_STATUSES_LOADING', true)

      const statuses = await fetchUserStatuses(userId, getters.authHost, godmode, getters.token)

      commit('SET_STATUSES', statuses.data)
      commit('SET_STATUSES_LOADING', false)
    }
  }
}

export default userProfile
