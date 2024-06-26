<?php

namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use App\Entity\Invoice;
use App\Service\PdfInvoiceService;


#[AsController]
class PdfInvoiceController extends AbstractController
{

    public function __invoke(Invoice $data, PdfInvoiceService $pdf)
    {
        $html = $this->render('pdf/invoice.html.twig', $pdf->formatTwigContent($data));
        $pdf->downloadPDF($html);
    }
}
