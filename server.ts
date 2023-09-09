import Server from './src/http/app';
import config from './config/default';
import log from './src/logging/logger';
import connectDb from './src/database/connect';
import Jobs from './src/cron-tab';

const bootstrap = async () => {
  const port = Number(config.port);
  connectDb();
  Jobs.start();
  const server = await Server();
  server.listen(port, () => {
    log.info(`${config.appName} is running on port ${port}`);
  });
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        log.error('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: Error) => {
    log.error(error);
    exitHandler();
  };

  process.on('uncaughtException', (err) => {
    log.error(
      '[uncaughtException], Shutting down server now on uncaughtException ... ',
    );
    return unexpectedErrorHandler(err);
  });
  process.on('unhandledRejection', (err: Error) => {
    log.error('[unhandledRejection], Shutting down server now ... ');
    return unexpectedErrorHandler(err);
  });

  process.on('SIGTERM', () => {
    log.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
};

bootstrap();
