<?php

namespace App\Controller;

use App\Entity\Command;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;



#[AsController]
class CommandsSectorsController extends AbstractController
{


    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function __invoke(): JsonResponse
    {


        $commands = $this->entityManager->getRepository(Command::class)->findByDefaultStatus();

        $zones = [];
        foreach ($commands as $command) {
            $zones[] = $command->getProperty()->getZone();
            $zones = array_unique($zones);
            sort($zones);
        }

        return new JsonResponse($zones);
    }
}
