import { Faker } from '@faker-js/faker';
import { Preferences } from 'src/preferences/entities/preferences.entity';
import { PreferredAgeGap } from 'src/preferences/types/preferred-age-gap.type';
import { PreferredBodyShape } from 'src/preferences/types/preferred-body-shape.type';
import { PreferredCodingLevel } from 'src/preferences/types/preferred-coding-level.type';
import { PreferredDistance } from 'src/preferences/types/preferred-distance.type';
import { PreferredFrequency } from 'src/preferences/types/preferred-frequency.type';
import { PreferredGender } from 'src/preferences/types/preferred-gender.type';
import { PreferredHeight } from 'src/preferences/types/preferred-height.type';
import { setSeederFactory } from 'typeorm-extension';

export const matchingPreferenceFactory = setSeederFactory(Preferences, (faker: Faker) => {
  const matchingPreferences = new Preferences();
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
