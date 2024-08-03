import { getRandomInt } from './get-random-int.function';

export const getRandIntArray = (numElements: number, maxInt: number): number[] => {
  const arr = new Array<number>();

  while (arr.length < numElements) {
    // Random Number Generating
    const randInt = getRandomInt(maxInt);

    // Check Duplication
    if (!arr.includes(randInt)) arr.push(randInt);
  }

  // Sort in ascending order
  arr.sort();

  return arr;
};
