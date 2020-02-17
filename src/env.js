// NODE_ENV有三个值，分别对应如下:

// 运行npm start，为development
// 运行npm test，为test
// 运行npm run build，为production

const development = {
  // BASE_URL: 'http://120.79.154.128:7111',
  BASE_URL: 'http://192.168.0.43:7001',
};

const prod = {
  // BASE_URL: 'http://192.168.0.43:7001',
};

const qa = {
  // BASE_URL: 'http://192.168.0.43:7001',
};

function getConfig() {
  const env = CUSTOM_ENV; //eslint-disable-line
  if (env === 'qa') {
    return qa;
  }
  if (env === 'prod') {
    return prod;
  }
  return development;
}

const config = getConfig();

export default config;
