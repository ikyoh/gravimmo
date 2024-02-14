<?php

namespace App\Service;

use Dompdf\Dompdf;
use Dompdf\Options;


class PdfInvoiceService
{
    private $domPdf;

    public function __construct() {
        $pdfOptions = new Options();
        $pdfOptions->set('defaultFont', 'Helvetica');
        $pdfOptions->set('isRemoteEnabled', true);
        $pdfOptions->set('no-pdf-compression', true);  
        $this->domPdf = new DomPdf($pdfOptions);
        $this->domPdf->setPaper('A4', 'portrait');
    }

    public function downloadPDF($html) {

        $this->domPdf->loadHtml($html);
        $this->domPdf->render();
        $this->domPdf->stream("facture.pdf", [
            'Attachement' => true
        ]);
        return $this->domPdf->stream('', ["Attachment" => false]);
    }

    public function generatePDF($html) {
        $this->domPdf->loadHtml($html);
        $this->domPdf->render();
        return $this->domPdf->output();
    }

    public function formatTwigContent($invoice) {

        function isValueInArray($value, $array)
        {
            foreach ($array as $line) {
                if (in_array($value, $line)) return true;
            }
            return false;
        }

        function findIndexInArray($tableaux, $valueToFind)
        {
            foreach ($tableaux as $index => $tableau) {
                // Vérifier si la valeur est présente dans le tableau
                if (in_array($valueToFind, $tableau)) {
                    return $index;
                }
            }
        }


        function formatContent($content)
        {

            $computedcontent = [];
            $servicesLine = [];


            foreach ($content as $line) {

                // Vérifie si le type est service
                if ($line['type'] === "service") {

                    //si $servicesLine est empty
                    if (empty($servicesLine)) {
                        $servicesLine = [
                            "type" => "service",
                            "title" => "",
                            "price" => $line['price'],
                            "amount" => $line['amount'],
                            "quantity" => $line['quantity'],
                            "occupant" => $line['occupant'],
                            "reference" => $line['reference'],
                        ];

                        if ($line['invoiceTitle']) {
                            $servicesLine['title'] = $line['invoiceTitle'];
                        }
                    }
                    //sinon concat
                    else {
                        if ($line['invoiceTitle']) {
                            $servicesLine['title'] =  $servicesLine['title'] . " - " . $line['invoiceTitle'];
                        }
                        $servicesLine['reference'] =  $servicesLine['reference'] . $line['reference'];
                        $servicesLine['price'] =  $servicesLine['price'] + $line['price'];
                        $servicesLine['amount'] =  $servicesLine['amount'] + $line['amount'];
                    }
                }

                if ($line['type'] === "extraService") {
                    array_push($computedcontent, $line);
                }

                if ($line['type'] === "customService") {
                    // var_dump($line['occupant']);

                    if (!isValueInArray($line['occupant'], $computedcontent)) {
                        $customLine = [
                            "type" => "customService",
                            "title" =>  $line['invoiceTitle'],
                            "price" => $line['price'],
                            "amount" => $line['amount'],
                            "quantity" => $line['quantity'],
                            "occupant" => $line['occupant'],
                            "reference" => $line['reference'],
                        ];
                        array_unshift($computedcontent, $customLine);
                    } else {
                        $index = findIndexInArray($computedcontent, $line['occupant']);
                        $computedcontent[$index]['reference'] =  $computedcontent[$index]['reference'] . $line['reference'];
                        $computedcontent[$index]['title'] =  $computedcontent[$index]['title'] . " - " . $line['invoiceTitle'];
                        $computedcontent[$index]['price'] =  $computedcontent[$index]['price'] + $line['price'];
                        $computedcontent[$index]['amount'] =  $computedcontent[$index]['amount'] + $line['amount'];
                    }
                }
            }


            if (!empty($servicesLine)) {
                array_unshift($computedcontent, $servicesLine);
            }

            return ($computedcontent);
        }

        // Utilisation de la fonction avec votre tableau
        $content = $invoice->getContent();
        $newcontent = formatContent($content);


        $datas = [
            'chrono'    => $invoice->getChrono(),
            'contents'    => $newcontent,
            'tva' => $invoice->getTva(),
            'amountHT' => $invoice->getAmountHT(),
            'amountTTC' => $invoice->getAmountTTC(),
            'date' => $invoice->getCreatedAt()->format('d/m/Y'),
        ];

        if ($invoice->getCommand()) {
            $datas['details'] = $invoice->getCommand()->getDetails();
        }

        if ($invoice->getTrustee()) {
            $datas['trustee'] = $invoice->getTrustee()->getTitle();
            $datas['trusteeRef'] = $invoice->getTrustee()->getReference();
            $datas['address'] = $invoice->getTrustee()->getAddress();
            $datas['postcode'] = $invoice->getTrustee()->getPostcode();
            $datas['city'] = $invoice->getTrustee()->getCity();
        }

        if ($invoice->getCustomer()) {
            $datas['customer'] = $invoice->getCustomer()->getTitle();
            $datas['customerRef'] = $invoice->getCustomer()->getReference();
            $datas['address'] = $invoice->getCustomer()->getAddress();
            $datas['postcode'] = $invoice->getCustomer()->getPostcode();
            $datas['city'] = $invoice->getCustomer()->getCity();
        }

        if ($invoice->getProperty()) {
            $datas['property'] = $invoice->getProperty()->getTitle()  ;
        }

        if ($invoice->getRefundReference()) {
            $datas['refundReference'] = $invoice->getRefundReference();
        }

        return $datas;

    }


}