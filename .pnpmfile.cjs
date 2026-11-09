// TypeScript 7 (native port) no longer exposes the classic compiler JS API that
// typescript-eslint requires. Give typescript-eslint its own TS 6.x so linting
// works, while the project itself (tsc, Next.js build) stays on TypeScript 7.
const ESLINT_TS = 'npm:typescript@6.0.3';
const NEEDS_CLASSIC_TS = /^(@typescript-eslint\/|ts-api-utils$)/;

module.exports = {
  hooks: {
    readPackage(pkg) {
      if (NEEDS_CLASSIC_TS.test(pkg.name) && pkg.peerDependencies?.typescript) {
        delete pkg.peerDependencies.typescript;
        pkg.dependencies = { ...pkg.dependencies, typescript: ESLINT_TS };
      }
      return pkg;
    },
  },
};
