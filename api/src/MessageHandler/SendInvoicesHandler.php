<?php

namespace App\MessageHandler;

use Symfony\Component\Mime\Email;
use App\Service\PdfInvoiceService;
use App\Message\SendInvoicesMessage;
use App\Repository\InvoiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsMessageHandler]
final class SendInvoicesHandler extends AbstractController
{


    public function __construct(private MailerInterface $mailer, private InvoiceRepository $invoiceRepository, private EntityManagerInterface $entityManager, private PdfInvoiceService $pdf)
    {
    }

    public function __invoke(SendInvoicesMessage $message)
    {

        $invoicesToSend = $this->invoiceRepository->findBy(['status' => "validé",'isSend' => false]);

    foreach ($invoicesToSend as $invoice) {

        $html = $this->renderView('pdf/invoice.html.twig', $this->pdf->formatTwigContent($invoice));

        $to = $invoice->getTrustee()->getBillingEmail();
        $subject = 'Facture Gravimmo'. $invoice->getChrono();

        $customerReference = $invoice->getTrustee()->getReference() || $invoice->getCustomer()->getReference();

        $email = (new TemplatedEmail())
        ->from('gravimmo@gmail.com')
        ->to($to)
        ->subject($subject)
        ->attach($this->pdf->generatePDF($html), 'Facture_'.$invoice->getChrono().'_'.$customerReference.'.pdf')
        ->htmlTemplate('mail/email.html.twig');

        $this->mailer->send($email);

        $invoice->setIsSend(true);
        $this->entityManager->persist($invoice);
        $this->entityManager->flush();
            var_dump($invoice->getChrono());
        }
    }
}

