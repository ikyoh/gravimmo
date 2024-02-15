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


        $svg1 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 384 81">
        <path d="M78.6658 29.0944C77.9562 29.0594 77.1942 29.0185 76.7945 29.0197C71.4345 29.0197 67.2622 30.5698 64.2776 33.67C62.2769 35.7371 60.8868 38.353 60.0747 41.5015C60.0117 41.7654 59.9873 42.138 59.9325 42.4264V32.8443C59.9325 31.8377 59.9954 30.9522 59.9325 29.998C61.3599 27.4171 62.658 25.4601 64.3848 24.1405C67.4983 21.8048 71.0884 20.6743 75.0606 20.5038C73.3058 17.3962 71.2725 14.4066 68.6297 11.7579C54.252 -2.65783 31.797 -3.76144 16 8.13646C20.2577 5.29045 25.1016 3.81547 30.5653 3.81547C35.4406 3.81547 39.9873 5.06856 44.2381 7.54203C49.7601 10.7559 53.3152 15.5183 55.3077 21.5128C55.9047 23.2838 56.3426 25.1047 56.6163 26.9538C56.7608 27.9464 57.0082 28.947 57.0781 29.998C57.141 30.958 57.1954 31.8342 57.1942 32.835V55.0939C57.1933 57.3136 56.9983 59.5288 56.6116 61.7144C55.8227 66.214 54.0947 69.8997 51.5837 72.9011C51.0197 73.5749 50.5268 74.3025 49.8778 74.9062C46.7317 77.7511 43.0262 79.5939 38.8687 80.6438C49.6028 80.9731 60.4359 77.1321 68.6274 68.9222C79.3976 58.1279 82.6206 42.7896 78.6623 29.0991M59.3557 72.9011H54.3266C56.8377 69.8986 58.5657 66.2129 59.3557 61.712V72.9011Z" fill="black"/>
        <path d="M44.8157 67.1381C46.3037 65.3373 47.2021 63.0565 47.7218 60.4488C47.7579 60.2666 47.8931 60.1673 47.9245 59.9816C48.1751 58.4296 48.2997 56.2539 48.2997 53.4815V34.0125C48.2997 32.3518 47.9094 31.0929 47.7171 29.6273C47.1345 25.0727 45.9437 21.1523 43.5445 18.4768C40.0756 14.672 35.7468 12.7544 30.5906 12.7544C25.6839 12.7544 21.5741 14.5061 18.2928 18.0167C14.9339 21.5715 13.2567 25.8264 13.2614 30.7811C13.2614 35.4524 14.8391 39.5036 18.0272 42.9336C21.4188 46.5982 25.6225 48.431 30.6384 48.4317C33.829 48.4509 36.96 47.5655 39.6701 45.8777C40.8877 45.0941 42.5295 43.8106 44.592 41.9946V51.4845C42.013 53.4433 39.893 54.7902 38.2322 55.5252C35.5418 56.7579 32.6154 57.3872 29.6573 57.3692C26.2199 57.3692 22.8768 56.6498 19.5944 55.2075C16.3681 53.7904 13.4609 51.7343 11.0475 49.1628C6.24985 44.057 3.85376 37.9699 3.8592 30.9014C3.8592 25.3869 5.28775 20.4683 8.14489 16.1458C-3.75207 31.984 -2.66374 54.5056 11.7245 68.9261C12.511 69.7144 13.4175 70.2843 14.2495 70.9931C19.9824 72.6631 25.0745 73.5157 29.486 73.5157C36.2358 73.5157 41.3457 71.391 44.8157 67.1416" fill="black"/>
        </svg>';

        $svg2 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 485 80">
        <path d="M214.697 0.324219H212.766V10.0093H214.697V0.324219Z" fill="black"/>
        </svg>';
    
        


        $datas = [
            'logo' => base64_encode($svg1),
            'logotext' => base64_encode($svg2),
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