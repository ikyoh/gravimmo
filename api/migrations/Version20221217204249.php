<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20221217204249 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE `order` (id INT AUTO_INCREMENT NOT NULL, trustee_id INT NOT NULL, property_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', made_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL, tracking_email VARCHAR(255) DEFAULT NULL, owner VARCHAR(255) DEFAULT NULL, occupant_in VARCHAR(255) DEFAULT NULL, occupant_out VARCHAR(255) DEFAULT NULL, comment VARCHAR(500) DEFAULT NULL, INDEX IDX_F5299398AFD45F7C (trustee_id), INDEX IDX_F5299398549213EC (property_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE password_token (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, token VARCHAR(50) NOT NULL, expires_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_BEAB6C245F37A13B (token), INDEX IDX_BEAB6C24A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE property (id INT AUTO_INCREMENT NOT NULL, trustee_id INT NOT NULL, title VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, postcode VARCHAR(5) NOT NULL, city VARCHAR(255) NOT NULL, tva DOUBLE PRECISION NOT NULL, contact_name VARCHAR(255) DEFAULT NULL, contact_phone VARCHAR(255) DEFAULT NULL, zone VARCHAR(255) DEFAULT NULL, params JSON DEFAULT NULL, access_type VARCHAR(255) NOT NULL, access_code VARCHAR(255) DEFAULT NULL, INDEX IDX_8BF21CDEAFD45F7C (trustee_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE property_user (property_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_928B6973549213EC (property_id), INDEX IDX_928B6973A76ED395 (user_id), PRIMARY KEY(property_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE property_service (id INT AUTO_INCREMENT NOT NULL, service_id INT NOT NULL, property_id INT NOT NULL, material VARCHAR(255) DEFAULT NULL, size VARCHAR(255) DEFAULT NULL, color VARCHAR(255) DEFAULT NULL, font VARCHAR(255) DEFAULT NULL, margin VARCHAR(255) DEFAULT NULL, finishing JSON DEFAULT NULL, INDEX IDX_B850D0AAED5CA9E6 (service_id), INDEX IDX_B850D0AA549213EC (property_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE service (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, category VARCHAR(255) NOT NULL, material JSON DEFAULT NULL, size JSON DEFAULT NULL, color JSON DEFAULT NULL, font JSON DEFAULT NULL, margin JSON DEFAULT NULL, finishing JSON DEFAULT NULL, configuration VARCHAR(255) NOT NULL, price DOUBLE PRECISION NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE trustee (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, postcode VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, billing_email VARCHAR(255) NOT NULL, phone VARCHAR(255) DEFAULT NULL, mobile VARCHAR(255) DEFAULT NULL, color VARCHAR(7) DEFAULT NULL, color2 VARCHAR(7) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, trustee_id INT DEFAULT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, title VARCHAR(255) DEFAULT NULL, phone VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), INDEX IDX_8D93D649AFD45F7C (trustee_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F5299398AFD45F7C FOREIGN KEY (trustee_id) REFERENCES trustee (id)');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F5299398549213EC FOREIGN KEY (property_id) REFERENCES property (id)');
        $this->addSql('ALTER TABLE password_token ADD CONSTRAINT FK_BEAB6C24A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE property ADD CONSTRAINT FK_8BF21CDEAFD45F7C FOREIGN KEY (trustee_id) REFERENCES trustee (id)');
        $this->addSql('ALTER TABLE property_user ADD CONSTRAINT FK_928B6973549213EC FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE property_user ADD CONSTRAINT FK_928B6973A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE property_service ADD CONSTRAINT FK_B850D0AAED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id)');
        $this->addSql('ALTER TABLE property_service ADD CONSTRAINT FK_B850D0AA549213EC FOREIGN KEY (property_id) REFERENCES property (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649AFD45F7C FOREIGN KEY (trustee_id) REFERENCES trustee (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `order` DROP FOREIGN KEY FK_F5299398AFD45F7C');
        $this->addSql('ALTER TABLE `order` DROP FOREIGN KEY FK_F5299398549213EC');
        $this->addSql('ALTER TABLE password_token DROP FOREIGN KEY FK_BEAB6C24A76ED395');
        $this->addSql('ALTER TABLE property DROP FOREIGN KEY FK_8BF21CDEAFD45F7C');
        $this->addSql('ALTER TABLE property_user DROP FOREIGN KEY FK_928B6973549213EC');
        $this->addSql('ALTER TABLE property_user DROP FOREIGN KEY FK_928B6973A76ED395');
        $this->addSql('ALTER TABLE property_service DROP FOREIGN KEY FK_B850D0AAED5CA9E6');
        $this->addSql('ALTER TABLE property_service DROP FOREIGN KEY FK_B850D0AA549213EC');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649AFD45F7C');
        $this->addSql('DROP TABLE `order`');
        $this->addSql('DROP TABLE password_token');
        $this->addSql('DROP TABLE property');
        $this->addSql('DROP TABLE property_user');
        $this->addSql('DROP TABLE property_service');
        $this->addSql('DROP TABLE service');
        $this->addSql('DROP TABLE trustee');
        $this->addSql('DROP TABLE user');
    }
}
