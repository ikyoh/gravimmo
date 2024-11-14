<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use App\Entity\Invoice;
use Symfony\Component\Mailer\MailerInterface;
use App\Service\PdfInvoiceService;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;


#[AsController]
class PdfInvoiceMailerController extends AbstractController
{

    public function __invoke(Invoice $data, MailerInterface $mailer, PdfInvoiceService $pdf)
    {


        $html =  $this->renderView('pdf/invoice.html.twig', $pdf->formatTwigContent($data));

        $to = $data->getTrustee()->getBillingEmail();
        $cc = $data->getTrustee()->getCcBillingEmails();
        $subject = 'Facture Gravimmo' . $data->getChrono();

        if ($data->getTrustee()) {
            $customerReference = $data->getTrustee()->getReference();
        }

        if ($data->getCustomer()) {
            $customerReference = $data->getCustomer()->getReference();
        }

        $email = (new TemplatedEmail())
            ->from('gravimmo@gmail.com')
            ->to($to)
            ->subject($subject)
            ->attach($pdf->generatePDF($html), 'Facture_' . $data->getChrono() . '_' . $customerReference . '.pdf')
            ->htmlTemplate('mail/email.html.twig');

        if (!empty($cc)) {
            $email->addTo(...$cc);
        }

        $mailer->send($email);
    }
}
