module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/posts/react/react-18-changes',
      ],
      startServerCommand: 'pnpm start',
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    upload: {
      target: 'temporary-public-storage',
      githubStatusContextSuffix: '-desktop',
    },
  },
};
