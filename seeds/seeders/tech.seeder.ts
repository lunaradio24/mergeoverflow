import { Tech } from 'src/techs/entities/tech.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class TechSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const techRepository = dataSource.getRepository(Tech);
    const numExistingTechs = await techRepository.count();
    if (numExistingTechs === 0) {
      const techs = [
        { techName: 'Javascript' },
        { techName: 'Node.js' },
        { techName: 'Express.js' },
        { techName: 'Typescript' },
        { techName: 'Nest.js' },
        { techName: 'SQL' },
        { techName: 'C++' },
        { techName: 'Java' },
        { techName: 'Spring' },
        { techName: 'Springboot' },
        { techName: 'Django' },
        { techName: 'Ruby on Rails' },
        { techName: 'Vue.js' },
        { techName: 'NoSQL' },
        { techName: 'UX/UI' },
        { techName: 'postgreSQL' },
        { techName: 'C#' },
        { techName: 'Kotlin' },
        { techName: 'Nuxt.js' },
        { techName: 'Unity' },
        { techName: 'Dart' },
        { techName: 'Swift' },
        { techName: 'PHP' },
        { techName: 'Julia' },
        { techName: 'Flask' },
        { techName: 'Linux' },
        { techName: 'Ruby' },
        { techName: 'Python' },
        { techName: 'React' },
        { techName: 'undefined' },
      ];

      await techRepository.save(techs);
    }
  }
}
