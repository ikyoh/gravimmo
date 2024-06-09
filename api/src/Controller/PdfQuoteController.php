<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use App\Entity\Quote;
use App\Service\PdfQuoteService;


#[AsController]
class PdfQuoteController extends AbstractController
{

    public function __invoke(Quote $data, PdfQuoteService $pdf)
    {
        $html = $this->render('pdf/quote.html.twig', $pdf->formatTwigContent($data));
        $pdf->downloadPDF($html);
    }

}
