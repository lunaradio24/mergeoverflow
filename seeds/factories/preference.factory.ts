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

export const preferenceFactory = setSeederFactory(Preferences, (faker: Faker) => {
  const preferences = new Preferences();
  preferences.codingLevel = faker.helpers.enumValue(PreferredCodingLevel);
  preferences.gender = faker.helpers.enumValue(PreferredGender);
  preferences.ageGap = faker.helpers.enumValue(PreferredAgeGap);
  preferences.height = faker.helpers.enumValue(PreferredHeight);
  preferences.bodyShape = faker.helpers.enumValue(PreferredBodyShape);
  preferences.smokingFreq = faker.helpers.enumValue(PreferredFrequency);
  preferences.drinkingFreq = faker.helpers.enumValue(PreferredFrequency);
  preferences.distance = faker.helpers.enumValue(PreferredDistance);

  return preferences;
});
