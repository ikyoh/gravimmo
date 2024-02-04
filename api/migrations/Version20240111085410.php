<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240111085410 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE invoice ADD trustee_iri_id INT DEFAULT NULL, ADD customer_iri_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE invoice ADD CONSTRAINT FK_90651744F4FED15E FOREIGN KEY (trustee_iri_id) REFERENCES trustee (id)');
        $this->addSql('ALTER TABLE invoice ADD CONSTRAINT FK_9065174473C03464 FOREIGN KEY (customer_iri_id) REFERENCES customer (id)');
        $this->addSql('CREATE INDEX IDX_90651744F4FED15E ON invoice (trustee_iri_id)');
        $this->addSql('CREATE INDEX IDX_9065174473C03464 ON invoice (customer_iri_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE invoice DROP FOREIGN KEY FK_90651744F4FED15E');
        $this->addSql('ALTER TABLE invoice DROP FOREIGN KEY FK_9065174473C03464');
        $this->addSql('DROP INDEX IDX_90651744F4FED15E ON invoice');
        $this->addSql('DROP INDEX IDX_9065174473C03464 ON invoice');
        $this->addSql('ALTER TABLE invoice DROP trustee_iri_id, DROP customer_iri_id');
    }
}
