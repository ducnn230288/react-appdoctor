export default (name, type) => {
  const types = {
    curd: "?pageNum=1&pageSize=10&filters={}&sorts={}"
  }
  const array = {
    Register: '/auth/register',
    Login: '/auth/login',
    Pages403: '/403',
    Pages404: '/404',
    Pages500: '/500',
    BusinessCRUD: '/crud',
    Home: '/home',
    Dashboard: '/dashboard',
    Purchase: '/purchase'
  }// 💬 generate link to here

  switch(type) {
    case "curd": 
      return array[name] + types[type]
    default: 
      return array[name];
  }
};
