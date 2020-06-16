import { routerRedux } from 'dva';
import $$ from 'cmn-utils';

import routerLinks from "@/utils/routerLinks";
import { login_User } from '../service';

export default {
  namespace: 'login',

  state: {
    loggedIn: false,
    message: '',
    user: {}
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname.indexOf(routerLinks("Login")) !== -1) {
          $$.removeStore('user');
        }
      });
    }
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const { status, message, data } = yield call(login_User, payload);
        if (status) {
          $$.setStore('user', data);
          yield put(routerRedux.replace('/'));
        } else {
          yield put({
            type: 'loginError',
            payload: { message }
          });
        }
      } catch (e) {
        console.log(e)
        yield put({
          type: 'loginError'
        });
      }
    },
    *logout(_, { put }) {}
  },

  reducers: {
    loginSuccess(state, { payload }) {
      return {
        ...state,
        loggedIn: true,
        message: '',
        user: payload
      };
    },
    loginError(state, { payload }) {
      return {
        ...state,
        loggedIn: false,
        message: payload.message
      };
    }
  }
};
