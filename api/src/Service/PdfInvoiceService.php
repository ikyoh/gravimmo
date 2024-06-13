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

                    if (!isValueInArray($line['occupant'], $computedcontent)) {
                        $customLine = [
                            "type" => "customService",
                            "title" => $line['invoiceTitle'] !== "" && $line['invoiceTitle'] !== null ? $line['invoiceTitle'] : "",
                            "proprietaire" => $line['proprietaire'] ? $line['proprietaire'] : "",
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
                        if ($line['invoiceTitle']) {
                            $computedcontent[$index]['title'] =  $computedcontent[$index]['title'] . " - " . $line['invoiceTitle'];
                        }
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


        $logo1= '<svg width="182" height="182" viewBox="0 0 182 182" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M91 182C141.258 182 182 141.258 182 91C182 82.4275 180.815 74.1318 178.599 66.268C174.601 65.4182 169.194 65.2177 161.5 66.5C147.1 68.9 136.833 87.3333 135.5 95.5V69C135.5 58.0183 152.613 48.8515 169.287 44.5805C153.426 17.8884 124.302 0 91 0C72.0265 0 54.4093 5.80669 39.8284 15.7399C48.1266 11.1702 57.0981 8.66144 65.4961 8.49994C91.4961 7.99994 128.996 23.4999 128.996 71.9999C128.996 94.7013 128.943 105.791 128.911 112.397V112.4C128.874 119.904 128.866 121.619 128.996 128C129.467 151.056 117.099 178.54 83.5534 181.7C86.0093 181.899 88.4928 182 91 182ZM134.5 164H123C131 156 134 144.333 134.5 139.5V164Z" fill="black"/>
        <path d="M32.1155 160.383C33.1044 160.701 33.9216 160.918 34.4962 161C35.174 161.097 36.3769 161.344 37.9924 161.675C44.7182 163.055 58.5948 165.903 71.4962 165.5C87.4962 165 108.996 154 108.996 128V82.5C108.996 52 100.504 29.5 67.5 29.5C43.5 29.5 29.9962 50.5 29.9962 68.9999C29.9962 87.4999 45.496 110 69.4961 109C84.8814 108.359 91.2415 102.818 96.4303 98.2973C97.8193 97.0872 99.1243 95.9502 100.496 94.9999V116.5C94 121.5 82 129.277 69.4961 129.5C41.5 130 8 110.5 8 68.9999C8 58.9495 10.3238 49.9321 14.2299 42.1182C5.22076 56.2378 0 73.0092 0 91C0 118.801 12.4671 143.691 32.1155 160.383Z" fill="black"/>
        </svg>';

        $logo2= '<svg width="100%" viewBox="0 0 597 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.64062 87.2704C5.64062 87.2704 18.9106 97.6604 32.1506 97.6604C44.3206 97.6604 59.6906 90.8104 59.6906 76.6604V45.4604M73.9902 76.3204V38.3804C73.9902 27.5404 81.0702 14.9404 99.4302 14.9404M113.15 24.0104C116.69 19.5804 127.53 14.9404 136.15 14.9404C146.76 14.9404 157.28 20.9404 157.28 31.0804V56.0804C157.28 61.8304 149.86 74.4404 133.93 74.4404C118 74.4404 112.04 64.3304 112.04 59.8604V55.8604C112.04 52.8004 115.58 43.5804 128.85 43.5804H157.28M171.761 13.2202C171.981 13.8802 200.631 74.6002 200.631 74.6002L222.861 25.3802M262.67 1V13.17M262.67 25.1104V76.3103M292.53 76.3104V44.1304C292.53 38.0004 293.86 14.7104 317.97 14.7104C338.76 14.7104 341.87 28.6505 341.87 41.2605V76.3104L341.87 44.1304C341.87 38.0004 343.2 14.7104 367.31 14.7104C388.1 14.7104 391.21 28.6505 391.21 41.2605V76.3104M417.721 76.3104V44.1304C417.721 38.0004 419.051 14.7104 443.161 14.7104C463.951 14.7104 467.061 28.6505 467.061 41.2605V76.3104L467.061 44.1304C467.061 38.0004 468.391 14.7104 492.501 14.7104C513.291 14.7104 516.401 28.6505 516.401 41.2605V76.3104M234.58 1L228.16 14.71M59.72 43.5802C59.72 59.5192 46.7989 72.4402 30.86 72.4402C14.9211 72.4402 2 59.5192 2 43.5802C2 27.6413 14.9211 14.7202 30.86 14.7202C46.7989 14.7202 59.72 27.6413 59.72 43.5802ZM594.72 44.6205C594.72 61.1393 581.799 74.5304 565.86 74.5304C549.921 74.5304 537 61.1393 537 44.6205C537 28.1016 549.921 14.7104 565.86 14.7104C581.799 14.7104 594.72 28.1016 594.72 44.6205Z" stroke="black" stroke-width="4" stroke-miterlimit="10"/>
        </svg>';



        $datas = [
            'logo1' => base64_encode($logo1),
            'logo2' => base64_encode($logo2),
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
            $datas['property'] = $invoice->getProperty()->getTitle();
            $datas['propertydetails'] = $invoice->getProperty()->getTitle()." - ".$invoice->getProperty()->getAddress()." ".$invoice->getProperty()->getPostcode()." ".$invoice->getProperty()->getCity()  ;
        }

        if ($invoice->getRefundReference()) {
            $datas['refundReference'] = $invoice->getRefundReference();
        }

        return $datas;

    }


}