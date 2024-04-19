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

        if (in_array('DEFAULT - à traiter', $commandsStatus)) {
            $tour->setStatus('DEFAULT - à traiter');
            $this->entityManager->persist($tour);
            $this->entityManager->flush();
            return null;
        }

        if (in_array('DEFAULT - préparé', $commandsStatus)) {
            $tour->setStatus('DEFAULT - préparé');
            $this->entityManager->persist($tour);
            $this->entityManager->flush();
            return null;
        }

        if (in_array('DEFAULT - posé', $commandsStatus)) {
            $tour->setStatus('DEFAULT - posé');
            $this->entityManager->persist($tour);
            $this->entityManager->flush();
            return null;
        }

    

        if (array_search('facturé', $commandsStatus) !== false) {
            $tour->setStatus('facturé');
            $this->entityManager->persist($tour);
            $this->entityManager->flush();
            return null;
        }


        // if ($tour instanceof Tour && count($commandsStatus) === 1) {
        //     $tour->setStatus($commandsStatus[0]);
        //     $this->entityManager->persist($tour);
        //     $this->entityManager->flush();
        //     return null;
        // }

        // if ($tour instanceof Tour && count($commandsStatus) !== 1) {
        //     $tour->setStatus('programmé');
        //     $this->entityManager->persist($tour);
        //     $this->entityManager->flush();
        //     return null;
        // }
    }
}
