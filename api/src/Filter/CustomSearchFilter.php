<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;

// usage : `?search[field1,field2]=value` 

final class CustomSearchFilter extends AbstractFilter
{
    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        Operation $operation = null,
        array $context = []
    ): void {


        // Just use this filter for `or` query parameter
        if ($property !== 'search') {
            return;
        }


        // Loop through every time the parameter is used
        // fields will be comma delimited string if used as described or[field1,field2]
        foreach ($value as $searchFields => $searchValue) {
            $orProperties = explode(',', $searchFields);
        }

        $alias = $queryBuilder->getRootAliases()[0];

        foreach ($orProperties as $orPropertie) {
            $queryBuilder->orWhere(sprintf('%s.'.$orPropertie.' LIKE :search', $alias, $alias))
                ->setParameter('search', '%' . $searchValue . '%');
        }

    }


    // This function is only used to hook in documentation generators (supported by Swagger and Hydra)
    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];

        return $description;
    }
}
