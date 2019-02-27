import { fetchUsers, toggleUserActivation } from '@/api/users'

const user = {
  state: {
    fetchedUsers: [],
    loading: true
  },
  mutations: {
    SET_USERS: (state, users) => {
      state.fetchedUsers = users.sort((a, b) => a.id.localeCompare(b.id))
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SWAP_USER: (state, user) => {
      const usersWithoutSwapped = state.fetchedUsers.filter((u) => {
        return u.id !== user.id
      })

      state.fetchedUsers = [...usersWithoutSwapped, user].sort((a, b) => a.id.localeCompare(b.id))
    },
    SET_COUNT: (state, count) => {
      state.totalUsersCount = count
    },
    SET_PAGE_SIZE: (state, pageSize) => {
      state.pageSize = pageSize
    }
  },
  actions: {
    async FetchUsers({ commit }, page = 1) {
      const response = await fetchUsers(page)

      commit('SET_USERS', response.data.users)
      commit('SET_COUNT', response.data.count)
      commit('SET_PAGE_SIZE', response.data.page_size)
      commit('SET_LOADING', false)
    },
    async ToggleUserActivation({ commit }, nickname) {
      const response = await toggleUserActivation(nickname)

      commit('SWAP_USER', response.data)
    }
  }
}

export default user
