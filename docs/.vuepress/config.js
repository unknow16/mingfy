module.exports = {
    title: 'Hello VuePress',
    description: 'Just playing around',
    themeConfig: {
        displayAllHeaders: true, // 默认值：false
        nav: [
            {
                text: 'Languages',
                items: [
                    { text: 'Chinese', link: '/language/chinese' },
                    { text: 'Japanese', link: '/language/japanese' }
                ]
            },
            { text: 'Guide', link: '/' },
            // { text: 'Docker', link: '/docs/' },
            { text: 'Dubbo', link: '/dubbo/' },
            { text: 'HBase', link: '/hbase/' }
        ],
        sidebar: {
            '/dubbo/': [
              '',     /* /foo/ */
              'Dubbo-01-简易RPC实现原理',  /* /foo/one.html */
              'Dubbo-02-架构设计详解'   /* /foo/two.html */
            ],
      
            '/hbase/': [
              '',      /* /bar/ */
              'HBase-01-简明入门', /* /bar/three.html */
              'HBase-02-Write全流程'   /* /bar/four.html */
            ],
      
            // fallback
            '/': [
              '',        /* / */
              'contact', /* /contact.html */
              'about'    /* /about.html */
            ]
          }
    }
}