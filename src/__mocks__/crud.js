/**
 * Simulate CRUD data
 */
export default ({fetchMock, delay, mock, toSuccess, toError}) => {
  return {
    // Table with pagination
    '/api/crud/getList': ({currentPage, paramMap, showCount}) => {
      const idbase = (currentPage - 1) * 10 + 1;
      const {deptName} = paramMap;

      if (deptName === 'abcd') {
        return toSuccess(mock({
          'currentPage': currentPage,
          'showCount': showCount,
          'totalResult': 0,
          'totalPage': 0,
          dataList: [],
        }), 400)
      }

      return toSuccess(mock({
        'currentPage': currentPage,
        'showCount': showCount,
        'totalResult': 100,
        'totalPage': 10,
        [`dataList|${showCount}`]: [{
          'id|+1': idbase,
          'deptName': deptName ? deptName : '@word(3, 5)',      
          'distributionNetwork|1': ['0', '1'],
          'address': '@county()',
          'type': '@word(3)',  
          'planBeginTime': '@date',
          'planEndTime': '@date',
          'workEmployee|1-3': [{
            'key|+1': 1,
            'title': '@name',
          }],
          'content': '@sentence',
        }],
      }), 400)
    },
    '/api/crud/bathDelete': (options) => toSuccess({options}, 400),
    '/api/crud/getWorkEmployee': (options) => toSuccess(mock({
      'status': true,
      'data|10': [{
        'key|+1': 1,
        'title': '@name',
      }]
    }), 400),
    '/api/crud/save': (options) => toSuccess({options}, 800),
  }
}