<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240130110910 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE quote (id INT AUTO_INCREMENT NOT NULL, command_id INT DEFAULT NULL, trustee_id INT DEFAULT NULL, customer_id INT DEFAULT NULL, property_id INT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', status VARCHAR(255) NOT NULL, chrono INT NOT NULL, content JSON DEFAULT NULL, trustee_title VARCHAR(255) DEFAULT NULL, property_title VARCHAR(255) DEFAULT NULL, customer_title VARCHAR(255) DEFAULT NULL, tva DOUBLE PRECISION NOT NULL, amount_ht DOUBLE PRECISION NOT NULL, amount_ttc DOUBLE PRECISION NOT NULL, refund_reference INT DEFAULT NULL, is_send TINYINT(1) NOT NULL, is_refund TINYINT(1) NOT NULL, comment VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_6B71CBF433E1689A (command_id), INDEX IDX_6B71CBF4AFD45F7C (trustee_id), INDEX IDX_6B71CBF49395C3F3 (customer_id), INDEX IDX_6B71CBF4549213EC (property_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF433E1689A FOREIGN KEY (command_id) REFERENCES command (id)');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF4AFD45F7C FOREIGN KEY (trustee_id) REFERENCES trustee (id)');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF49395C3F3 FOREIGN KEY (customer_id) REFERENCES customer (id)');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF4549213EC FOREIGN KEY (property_id) REFERENCES property (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE quote DROP FOREIGN KEY FK_6B71CBF433E1689A');
        $this->addSql('ALTER TABLE quote DROP FOREIGN KEY FK_6B71CBF4AFD45F7C');
        $this->addSql('ALTER TABLE quote DROP FOREIGN KEY FK_6B71CBF49395C3F3');
        $this->addSql('ALTER TABLE quote DROP FOREIGN KEY FK_6B71CBF4549213EC');
        $this->addSql('DROP TABLE quote');
    }
}
