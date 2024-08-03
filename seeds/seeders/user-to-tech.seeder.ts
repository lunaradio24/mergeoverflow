import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserToTech } from 'src/users/entities/user-to-tech.entity';
import { NUM_CREATING_ACCOUNTS } from 'seeds/constants/account.seed.constant';
import { NUM_TECH_SELECTIONS, TOTAL_NUM_TECHS } from 'seeds/constants/user-to-tech.seed.constant';
import { getRandIntArray } from 'src/utils/functions/get-random-int-array.function';

export default class UserToTechSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const userToTechRepository = dataSource.getRepository(UserToTech);

    // 먼저 생성된 User 데이터를 내림차순으로 정렬하여 상위 {numNewAccounts}개를 가져온다.
    const newUsers = await userRepository.find({
      order: { createdAt: 'DESC' },
      take: NUM_CREATING_ACCOUNTS,
    });

    // 가져온 데이터를 다시 오름차순으로 정렬
    newUsers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // 생성된 User 데이터에 따라 UserToTech 데이터를 생성
    await Promise.all(
      newUsers.map(async (user) => {
        // techId를 {NUM_TECH_SELECTIONS}개 만큼 겹치지 않게 랜덤으로 생성
        const selectedIds = getRandIntArray(NUM_TECH_SELECTIONS, TOTAL_NUM_TECHS);

        // UserToTech 데이터 생성 및 저장
        await Promise.all(
          selectedIds.map(async (selectedId) => {
            const userToTech = new UserToTech();
            userToTech.userId = user.id;
            userToTech.techId = selectedId;
            await userToTechRepository.save(userToTech);
          }),
        );
      }),
    );
  }
}
