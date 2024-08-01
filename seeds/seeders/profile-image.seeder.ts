import { NUM_CREATING_ACCOUNTS } from 'seeds/constants/seeding-account.constant';
import { NUM_CREATING_IMAGES } from 'seeds/constants/seeding-profile-image.constant';
import { ProfileImage } from 'src/users/entities/profile-image.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class ProfileImageSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const profileImageRepository = dataSource.getRepository(ProfileImage);
    const userRepository = dataSource.getRepository(User);

    // 먼저 생성된 User 데이터를 내림차순으로 정렬하여 상위 {numNewAccounts}개를 가져온다.
    const newUsers = await userRepository.find({
      order: { createdAt: 'DESC' },
      take: NUM_CREATING_ACCOUNTS,
    });

    // 가져온 데이터를 다시 오름차순으로 정렬
    newUsers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // 생성된 User 데이터에 따라 ProfileImage 데이터를 생성
    const profileImageFactory = factoryManager.get(ProfileImage);

    await Promise.all(
      newUsers.map((user) =>
        Promise.all(
          Array.from({ length: NUM_CREATING_IMAGES }).map(async () => {
            const newProfileImage = await profileImageFactory.make();
            newProfileImage.userId = user.id;
            await profileImageRepository.save(newProfileImage);
          }),
        ),
      ),
    );
  }
}
