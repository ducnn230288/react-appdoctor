import intl from 'react-intl-universal';
import $$ from 'cmn-utils';

import modelEnhance from '@/utils/modelEnhance';
import routerLinks from "@/utils/routerLinks";

import homeImg from 'assets/images/home.svg';
import requestImg from 'assets/images/request.svg';
import purchaseImg from 'assets/images/purchase.svg';
import approveImg from 'assets/images/approve.svg';
import statusImg from 'assets/images/status.svg';

import historyImg from 'assets/images/history.svg';
import history2Img from 'assets/images/history-2.svg';
import user2Img from 'assets/images/user-2.svg';
import logoutImg from 'assets/images/logout.svg';

import messages from './messages';

export default modelEnhance({
  namespace: 'global',

  state: {
    menu: [],
    flatMenu: [],
    locale: $$.getStore('language', "en"),
  },

  effects: {
    *getMenu({payload}, { put }) {
      const data = [
        { name: "대시보드", icon: homeImg, path: routerLinks("Dashboard"),},
        { name: "문의/요청", icon: requestImg, path: '/',},
        { name: "서비스 구매", icon: purchaseImg, path: routerLinks("Purchase"),},
        { name: "승인하기", icon: approveImg, path: '/2',},
        { name: "요청현황", icon: statusImg, path: '/3',},

        { name: "주문내역 조회", icon: historyImg, path: '/4', style: { marginTop: "100px",}},
        { name: "결제내역 조회", icon: history2Img, path: '/5',},
        { name: "정보 수정", icon: user2Img, path: '/6',},
        { name: "정보 수정", icon: logoutImg, path: routerLinks("Login"),},,
        // 💬 generate link to here
      ];

      const loopMenu = (menu, pitem = {}) => {
        menu.forEach(item => {
          if (pitem.path) {
            item.parentPath = pitem.parentPath ? pitem.parentPath.concat(pitem.path) : [pitem.path];
          }
          if (item.children && item.children.length) {
            loopMenu(item.children, item);
          }
        });
      }
      loopMenu(data);

      yield put({
        type: 'getMenuSuccess',
        payload: data,
      });
    },
    *setLocale({payload}, {put}) {
      yield put({
        type: 'setLocaleSuccess',
        payload,
      });
    }
  },

  reducers: {
    getMenuSuccess(state, { payload }) {
      return {
        ...state,
        menu: payload,
        flatMenu: getFlatMenu(payload),
      };
    },
    setLocaleSuccess(state, { payload }) {
      $$.setStore('language', payload);
      return {
        ...state,
        locale: payload,
      };
    },
  },
});

export function getFlatMenu(menus) {
  let menu = [];
  menus.forEach(item => {
    if (item.children) {
      menu = menu.concat(getFlatMenu(item.children));
    }
    menu.push(item);
  });
  return menu;
}
