import { SetMetadata } from '@nestjs/common';

export const ALLOWED_PROVIDERS_KEY = 'allowedProviders';

// AllowedProviders 데코레이터 정의
export const AllowedProviders = (...providers: string[]) => SetMetadata(ALLOWED_PROVIDERS_KEY, providers);
