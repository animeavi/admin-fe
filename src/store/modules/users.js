import { fetchUsers } from '@/api/users'

const user = {
  state: {
    fetchedUsers: []
  },
  mutations: {
    SET_USERS: (state, users) => {
      state.fetchedUsers = users
    }
  },
  actions: {
    async FetchUsers({ commit }) {
      const response = await fetchUsers()

      commit('SET_USERS', response.data)
    }
  }
}

export default user
