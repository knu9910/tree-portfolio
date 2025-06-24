// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'tree-portfolio',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: {
        aws: {
          region: 'us-east-1', // 명시적으로 리전 지정
        },
      },
    };
  },
  async run() {
    // CDN 없이 Lambda Function만 사용 (확실한 방법)
    const app = new sst.aws.Function('TreePortfolio', {
      handler: 'index.handler',
      runtime: 'nodejs22.x',
      timeout: '30 seconds',
      memory: '1024 MB',
      url: true, // Function URL로 직접 접근
      bundle: '.open-next/server-functions/default',
      environment: {
        NODE_ENV: 'production',
      },
    });

    return {
      url: app.url,
    };
  },
});
