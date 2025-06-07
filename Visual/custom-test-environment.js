const NodeEnvironment = require('jest-environment-node');

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super({
      ...config,
      testEnvironmentOptions: {
        ...(config.testEnvironmentOptions || {}),
      }
    });
  }

  async setup() {
    await super.setup();
    this.global.__DEV__ = true;
  }

  async teardown() {
    await super.teardown();
  }
}

module.exports = CustomEnvironment;