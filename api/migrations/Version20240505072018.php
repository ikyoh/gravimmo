<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240505072018 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE quote ADD command_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF433E1689A FOREIGN KEY (command_id) REFERENCES command (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6B71CBF433E1689A ON quote (command_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE quote DROP FOREIGN KEY FK_6B71CBF433E1689A');
        $this->addSql('DROP INDEX UNIQ_6B71CBF433E1689A ON quote');
        $this->addSql('ALTER TABLE quote DROP command_id');
    }
}
