<?php

namespace App\Controller;

use NumberFormatter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Entity\Invoice;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Mime\Part\File;

#[AsController]
class PdfInvoiceMailerController extends AbstractController
{

    public function __invoke(Invoice $data, MailerInterface $mailer)
    {








        $pdfcontent = [
            'name'         => 'John Doe',
            'address'      => 'USA',
            'mobileNumber' => '000000000',
            'email'        => 'john.doe@email.com'
        ];
        $html =  $this->renderView('pdf/invoice.html.twig', $pdfcontent);
        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->render();



        $to = $data->getTrustee()->getBillingEmail();
        $content = '<p>Veuillez trouvez ci-joint votre facture</p>';
        $subject = 'Facture Gravimmo'. $data->getChrono();


        $email = (new Email())
        ->from('gravimmo@gmail.com')
        ->to($to)
        ->subject($subject)
        ->attach($dompdf->output(), 'facture.pdf')
        ->html($content);

        $mailer->send($email);
    }


    
}
