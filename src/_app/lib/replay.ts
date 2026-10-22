import {
  addIntegration,
  getClient,
  getReplay,
  replayIntegration,
} from '@sentry/nextjs';

export const startReplay = () => {
  const client = getClient();
  if (!client) throw new Error('Sentry must be initialized before Replay.');
  if (!client.getIntegrationByName('Replay')) {
    addIntegration(
      replayIntegration({ maskAllText: true, blockAllMedia: true }),
    );
  }
  const replay = getReplay();
  if (!replay) throw new Error('Sentry Replay could not be initialized.');
  return replay;
};
