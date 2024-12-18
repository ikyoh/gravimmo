<?php

namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use App\Entity\Invoice;
use App\Service\PdfInvoiceService;
//use App\Service\InvoicePdfService;
use Symfony\Component\HttpFoundation\Response;


#[AsController]
class PdfInvoiceController extends AbstractController
{

    public function __invoke(Invoice $data, PdfInvoiceService $pdf)
    {
        // $html = $this->render('pdf/invoicetest.html.twig', $pdf->formatTwigContent($data));
        // $pdf->downloadPDF($html);

        $html = $this->renderView('pdf/invoice.html.twig', $pdf->formatTwigContent($data));


        return new Response($pdf->getPdf($html, 'invoice.pdf'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="invoice.pdf"'
        ]);
        //return $pdf->getPdf("h1>test</h1>", 'invoice.pdf');
    }
}
