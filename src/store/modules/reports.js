const reports = {
  state: {
    fetchedReports: [
      {
        id: '1',
        timestamp: '2019/4/12',
        local: true,
        from: 'John', // actor nickname
        object: 'Bob', // user nickname
        header: 'Report #1', // content
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        notes: [
          { author: 'Nick', text: 'Lorem ipsum', timestamp: '2019/4/13' },
          { author: 'Val', text: 'dolor sit amet', timestamp: '2019/4/13' }
        ]
      },
      {
        id: '2',
        timestamp: '2019/4/1',
        local: true,
        from: 'Max',
        object: 'Vic',
        header: 'Report #2',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        notes: [
          { author: 'Tony', text: 'consectetur adipiscing elit', timestamp: '2019/4/2' },
          { author: 'Zac', text: 'sed do eiusmod tempor incididunt', timestamp: '2019/4/3' }
        ]
      },
      {
        id: '3',
        timestamp: '2019/2/28',
        local: true,
        from: 'Tim',
        object: 'Jen',
        header: 'Report #3',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        notes: [{ author: 'Bruce', text: 'ut labore et dolore magna aliqua', timestamp: '2019/3/1' }]
      }
    ]
  },
  mutations: {},
  actions: {}
}

export default reports
