import { fetchUsers, toggleUserActivation, searchUsers } from '@/api/users'

const user = {
  state: {
    fetchedUsers: [],
    loading: true,
    searchQuery: '',
    totalUsersCount: 0,
    pageSize: 2
  },
  mutations: {
    SET_USERS: (state, users) => {
      state.fetchedUsers = users
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SWAP_USER: (state, user) => {
      const usersWithoutSwapped = state.fetchedUsers.filter(u => {
        return u.id !== user.id
      })

      state.fetchedUsers = [...usersWithoutSwapped, user].sort((a, b) =>
        a.id.localeCompare(b.id)
      )
    },
    SET_COUNT: (state, count) => {
      state.totalUsersCount = count
    },
    SET_PAGE_SIZE: (state, pageSize) => {
      state.pageSize = pageSize
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    }
  },
  actions: {
    async FetchUsers({ commit }, { page, page_size }) {
      const response = await fetchUsers(page, page_size)

      commit('SET_LOADING', true)

      loadUsers(commit, response.data)
    },
    async ToggleUserActivation({ commit }, nickname) {
      const response = await toggleUserActivation(nickname)

      commit('SWAP_USER', response.data)
    },
    async SearchUsers({ commit, dispatch }, { query, page, page_size }) {
      if (query.length === 0) {
        // console.log(page)
        // console.log(query)
        // console.log(page_size)
        commit('SET_SEARCH_QUERY', query)
        dispatch('FetchUsers', { page, page_size: 2 })
      } else {
        commit('SET_LOADING', true)
        commit('SET_SEARCH_QUERY', query)

        const response = await searchUsers(query, page, page_size)

        loadUsers(commit, response.data)
      }
    }
  }
}

const loadUsers = (commit, { users, count, page_size }) => {
  commit('SET_USERS', users)
  commit('SET_COUNT', count)
  commit('SET_PAGE_SIZE', page_size)
  commit('SET_LOADING', false)
}

export default user
