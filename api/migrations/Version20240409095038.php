<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240409095038 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE command_report (id INT AUTO_INCREMENT NOT NULL, report_id INT NOT NULL, service_id INT NOT NULL, command_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', comment VARCHAR(255) DEFAULT NULL, INDEX IDX_7B6CBEC74BD2A4C0 (report_id), INDEX IDX_7B6CBEC7ED5CA9E6 (service_id), INDEX IDX_7B6CBEC733E1689A (command_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE command_report ADD CONSTRAINT FK_7B6CBEC74BD2A4C0 FOREIGN KEY (report_id) REFERENCES report (id)');
        $this->addSql('ALTER TABLE command_report ADD CONSTRAINT FK_7B6CBEC7ED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id)');
        $this->addSql('ALTER TABLE command_report ADD CONSTRAINT FK_7B6CBEC733E1689A FOREIGN KEY (command_id) REFERENCES command (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE command_report DROP FOREIGN KEY FK_7B6CBEC74BD2A4C0');
        $this->addSql('ALTER TABLE command_report DROP FOREIGN KEY FK_7B6CBEC7ED5CA9E6');
        $this->addSql('ALTER TABLE command_report DROP FOREIGN KEY FK_7B6CBEC733E1689A');
        $this->addSql('DROP TABLE command_report');
    }
}
