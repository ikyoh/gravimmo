<?php
// api/src/Doctrine/UsersRolesExtension.php

namespace App\Doctrine;

use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\User;


final class UsersRolesExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }
    
    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {

        //$reflexionClass = new \ReflectionClass($resourceClass);

        $user = $this->security->getUser();
        $userRoles = $user->getRoles();

        $rootAlias = $queryBuilder->getRootAliases()[0];

        if ($resourceClass === User::class) {

            if (in_array("ROLE_ADMINISTRATOR", $userRoles)) {
                $queryBuilder->andWhere("$rootAlias.roles NOT LIKE :role_administrator AND $rootAlias.roles NOT LIKE :role_workshop");
                $queryBuilder->setParameter('role_administrator', '%"ROLE_ADMINISTRATOR"%');
                $queryBuilder->setParameter('role_workshop', '%"ROLE_WORKSHOP"%');
            }

            if (in_array("ROLE_WORKSHOP", $userRoles)) {
                $queryBuilder->andWhere("$rootAlias.roles LIKE :role_user OR $rootAlias.roles LIKE :role_installer");
                $queryBuilder->setParameter('role_user', '%"ROLE_USER"%');
                $queryBuilder->setParameter('role_installer', '%"ROLE_INSTALLER"%');
                $queryBuilder->andWhere("$rootAlias.isActive = :is_active");
                $queryBuilder->setParameter('is_active', true);
            }
        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }
}
