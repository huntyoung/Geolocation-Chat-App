import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGeolocationToChatRoom1648779516279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'chat_room',
      new TableColumn({
        name: 'lat',
        type: 'float',
      }),
    );
    await queryRunner.addColumn(
      'chat_room',
      new TableColumn({
        name: 'lon',
        type: 'float',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('chat_room', 'lat');
    await queryRunner.dropColumn('chat_room', 'lon');
  }
}
