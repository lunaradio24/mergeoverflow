import { Faker } from '@faker-js/faker';
import { MatchingPreferences } from 'src/matchings/entities/matching-preferences.entity';
import { PreferredAgeGap } from 'src/matchings/types/preferred-age-gap.type';
import { PreferredBodyShape } from 'src/matchings/types/preferred-body-shape.type';
import { PreferredCodingLevel } from 'src/matchings/types/preferred-coding-level.type';
import { PreferredDistance } from 'src/matchings/types/preferred-distance.type';
import { PreferredFrequency } from 'src/matchings/types/preferred-frequency.type';
import { PreferredGender } from 'src/matchings/types/preferred-gender.type';
import { PreferredHeight } from 'src/matchings/types/preferred-height.type';
import { setSeederFactory } from 'typeorm-extension';

export const matchingPreferenceFactory = setSeederFactory(MatchingPreferences, (faker: Faker) => {
  const matchingPreferences = new MatchingPreferences();
  matchingPreferences.codingLevel = faker.helpers.enumValue(PreferredCodingLevel);
  matchingPreferences.gender = faker.helpers.enumValue(PreferredGender);
  matchingPreferences.ageGap = faker.helpers.enumValue(PreferredAgeGap);
  matchingPreferences.height = faker.helpers.enumValue(PreferredHeight);
  matchingPreferences.bodyShape = faker.helpers.enumValue(PreferredBodyShape);
  matchingPreferences.smokingFrequency = faker.helpers.enumValue(PreferredFrequency);
  matchingPreferences.drinkingFrequency = faker.helpers.enumValue(PreferredFrequency);
  matchingPreferences.distance = faker.helpers.enumValue(PreferredDistance);

  return matchingPreferences;
});
