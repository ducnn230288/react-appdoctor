export default ({fetchMock, delay, mock, toSuccess, toError}) => {
  return {
    // organization
    '/api/tree/getDept': (options) => {
      return toSuccess([
        {
          title: 'Manager',
          key: '0-0',
          children: [
            {
              title: 'Technical director',
              key: '0-0-0',
              children: [
                { title: 'Production department', key: '0-0-0-0' },
                { title: 'R&D department', key: '0-0-0-1' },
                { title: 'Testing Division', key: '0-0-0-2' },
              ],
            },
            {
              title: 'Director of Sales',
              key: '0-0-1',
              children: [
                { title: 'Order Management Department', key: '0-0-1-0' },
                { title: 'Blowing water training center', key: '0-0-1-1' },
                { title: 'Branch office', key: '0-0-1-2' },
              ],
            },
            {
              title: 'Financial director',
              key: '0-0-2',
            }
          ],
        },
        {
          title: 'Manager wife',
          key: '0-1',
          children: [
            { title: 'Driver Xiao Liu', key: '0-1-0-0' },
            { title: 'Driver Xiao Chen', key: '0-1-0-1' },
            { title: 'Driver pony', key: '0-1-0-2' },
          ],
        },
        {
          title: 'Next door',
          key: '0-2',
        }
      ], 400)
    },
    // Asynchronous tree
    '/api/tree/getAsyncData': ({ key = "0"}) => {
      return toSuccess([
        {
          title: 'Child 0' + key,
          key: '0' + key,
        },
        {
          title: 'Child 1' + key,
          key: '1' + key,
        },
        {
          title: 'Child 2' + key,
          key: '2' + key,
          isLeaf: true,
        }
      ], 400)
    },
    '/api/tree/getAsyncSearchData': ({ search = "0" }) => {
      return toSuccess([
        {
          title: `Child 2${search}`,
          key: `2${search}`,
        }
      ], 400)
    },
    // Asynchronous select tree
    '/api/tree/getCustomAsyncData': ({ key = "0"}) => {
      return toSuccess(mock([
        {
          title: '@city(true)',
          key: '0' + key,
        },
        {
          title: '@name',
          key: '1' + key,
          isLeaf: true,
          gender: Math.random() > 0.5 ? 1 : 0
        },
        {
          title: '@name',
          key: '2' + key,
          isLeaf: true,
          gender: Math.random() > 0.5 ? 1 : 0
        }
      ]), 400)
    },
    '/api/tree/getCustomAsyncSearchData': (options) => {
      let title = '0';
      if (options.body) {
        const data = JSON.parse(options.body);
        title = data.search;
      }
      return toSuccess([
        {
          title: `Child 2${title}`,
          key: `2${title}`,
        }
      ], 400)
    },
    // Asynchronous select tree
    '/api/tree/getAsyncTreeSelect': ({ key = 0 }) => {
      return toSuccess([
        {
          title: 'Child 0' + key,
          value: '0' + key,
          key: '0' + key,
        },
        {
          title: 'Child 1' + key,
          value: '1' + key,
          key: '1' + key,
        },
        {
          title: 'Child 2' + key,
          value: '2' + key,
          key: '2' + key,
          isLeaf: true,
        }
      ], 400)
    },
  }
}