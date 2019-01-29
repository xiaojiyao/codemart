const role = {
  state: {
    role: false
  },

  mutations: {
    SET_ROLE: (state, role) => {
      state.role = role
    }
  },

  actions: {
    // 登录
    setRole({
      commit
    }, role) {
      commit('SET_ROLE', role)
    },
  }
}

export default role
