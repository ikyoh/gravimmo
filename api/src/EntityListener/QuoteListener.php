<?php

namespace App\EntityListener;

use App\Repository\QuoteRepository;
use App\Entity\Quote;
use DateTime;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class QuoteListener extends AbstractController
{

    private $repository;

    public function __construct(QuoteRepository $repository)
    {
        $this->repository = $repository;
    }

    public function prePersist(Quote $quote)
    {
        $quote->setChrono($this->repository->findNextChrono());
        
        if ($quote->getTrustee()) {
            $quote->setTrusteeTitle($quote->getTrustee()->getTitle());
        }
        if ($quote->getCustomer()) {
            $quote->setCustomerTitle($quote->getCustomer()->getTitle());
        }
        if ($quote->getProperty()) {
            $quote->setPropertyTitle($quote->getProperty()->getTitle());
        }
        
        if (is_null($quote->getStatus())) $this->createQuote($quote);
    }

    public function createQuote(Quote $quote)
    {
        $content = array();
        $amount = 0;

        $services = $quote->getCommand()->getProperty()->getServices();
        $tva = $quote->getCommand()->getProperty()->getTva();

        if ($quote->getCommand()->getIsCustom() === false) {
            foreach ($services as $service) {
                $amount += $service->getService()->getPrice();
                array_push($content, array(
                    "type" => "service",
                    "serviceId" => $service->getService()->getId(),
                    "reference" => $service->getService()->getReference(),
                    "title" => $service->getService()->getTitle(),
                    "quoteTitle" => $service->getService()->getInvoiceTitle(),
                    "occupant" => $quote->getCommand()->getDetails()['nouveloccupant'],
                    "quantity" => 1,
                    "price" => $service->getService()->getPrice(),
                    "discount" => 0,
                    "amount" => $service->getService()->getPrice(),
                ));
            }
        }

        if (!empty($quote->getCommand()->getExtraServices())) {
            foreach ($quote->getCommand()->getExtraServices() as $extraService) {
                $amount += round($extraService->getService()->getPrice() * (int)$extraService->getDetails()['quantity'], 2);
                array_push($content, array(
                    "type" => "extraService",
                    "serviceId" => $extraService->getService()->getId(),
                    "reference" => $extraService->getService()->getReference(),
                    "title" => $extraService->getService()->getTitle() . ' (' . $extraService->getDetails()['comment'] . ')',
                    "quantity" => (int)$extraService->getDetails()['quantity'],
                    "price" => $extraService->getService()->getPrice(),
                    "discount" => 0,
                    "amount" => round($extraService->getService()->getPrice() * (int)$extraService->getDetails()['quantity'], 2),
                ));
            }
        }

        if (!empty($quote->getCommand()->getCustomServices())) {
            foreach ($quote->getCommand()->getCustomServices() as $customService) {

                foreach ($customService->getPropertyServices() as $propertyService) {

                    $amount += $propertyService->getService()->getPrice();
                    array_push($content, array(
                        "type" => "customService",
                        "serviceId" => $propertyService->getService()->getId(),
                        "reference" => $propertyService->getService()->getReference(),
                        "title" => $propertyService->getService()->getTitle(),
                        "quoteTitle" => $propertyService->getService()->getInvoiceTitle(),
                        "occupant" => $customService->getDetails()['nouveloccupant'],
                        "quantity" => 1,
                        "price" => $propertyService->getService()->getPrice(),
                        "discount" => 0,
                        "amount" => $propertyService->getService()->getPrice(),
                    ));
                }
            }
        }

        $quote->setStatus("édité");
        $quote->setTva($tva);
        $quote->setAmountHT(round($amount, 2));
        $quote->setAmountTTC($amount + $amount * $tva / 100);
        $quote->setContent($content);

        if ($quote->getTrustee()) {
            $quote->setTrusteeTitle($quote->getTrustee()->getTitle());
        }
        if ($quote->getCustomer()) {
            $quote->setCustomerTitle($quote->getCustomer()->getTitle());
        }
        if ($quote->getProperty()) {
            $quote->setPropertyTitle($quote->getProperty()->getTitle());
        }

    }
}
