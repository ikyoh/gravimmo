<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240204135250 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE invoice ADD cashed_at DATE DEFAULT NULL');
        $this->addSql('ALTER TABLE quote DROP FOREIGN KEY FK_6B71CBF4AFD45F7C');
        $this->addSql('ALTER TABLE quote DROP FOREIGN KEY FK_6B71CBF49395C3F3');
        $this->addSql('ALTER TABLE quote DROP FOREIGN KEY FK_6B71CBF4549213EC');
        $this->addSql('ALTER TABLE quote DROP FOREIGN KEY FK_6B71CBF433E1689A');
        $this->addSql('DROP INDEX UNIQ_6B71CBF433E1689A ON quote');
        $this->addSql('DROP INDEX IDX_6B71CBF4AFD45F7C ON quote');
        $this->addSql('DROP INDEX IDX_6B71CBF49395C3F3 ON quote');
        $this->addSql('DROP INDEX IDX_6B71CBF4549213EC ON quote');
        $this->addSql('ALTER TABLE quote DROP command_id, DROP trustee_id, DROP customer_id, DROP property_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE invoice DROP cashed_at');
        $this->addSql('ALTER TABLE quote ADD command_id INT DEFAULT NULL, ADD trustee_id INT DEFAULT NULL, ADD customer_id INT DEFAULT NULL, ADD property_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF4AFD45F7C FOREIGN KEY (trustee_id) REFERENCES trustee (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF49395C3F3 FOREIGN KEY (customer_id) REFERENCES customer (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF4549213EC FOREIGN KEY (property_id) REFERENCES property (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF433E1689A FOREIGN KEY (command_id) REFERENCES command (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6B71CBF433E1689A ON quote (command_id)');
        $this->addSql('CREATE INDEX IDX_6B71CBF4AFD45F7C ON quote (trustee_id)');
        $this->addSql('CREATE INDEX IDX_6B71CBF49395C3F3 ON quote (customer_id)');
        $this->addSql('CREATE INDEX IDX_6B71CBF4549213EC ON quote (property_id)');
    }
}
