<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20221123085709 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE property_service (id INT AUTO_INCREMENT NOT NULL, service_id INT NOT NULL, property_id INT NOT NULL, material VARCHAR(255) DEFAULT NULL, size VARCHAR(255) DEFAULT NULL, color VARCHAR(255) DEFAULT NULL, font VARCHAR(255) DEFAULT NULL, margin JSON DEFAULT NULL, finishing JSON DEFAULT NULL, INDEX IDX_B850D0AAED5CA9E6 (service_id), INDEX IDX_B850D0AA549213EC (property_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE property_service ADD CONSTRAINT FK_B850D0AAED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id)');
        $this->addSql('ALTER TABLE property_service ADD CONSTRAINT FK_B850D0AA549213EC FOREIGN KEY (property_id) REFERENCES property (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE property_service DROP FOREIGN KEY FK_B850D0AAED5CA9E6');
        $this->addSql('ALTER TABLE property_service DROP FOREIGN KEY FK_B850D0AA549213EC');
        $this->addSql('DROP TABLE property_service');
    }
}
