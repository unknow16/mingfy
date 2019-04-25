module.exports = {
    title: 'Hello VuePress',
    description: 'Just playing around',
    themeConfig: {
        displayAllHeaders: true, // 默认值：false
        nav: [
            { text: 'Home', link: '/' },
            {
                text: 'NodeJS',
                items: [
                    { text: 'Vue', link: '/dubbo/' },
                    { text: 'Spring-Boot', link: '/dubbo/' },
                    { text: 'Spring-Cloud', link: '/hbase/' }
                ]
            },
            {
                text: 'Java',
                items: [
                    { text: 'Mybatis', link: '/dubbo/' },
                    { text: 'Spring-Boot', link: '/dubbo/' },
                    { text: 'Spring-Cloud', link: '/hbase/' }
                ]
            },
            {
                text: 'Spring',
                items: [
                    { text: 'Spring', link: '/dubbo/' },
                    { text: 'Spring-Boot', link: '/dubbo/' },
                    { text: 'Spring-Cloud', link: '/hbase/' }
                ]
            },
            {
                text: '容器化',
                items: [
                    { text: 'Docker', link: '/container/docker/' },
                    { text: 'kubernetes', link: '/container/kubernetes/' },
                    { text: 'Rancher', link: '/container/rancher' }
                ]
            },
            {
                text: 'BigData',
                items: [
                    { text: 'HDFS', link: '/bigdata/hdfs/' },
                    { text: 'MapReduce', link: '/bigdata/mapreduce/' },
                    { text: 'HBase', link: '/bigdata/hbase/' },
                    { text: 'Hive', link: '/bigdata/hive/' },
                    { text: 'Flume', link: '/bigdata/flume/' },
                    { text: 'Kafka', link: '/bigdata/kafka/' }
                ]
            },
        ],
        sidebar: {
            '/dubbo/': [
              '', 
              'Dubbo-01-简易RPC实现原理',
              'Dubbo-02-架构设计详解'
            ],

            '/bigdata/hdfs/': [
                '',
                '01',
                '02'
              ],
      
            '/bigdata/hbase/': [
              '', // 指向hbase/readme.md
              'HBase-01-简明入门',
              'HBase-02-Write全流程'
            ],
            
      
            // fallback
            '/': [
              '',
              'contact',
              'about'
            ]
          }
    }
}