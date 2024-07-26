import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerBuilder = new DocumentBuilder()
  .setTitle('merge overflow')
  .setDescription('개발자들의 소개팅 사이트')
  .setVersion('1.0')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
  .build();

export const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true, // 새로고침 시에도 JWT 유지하기
    tagsSorter: 'alpha', // API 그룹 정렬을 알파벳 순으로
    operationsSorter: 'alpha', // API 그룹 내 정렬을 알파벳 순으로
  },
};
