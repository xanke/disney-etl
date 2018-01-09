module.exports = {
  mongodb: 'mongodb://127.0.0.1:27017/disney_park',
  mysql: {
    database: 'disney',
    prefix: 'db_',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root'
  },

  disneyPark: [
    {
      disney_key: '80007798',
      disney_lang: 'US',
      disney_local: 'orlando',
      disney_client_id: 'TPR-DLR_2016.IOS-PROD',
      utc: -5
    },
    {
      disney_key: '80008297',
      disney_lang: 'US',
      disney_local: 'california',
      disney_client_id: 'TPR-DLR_2016.IOS-PROD',
      utc: -8
    },
    {
      disney_key: 'dlp',
      disney_lang: 'GB',
      disney_local: 'paris',
      disney_client_id: 'WDPRO-MOBILE.DLP.IOS-PROD',
      utc: -1
    },
    {
      disney_key: 'hkdl',
      disney_lang: 'CN',
      disney_local: 'hongkong',
      disney_client_id: 'WDPRO-MOBILE.HKDL.IOS-PROD',
      utc: 8
    },
    {
      disney_key: '',
      disney_lang: 'CN',
      disney_local: 'shanghai',
      disney_client_id: 'DPRD-SHDR.MOBILE.ANDROID-PROD',
      utc: 8
    },
    {
      disney_key: '',
      disney_lang: 'JP',
      disney_local: 'tokyo',
      disney_client_id: '',
      utc: 8
    }
  ]
}
