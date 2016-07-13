const testContext = require.context('./src/', true, /\.spec.jsx?$/);
testContext.keys().forEach(testContext);

const srcContext = require.context('./src/', true, /\.jsx?$/);
srcContext.keys().forEach(srcContext);
