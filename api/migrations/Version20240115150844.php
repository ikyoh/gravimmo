<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240115150844 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE invoice DROP FOREIGN KEY FK_90651744F4FED15E');
        $this->addSql('ALTER TABLE invoice DROP FOREIGN KEY FK_9065174473C03464');
        $this->addSql('DROP INDEX IDX_9065174473C03464 ON invoice');
        $this->addSql('DROP INDEX IDX_90651744F4FED15E ON invoice');
        $this->addSql('ALTER TABLE invoice ADD trustee_id INT DEFAULT NULL, ADD customer_id INT DEFAULT NULL, ADD property_id INT DEFAULT NULL, ADD trustee_title VARCHAR(255) DEFAULT NULL, ADD property_title VARCHAR(255) DEFAULT NULL, ADD customer_title VARCHAR(255) DEFAULT NULL, DROP trustee_iri_id, DROP customer_iri_id, DROP trustee, DROP property, DROP customer');
        $this->addSql('ALTER TABLE invoice ADD CONSTRAINT FK_90651744AFD45F7C FOREIGN KEY (trustee_id) REFERENCES trustee (id)');
        $this->addSql('ALTER TABLE invoice ADD CONSTRAINT FK_906517449395C3F3 FOREIGN KEY (customer_id) REFERENCES customer (id)');
        $this->addSql('ALTER TABLE invoice ADD CONSTRAINT FK_90651744549213EC FOREIGN KEY (property_id) REFERENCES property (id)');
        $this->addSql('CREATE INDEX IDX_90651744AFD45F7C ON invoice (trustee_id)');
        $this->addSql('CREATE INDEX IDX_906517449395C3F3 ON invoice (customer_id)');
        $this->addSql('CREATE INDEX IDX_90651744549213EC ON invoice (property_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE invoice DROP FOREIGN KEY FK_90651744AFD45F7C');
        $this->addSql('ALTER TABLE invoice DROP FOREIGN KEY FK_906517449395C3F3');
        $this->addSql('ALTER TABLE invoice DROP FOREIGN KEY FK_90651744549213EC');
        $this->addSql('DROP INDEX IDX_90651744AFD45F7C ON invoice');
        $this->addSql('DROP INDEX IDX_906517449395C3F3 ON invoice');
        $this->addSql('DROP INDEX IDX_90651744549213EC ON invoice');
        $this->addSql('ALTER TABLE invoice ADD trustee_iri_id INT DEFAULT NULL, ADD customer_iri_id INT DEFAULT NULL, ADD trustee VARCHAR(255) DEFAULT NULL, ADD property VARCHAR(255) DEFAULT NULL, ADD customer VARCHAR(255) DEFAULT NULL, DROP trustee_id, DROP customer_id, DROP property_id, DROP trustee_title, DROP property_title, DROP customer_title');
        $this->addSql('ALTER TABLE invoice ADD CONSTRAINT FK_90651744F4FED15E FOREIGN KEY (trustee_iri_id) REFERENCES trustee (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE invoice ADD CONSTRAINT FK_9065174473C03464 FOREIGN KEY (customer_iri_id) REFERENCES customer (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_9065174473C03464 ON invoice (customer_iri_id)');
        $this->addSql('CREATE INDEX IDX_90651744F4FED15E ON invoice (trustee_iri_id)');
    }
}
