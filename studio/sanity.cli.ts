import { defineCliConfig } from 'sanity/cli';
import { dataset, projectId } from './env';

export default defineCliConfig({ api: { projectId, dataset }, deployment: { autoUpdates: true, appId: 'q3eso2ce4p6yxxohu7wl378r' } });
