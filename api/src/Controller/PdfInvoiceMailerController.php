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
use App\Service\PdfInvoiceService;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;


#[AsController]
class PdfInvoiceMailerController extends AbstractController
{

    public function __invoke(Invoice $data, MailerInterface $mailer,PdfInvoiceService $pdf)
    {


        $html =  $this->renderView('pdf/invoice.html.twig', $pdf->formatTwigContent($data));

        $to = $data->getTrustee()->getBillingEmail();
        $subject = 'Facture Gravimmo'. $data->getChrono();

        if ($data->getTrustee())
        {$customerReference = $data->getTrustee()->getReference();}

        if ($data->getCustomer()){
        $customerReference = $data->getCustomer()->getReference();}

        $email = (new TemplatedEmail())
        ->from('gravimmo@gmail.com')
        ->to($to)
        ->subject($subject)
        ->attach($pdf->generatePDF($html), 'Facture_'.$data->getChrono().'_'.$customerReference.'.pdf')
        ->htmlTemplate('mail/email.html.twig');

        $mailer->send($email);
    }


}
