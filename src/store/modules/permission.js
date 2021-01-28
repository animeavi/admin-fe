import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ADD_ROUTERS: (state, routers) => {
      state.addRouters = routers
    },
    SET_ROUTERS: (state, routers) => {
      state.routers = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, { roles, routes }) {
      return new Promise(resolve => {
        if (!routes) {
          let accessedRouters
          if (roles.includes('admin')) {
            accessedRouters = asyncRouterMap
          } else {
            accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
          }
          commit('SET_ADD_ROUTERS', accessedRouters)
          commit('SET_ROUTERS', constantRouterMap.concat(accessedRouters))
          resolve()
        } else {
          const updRoutes = routes.reduce((acc, element) => {
            if (acc.findIndex(route => route.path === element.path) !== -1) {
              return acc
            } else if (element.parent) {
              const index = acc.findIndex(route => route.path === element.parent.path)
              if (index > -1) {
                const children = acc[index].children ? [...acc[index].children, element] : [element]
                acc[index] = { ...acc[index], children }
                return acc
              } else {
                const newRoute = { ...element.parent, children: [element] }
                return [...acc, newRoute]
              }
            } else {
              return [...acc, element]
            }
          }, [])

          commit('SET_ROUTERS', updRoutes)
          resolve()
        }
      })
    }
  }
}

export default permission
