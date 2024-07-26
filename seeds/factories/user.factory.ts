import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../src/users/entities/user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();

  //   const sexFlag = faker.number.int(1);
  //   const sex: 'male' | 'female' = sexFlag ? 'male' : 'female';

  //   user.firstName = faker.person.firstName(sex);
  //   user.lastName = faker.person.lastName(sex);

  return user;
});
