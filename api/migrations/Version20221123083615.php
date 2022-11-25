<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20221123083615 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE property ADD trustee_id INT NOT NULL, ADD contact_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE property ADD CONSTRAINT FK_8BF21CDEAFD45F7C FOREIGN KEY (trustee_id) REFERENCES trustee (id)');
        $this->addSql('ALTER TABLE property ADD CONSTRAINT FK_8BF21CDEE7A1254A FOREIGN KEY (contact_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_8BF21CDEAFD45F7C ON property (trustee_id)');
        $this->addSql('CREATE INDEX IDX_8BF21CDEE7A1254A ON property (contact_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE property DROP FOREIGN KEY FK_8BF21CDEAFD45F7C');
        $this->addSql('ALTER TABLE property DROP FOREIGN KEY FK_8BF21CDEE7A1254A');
        $this->addSql('DROP INDEX IDX_8BF21CDEAFD45F7C ON property');
        $this->addSql('DROP INDEX IDX_8BF21CDEE7A1254A ON property');
        $this->addSql('ALTER TABLE property DROP trustee_id, DROP contact_id');
    }
}
