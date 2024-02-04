<?php

namespace App\EntityListener;

use App\Entity\Tour;
use App\Entity\Command;
use Doctrine\ORM\EntityManagerInterface;


class CommandListener
{

    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }


    public function postUpdate(Command $command)
    {

        if (!$command->getTour()) return;

        $tour = $command->getTour();

        $commands = $tour->getCommands();

        $commandsStatus = [];

        foreach ($commands as $command) {
            array_push($commandsStatus, $command->getStatus());
        }

        $commandsStatus = array_unique($commandsStatus);

        if ($tour instanceof Tour && count($commandsStatus) === 1) {
            $tour->setStatus($commandsStatus[0]);
            $this->entityManager->persist($tour);
            $this->entityManager->flush();
            return null;
        }

        if ($tour instanceof Tour && count($commandsStatus) !== 1) {
            $tour->setStatus('programmé');
            $this->entityManager->persist($tour);
            $this->entityManager->flush();
            return null;
        }
    }
}
