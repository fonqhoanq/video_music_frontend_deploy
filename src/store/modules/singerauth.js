import axios from "axios";

const BASE_URL = "https://vuratubeapi.store/";

const state = {
  singer_auth_token: localStorage.getItem("singer_auth_token"),
  singer: {
    id: localStorage.getItem("id"),
    channelName: localStorage.getItem("channelName"),
    email: localStorage.getItem("email"),
    age: localStorage.getItem("age"),
    avatarUrl: localStorage.getItem("avatarUrl")
  },
  base_url: "https://vuratubeapi.store/"
};
const getters = {
  getSingerAuthToken(state) {
    return state.singer_auth_token;
  },
  getSingerEmail(state) {
    return state.singer?.email;
  },
  getSingerID(state) {
    return state.singer?.id;
  },
  isSingerLoggedIn(state) {
    const loggedOut =
      state.singer_auth_token == null || state.singer_auth_token == JSON.stringify(null);
    return !loggedOut;
  },
  getCurrentSinger(state) {
    return state.singer
  },
  getUrl(state) {
    return state.base_url
  }
};
const actions = {
  registerSinger({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${BASE_URL}singers`, payload)
        .then((response) => {
          commit("setSingerInfo", response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  loginSinger({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${BASE_URL}singers/sign_in`, payload)
        .then((response) => {
          commit("setSingerInfo", response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  logoutSinger({ commit }) {
    const config = {
      headers: {
        authorization: state.singer_auth_token,
      },
    };
    new Promise((resolve, reject) => {
      axios
        .delete(`${BASE_URL}singers/sign_out`, config)
        .then(() => {
          commit("resetSingerInfo");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  loginSingerWithToken({ commit }, payload) {
    const config = {
      headers: {
        Authorization: payload.singer_auth_token,
      },
    };
    new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}member-data`, config)
        .then((response) => {
          commit("setSingerInfoFromToken", response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updateSingerInfor(context, payload ) {
    context.commit("setSingerInfors", payload);
  }
};
const mutations = {
  setSingerInfors(state, data) {
    state.singer = data
  },
  setSingerInfo(state, data) {
    console.log(data);
    console.log(data.data.id);
    state.singer = {
      id: data.data.id,
      channelName: data.data.channelName,
      email: data.data.email,
      age: data.data.age,
      avatarUrl: data.data.avatarUrl
    }
    localStorage.setItem("id", data.data.id);
    localStorage.setItem("channelName", data.data.channelName);
    localStorage.setItem("email", data.data.email);
    localStorage.setItem("age", data.data.age);
    localStorage.setItem("avatarUrl", data.data.avatarUrl);
    console.log(localStorage.getItem("id"));
    console.log(localStorage.getItem("avatarUrl"));
    console.log(state.singer.age);
    state.singer_auth_token = data.headers.authorization;
    axios.defaults.headers.common["Authorization"] = data.headers.authorization;
    localStorage.setItem("singer_auth_token", data.headers.authorization);
  },
  setSingerInfoFromToken(state, data) {
    state.singer = data.data.singer;
    state.singer_auth_token = localStorage.getItem("singer_auth_token");
  },
  resetSingerInfo(state) {
    state.singer = {
      id: null,
      channelName: null,
      email: null,
      avatarUrl: null,
      age: null
    };
    state.singer_auth_token = null;
    localStorage.removeItem("singer_auth_token");
    localStorage.removeItem("id");
    localStorage.removeItem("channelName");
    localStorage.removeItem("email");
    localStorage.removeItem("age");
    localStorage.removeItem("avatarUrl");
    axios.defaults.headers.common["Authorization"] = null;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
