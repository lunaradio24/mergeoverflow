import { ConfigService } from '@nestjs/config';

export const mailerModuleOptions = {
  useFactory: async (configService: ConfigService) => ({
    transport: {
      // host: configService.get('EMAIL_HOST'),
      auth: {
        user: configService.get('EMAIL_USERNAME'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    },
  }),
  inject: [ConfigService],
};
