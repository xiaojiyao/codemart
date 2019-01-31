const state = {
  user: {}
}

const mutations = {
  getUserInfo(state) {
    if (sessionStorage.getItem('user')) {
      state.user = JSON.parse(sessionStorage.getItem('user'))
    }
  },
  setUserInfo(state, user) {
    state.user = user;
    sessionStorage.setItem('user', JSON.stringify(user));
  },
  logout(state, user) {
    state.user = {};
    sessionStorage.removeItem('user');
  }
}

const actions = {
  login({
    commit
  }, user) {
    commit('setUserInfo', user)
  },
  logout({
    commit
  }) {
    commit('logout')
  },
  getUserInfo({
    commit
  }) {
    commit('getUserInfo')
  }
}

export default {
  state,
  mutations,
  actions
}
