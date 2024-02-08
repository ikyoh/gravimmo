<?php

namespace App\Controller;

use NumberFormatter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Entity\Invoice;

#[AsController]
class PdfInvoiceController extends AbstractController
{

    public function __invoke(Invoice $data)
    {

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
        $content = $data->getContent();
        $newcontent = formatContent($content);

        // Formatage des prix
        $fmt = numfmt_create( 'fr_FR', NumberFormatter::CURRENCY );

        $datas = [
            'image_src'  => $this->imageToBase64($this->getParameter('kernel.project_dir') . '/public/img/gravimmo-logo.png'),
            'chrono'    => $data->getChrono(),
            'contents'    => $newcontent,
            'tva' => $data->getTva(),
            'amountHT' => $data->getAmountHT(),
            'amountTTC' => $data->getAmountTTC(),
            'date' => $data->getCreatedAt()->format('d/m/Y'),
        ];

        if ($data->getCommand()) {
            $datas['details'] = $data->getCommand()->getDetails();
        }

        if ($data->getTrustee()) {
            $datas['trustee'] = $data->getTrustee()->getTitle();
            $datas['trusteeRef'] = $data->getTrustee()->getReference();
            $datas['address'] = $data->getTrustee()->getAddress();
            $datas['postcode'] = $data->getTrustee()->getPostcode();
            $datas['city'] = $data->getTrustee()->getCity();
        }
        
        if ($data->getCustomer()) {
            $datas['customer'] = $data->getCustomer()->getTitle();
            $datas['customerRef'] = $data->getCustomer()->getReference();
            $datas['address'] = $data->getCustomer()->getAddress();
            $datas['postcode'] = $data->getCustomer()->getPostcode();
            $datas['city'] = $data->getCustomer()->getCity();
        }

        if ($data->getProperty()) {
            $datas['property'] = $data->getProperty()->getTitle()  ;
        }

        if ($data->getRefundReference()) {
            $datas['refundReference'] = $data->getRefundReference();
        }

        $html =  $this->renderView('pdf_generator/invoice.html.twig', $datas);

        $options = new Options();

        $options->set('enable_html5_parser', true);
        $dompdf = new Dompdf($options);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->loadHtml($html);
        $dompdf->render();

        $dompdf->stream("mypdf.pdf", [
            "Attachment" => true,
            'compress' => false,
        ]);

        // return new Response('', 200, [
        //     'Content-Type' => 'application/pdf',
        // ]);


        // return new Response(
        //     $pdfContent,
        //     Response::HTTP_OK,
        //     [
        //         'Content-Type' => 'application/pdf',
        //         'Content-Disposition' => 'inline; filename="example.pdf"',
        //     ]
        // );

    }

    private function imageToBase64($path)
    {
        $path = $path;
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
        return $base64;
    }
}
