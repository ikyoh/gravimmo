<?php

namespace App\EntityListener;

use App\Repository\InvoiceRepository;
use App\Entity\Invoice;
use DateTime;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class InvoiceListener extends AbstractController
{

    private $repository;

    public function __construct(InvoiceRepository $repository)
    {
        $this->repository = $repository;
    }

    public function prePersist(Invoice $invoice)
    {
        $invoice->setChrono($this->repository->findNextChrono());

        if ($invoice->getTrustee()) {
            $invoice->setTrusteeTitle($invoice->getTrustee()->getTitle());
        }
        if ($invoice->getCustomer()) {
            $invoice->setCustomerTitle($invoice->getCustomer()->getTitle());
        }
        if ($invoice->getProperty()) {
            $invoice->setPropertyTitle($invoice->getProperty()->getTitle());
        }

        if ($invoice->getCommand() && $invoice->getCommand()->getIsUpdate() === true) {
            $invoice->setSubject("Suite à mise à jour demandée");
        }

        if ($invoice->getCommand()) {
            $invoice->setComment($invoice->getCommand()->getCommentInvoice());
        }

        if (is_null($invoice->getStatus())) $this->createInvoice($invoice);
    }

    public function createInvoice(Invoice $invoice)
    {
        $content = array();
        $amount = 0;

        $services = $invoice->getCommand()->getProperty()->getServices();
        $tva = $invoice->getCommand()->getProperty()->getTva();

        if ($invoice->getCommand()->getIsCustom() === false) {
            foreach ($services as $service) {
                $amount += $service->getService()->getPrice();
                array_push($content, array(
                    "type" => "service",
                    "serviceId" => $service->getService()->getId(),
                    "reference" => $service->getService()->getReference(),
                    "title" => $service->getService()->getTitle(),
                    "invoiceTitle" => $service->getService()->getInvoiceTitle(),
                    "occupant" => $invoice->getCommand()->getDetails()['nouveloccupant'],
                    "quantity" => 1,
                    "price" => $service->getService()->getPrice(),
                    "discount" => 0,
                    "amount" => $service->getService()->getPrice(),
                ));
            }
        }

        if (!empty($invoice->getCommand()->getExtraServices())) {
            foreach ($invoice->getCommand()->getExtraServices() as $extraService) {
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

        if (!empty($invoice->getCommand()->getCustomServices())) {
            foreach ($invoice->getCommand()->getCustomServices() as $customService) {

                foreach ($customService->getPropertyServices() as $propertyService) {

                    $amount += $propertyService->getService()->getPrice();
                    array_push($content, array(
                        "type" => "customService",
                        "serviceId" => $propertyService->getService()->getId(),
                        "reference" => $propertyService->getService()->getReference(),
                        "title" => $propertyService->getService()->getTitle(),
                        "invoiceTitle" => $propertyService->getService()->getInvoiceTitle(),
                        "occupant" => $customService->getDetails()['nouveloccupant'],
                        "proprietaire" => $customService->getDetails()['proprietaire'] && $customService->getDetails()['proprietaire'] !== "" ? $customService->getDetails()['proprietaire'] : "",
                        "quantity" => 1,
                        "price" => $propertyService->getService()->getPrice(),
                        "discount" => 0,
                        "amount" => $propertyService->getService()->getPrice(),
                    ));
                }
            }
        }

        if (!empty($invoice->getCommand()->getReports())) {
            $reports = $invoice->getCommand()->getReports();
            foreach ($reports as $report) {
                if (!empty($report->getReport()->getService())) {
                    $amount += $report->getReport()->getService()->getPrice();
                    array_push($content, array(
                        "type" => "service",
                        "serviceId" => $report->getReport()->getService()->getId(),
                        "reference" => $report->getReport()->getService()->getReference(),
                        "title" => $report->getReport()->getService()->getTitle(),
                        "invoiceTitle" => $report->getReport()->getService()->getInvoiceTitle(),
                        "quantity" => 1,
                        "price" => $report->getReport()->getService()->getPrice(),
                        "discount" => 0,
                        "amount" => $report->getReport()->getService()->getPrice(),
                    ));
                }
            }
        }

        $invoice->setStatus("édité");
        $invoice->setTva($tva);
        $invoice->setAmountHT(round($amount, 2));
        $invoice->setAmountTTC($amount + $amount * $tva / 100);
        $invoice->setContent($content);

        if ($invoice->getTrustee()) {
            $invoice->setTrusteeTitle($invoice->getTrustee()->getTitle());
        }
        if ($invoice->getCustomer()) {
            $invoice->setCustomerTitle($invoice->getCustomer()->getTitle());
        }
        if ($invoice->getProperty()) {
            $invoice->setPropertyTitle($invoice->getProperty()->getTitle());
        }
    }
}
