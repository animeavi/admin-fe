import {
  addRight,
  createNewAccount,
  deleteRight,
  deleteUser,
  fetchUsers,
  getPasswordResetToken,
  searchUsers,
  tagUser,
  toggleUserActivation,
  untagUser,
  requirePasswordReset
} from '@/api/users'

const users = {
  state: {
    fetchedUsers: [],
    loading: true,
    searchQuery: '',
    totalUsersCount: 0,
    currentPage: 1,
    filters: {
      local: false,
      external: false,
      active: false,
      deactivated: false
    },
    passwordResetToken: {
      token: '',
      link: ''
    }
  },
  mutations: {
    SET_USERS: (state, users) => {
      state.fetchedUsers = users
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SWAP_USER: (state, updatedUser) => {
      const updated = state.fetchedUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
      state.fetchedUsers = updated
        .map(user => user.nickname ? user : { ...user, nickname: '' })
        .sort((a, b) => a.nickname.localeCompare(b.nickname))
    },
    SWAP_USERS: (state, users) => {
      const usersWithoutSwapped = users.reduce((acc, user) => {
        return acc.filter(u => u.id !== user.id)
      }, state.fetchedUsers)

      state.fetchedUsers = [...usersWithoutSwapped, ...users].sort((a, b) =>
        a.nickname.localeCompare(b.nickname)
      )
    },
    SET_COUNT: (state, count) => {
      state.totalUsersCount = count
    },
    SET_PAGE: (state, page) => {
      state.currentPage = page
    },
    SET_PAGE_SIZE: (state, pageSize) => {
      state.pageSize = pageSize
    },
    SET_PASSWORD_RESET_TOKEN: (state, { token, link }) => {
      state.passwordResetToken.token = token
      state.passwordResetToken.link = link
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    },
    SET_USERS_FILTERS: (state, filters) => {
      state.filters = filters
    },
    SET_USER_PROFILE: (state, user) => {
      state.userProfile = user
    }
  },
  actions: {
    async AddTag({ commit, getters }, { users, tag }) {
      const nicknames = users.map(user => user.nickname)
      await tagUser(nicknames, [tag], getters.authHost, getters.token)

      commit('SWAP_USERS', users.map(user => ({ ...user, tags: [...user.tags, tag] })))
    },
    async ClearFilters({ commit, dispatch, state }) {
      commit('CLEAR_USERS_FILTERS')
      dispatch('SearchUsers', { query: state.searchQuery, page: 1 })
    },
    async CreateNewAccount({ dispatch, getters, state }, { nickname, email, password }) {
      await createNewAccount(nickname, email, password, getters.authHost, getters.token)
      dispatch('FetchUsers', { page: state.currentPage })
    },
    async DeleteUser({ commit, getters, state }, user) {
      const { data } = await deleteUser(user.nickname, getters.authHost, getters.token)
      const users = state.fetchedUsers.filter(user => user.nickname !== data)
      commit('SET_USERS', users)
    },
    async RequirePasswordReset({ commit, getters, state }, user) {
      await requirePasswordReset(user.nickname, getters.authHost, getters.token)
    },
    async FetchUsers({ commit, state, getters, dispatch }, { page }) {
      commit('SET_LOADING', true)
      const filters = Object.keys(state.filters).filter(filter => state.filters[filter]).join()
      const response = await fetchUsers(filters, getters.authHost, getters.token, page)
      await dispatch('GetNodeInfo')
      loadUsers(commit, page, response.data)
    },
    async GetPasswordResetToken({ commit, state, getters }, nickname) {
      const { data } = await getPasswordResetToken(nickname, getters.authHost, getters.token)
      commit('SET_PASSWORD_RESET_TOKEN', data)
    },
    RemovePasswordToken({ commit }) {
      commit('SET_PASSWORD_RESET_TOKEN', { link: '', token: '' })
    },
    async RemoveTag({ commit, getters }, { users, tag }) {
      const nicknames = users.map(user => user.nickname)
      await untagUser(nicknames, [tag], getters.authHost, getters.token)

      commit('SWAP_USERS', users.map(user => ({ ...user, tags: user.tags.filter(userTag => userTag !== tag) })))
    },
    async SearchUsers({ commit, dispatch, state, getters }, { query, page }) {
      if (query.length === 0) {
        commit('SET_SEARCH_QUERY', query)
        dispatch('FetchUsers', { page })
      } else {
        commit('SET_LOADING', true)
        commit('SET_SEARCH_QUERY', query)

        const filters = Object.keys(state.filters).filter(filter => state.filters[filter]).join()
        const response = await searchUsers(query, filters, getters.authHost, getters.token, page)

        loadUsers(commit, page, response.data)
      }
    },
    async ToggleUserActivation({ commit, getters }, nickname) {
      const { data } = await toggleUserActivation(nickname, getters.authHost, getters.token)
      commit('SWAP_USER', data)
    },
    async ToggleUsersFilter({ commit, dispatch, state }, filters) {
      const defaultFilters = {
        local: false,
        external: false,
        active: false,
        deactivated: false
      }
      const currentFilters = { ...defaultFilters, ...filters }
      commit('SET_USERS_FILTERS', currentFilters)
      dispatch('SearchUsers', { query: state.searchQuery, page: 1 })
    },
    async ToggleRight({ commit, getters }, { user, right }) {
      user.roles[right]
        ? await deleteRight(user.nickname, right, getters.authHost, getters.token)
        : await addRight(user.nickname, right, getters.authHost, getters.token)

      const updatedUser = { ...user, roles: { ...user.roles, [right]: !user.roles[right] }}
      commit('SWAP_USER', updatedUser)
    }
  }
}

const loadUsers = (commit, page, { users, count, page_size }) => {
  commit('SET_USERS', users)
  commit('SET_COUNT', count)
  commit('SET_PAGE', page)
  commit('SET_PAGE_SIZE', page_size)
  commit('SET_LOADING', false)
}

export default users
