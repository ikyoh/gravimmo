<?php

namespace App\EntityListener;

use App\Entity\Tour;

class TourListener
{

    public function prePersist(Tour $tour)
    {
        $this->defineSector($tour);
    }

    public function preUpdate(Tour $tour)
    {
        $this->defineSector($tour);
    }

    public function defineSector(Tour $tour)
    {

        $zones = array();

        $commands = $tour->getCommands();

        foreach ($commands as $command) {

            if ($command->getProperty()){
                $item = $command->getProperty()->getZone();
            }
            if ($command->getCustomer()){
                $item = $command->getCustomer()->getZone();
            }
            if (!in_array($item, $zones)) {
                array_push($zones, $item);
            }
        }

        if (count($zones) === 1) {
            $tour->setSector($zones[0]);
        } else {
            $tour->setSector("Divers");
        }
    }
}
