<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230531183141 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE `order` (id INT AUTO_INCREMENT NOT NULL, trustee_id INT NOT NULL, property_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', made_at DATE DEFAULT NULL, delivered_at DATE DEFAULT NULL, tracking_email VARCHAR(255) DEFAULT NULL, comment VARCHAR(500) DEFAULT NULL, status VARCHAR(255) NOT NULL, details JSON DEFAULT NULL, is_hanging TINYINT(1) NOT NULL, INDEX IDX_F5299398AFD45F7C (trustee_id), INDEX IDX_F5299398549213EC (property_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F5299398AFD45F7C FOREIGN KEY (trustee_id) REFERENCES trustee (id)');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F5299398549213EC FOREIGN KEY (property_id) REFERENCES property (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE order_service DROP FOREIGN KEY FK_17E733998D9F6D38');
        $this->addSql('ALTER TABLE `order` DROP FOREIGN KEY FK_F5299398AFD45F7C');
        $this->addSql('ALTER TABLE `order` DROP FOREIGN KEY FK_F5299398549213EC');
        $this->addSql('DROP TABLE `order`');
    }
}
