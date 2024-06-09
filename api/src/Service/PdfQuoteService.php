<?php

namespace App\Service;

use Dompdf\Dompdf;
use Dompdf\Options;


class PdfQuoteService
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
        $this->domPdf->stream("devis.pdf", [
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


        $svg1 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 81" width="100%">
        <path d="M78.6658 29.0944C77.9562 29.0594 77.1942 29.0185 76.7945 29.0197C71.4345 29.0197 67.2622 30.5698 64.2776 33.67C62.2769 35.7371 60.8868 38.353 60.0747 41.5015C60.0117 41.7654 59.9873 42.138 59.9325 42.4264V32.8443C59.9325 31.8377 59.9954 30.9522 59.9325 29.998C61.3599 27.4171 62.658 25.4601 64.3848 24.1405C67.4983 21.8048 71.0884 20.6743 75.0606 20.5038C73.3058 17.3962 71.2725 14.4066 68.6297 11.7579C54.252 -2.65783 31.797 -3.76144 16 8.13646C20.2577 5.29045 25.1016 3.81547 30.5653 3.81547C35.4406 3.81547 39.9873 5.06856 44.2381 7.54203C49.7601 10.7559 53.3152 15.5183 55.3077 21.5128C55.9047 23.2838 56.3426 25.1047 56.6163 26.9538C56.7608 27.9464 57.0082 28.947 57.0781 29.998C57.141 30.958 57.1954 31.8342 57.1942 32.835V55.0939C57.1933 57.3136 56.9983 59.5288 56.6116 61.7144C55.8227 66.214 54.0947 69.8997 51.5837 72.9011C51.0197 73.5749 50.5268 74.3025 49.8778 74.9062C46.7317 77.7511 43.0262 79.5939 38.8687 80.6438C49.6028 80.9731 60.4359 77.1321 68.6274 68.9222C79.3976 58.1279 82.6206 42.7896 78.6623 29.0991M59.3557 72.9011H54.3266C56.8377 69.8986 58.5657 66.2129 59.3557 61.712V72.9011Z" fill="black"/>
        <path d="M44.8157 67.1381C46.3037 65.3373 47.2021 63.0565 47.7218 60.4488C47.7579 60.2666 47.8931 60.1673 47.9245 59.9816C48.1751 58.4296 48.2997 56.2539 48.2997 53.4815V34.0125C48.2997 32.3518 47.9094 31.0929 47.7171 29.6273C47.1345 25.0727 45.9437 21.1523 43.5445 18.4768C40.0756 14.672 35.7468 12.7544 30.5906 12.7544C25.6839 12.7544 21.5741 14.5061 18.2928 18.0167C14.9339 21.5715 13.2567 25.8264 13.2614 30.7811C13.2614 35.4524 14.8391 39.5036 18.0272 42.9336C21.4188 46.5982 25.6225 48.431 30.6384 48.4317C33.829 48.4509 36.96 47.5655 39.6701 45.8777C40.8877 45.0941 42.5295 43.8106 44.592 41.9946V51.4845C42.013 53.4433 39.893 54.7902 38.2322 55.5252C35.5418 56.7579 32.6154 57.3872 29.6573 57.3692C26.2199 57.3692 22.8768 56.6498 19.5944 55.2075C16.3681 53.7904 13.4609 51.7343 11.0475 49.1628C6.24985 44.057 3.85376 37.9699 3.8592 30.9014C3.8592 25.3869 5.28775 20.4683 8.14489 16.1458C-3.75207 31.984 -2.66374 54.5056 11.7245 68.9261C12.511 69.7144 13.4175 70.2843 14.2495 70.9931C19.9824 72.6631 25.0745 73.5157 29.486 73.5157C36.2358 73.5157 41.3457 71.391 44.8157 67.1416" fill="black"/>
        </svg>';

        $svg2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 597 100" fill="none">
        <path d="M30.7096 72.22C46.6485 72.22 59.5696 59.2989 59.5696 43.36C59.5696 27.4211 46.6485 14.5 30.7096 14.5C14.7707 14.5 1.84961 27.4211 1.84961 43.36C1.84961 59.2989 14.7707 72.22 30.7096 72.22Z" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M565.71 74.3102C581.649 74.3102 594.57 60.9191 594.57 44.4002C594.57 27.8814 581.649 14.4902 565.71 14.4902C549.771 14.4902 536.85 27.8814 536.85 44.4002C536.85 60.9191 549.771 74.3102 565.71 74.3102Z" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M5.49023 87.0502C5.49023 87.0502 18.7602 97.4402 32.0002 97.4402C44.1702 97.4402 59.5402 90.5902 59.5402 76.4402V45.2402" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M73.8398 76.1002V38.1602C73.8398 27.3202 80.9198 14.7202 99.2798 14.7202" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M113 23.7902C116.54 19.3602 127.38 14.7202 136 14.7202C146.61 14.7202 157.13 20.7202 157.13 30.8602V55.8602C157.13 61.6102 149.71 74.2202 133.78 74.2202C117.85 74.2202 111.89 64.1102 111.89 59.6402V55.6402C111.89 52.5802 115.43 43.3602 128.7 43.3602H157.13" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M171.61 13C171.83 13.66 200.48 74.38 200.48 74.38L222.71 25.16" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M262.52 0.779785V12.9498" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M262.52 24.8901V76.0901" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M292.38 76.0902V43.9102C292.38 37.7802 293.71 14.4902 317.82 14.4902C338.61 14.4902 341.72 28.4302 341.72 41.0402V76.0902" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M341.72 76.0902V43.9102C341.72 37.7802 343.05 14.4902 367.16 14.4902C387.95 14.4902 391.06 28.4302 391.06 41.0402V76.0902" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M417.57 76.0902V43.9102C417.57 37.7802 418.9 14.4902 443.01 14.4902C463.8 14.4902 466.91 28.4302 466.91 41.0402V76.0902" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M466.91 76.0902V43.9102C466.91 37.7802 468.24 14.4902 492.35 14.4902C513.14 14.4902 516.25 28.4302 516.25 41.0402V76.0902" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/>
        <path d="M234.43 0.779785L228.01 14.4898" stroke="#1D1D1B" stroke-width="3.69" stroke-miterlimit="10"/></svg>';

        $svg3 = '<svg viewBox="0 0 788 143" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M140.164 51.6366C138.902 51.5746 137.546 51.5023 136.834 51.5023C127.301 51.5023 119.88 54.2533 114.571 59.7558C111.012 63.4247 108.539 68.0663 107.095 73.6537C106.984 74.1215 106.941 74.7841 106.844 75.2953V58.2836C106.844 56.497 106.465 55.0033 106.354 53.3012C108.892 48.7216 111.692 45.1703 114.764 42.8295C119.873 39.0038 125.702 37.0019 132.122 36.477C132.867 36.4159 133.316 35.6044 132.938 34.9599C130.002 29.9545 126.612 25.1513 122.314 20.8554C96.7386 -4.7203 56.8065 -6.67148 28.701 14.4438C36.2743 9.39249 44.8919 6.78214 54.6107 6.78214C63.2816 6.78214 71.369 9.00528 78.9281 13.3964C88.7508 19.099 95.0746 27.5522 98.6156 38.1894C99.6258 41.2196 100.442 44.4037 100.943 47.8363C101.198 49.5981 101.36 51.4355 101.48 53.3012C101.526 54.0053 101.618 54.6732 101.71 55.3412L101.783 55.8788C101.885 56.6503 101.971 57.434 101.971 58.2836V97.7787C101.971 101.989 101.585 105.868 100.943 109.526C99.5389 117.513 96.4657 124.054 91.9974 129.379C91.6898 129.747 91.3939 130.124 91.098 130.502L90.7518 130.941C90.1966 131.642 89.6258 132.33 88.9632 132.938C85.1483 136.381 80.8685 138.997 76.1873 140.904C75.1126 141.342 75.3836 143.069 76.5409 142.992C93.2181 141.88 109.564 135.067 122.313 122.319C141.471 103.161 147.202 75.9428 140.164 51.6366ZM105.817 129.381H96.8729C101.34 124.054 104.413 117.513 105.817 109.525V129.381Z" fill="black"/>
        <path d="M423.909 21.2177L417.489 34.9276L420.831 36.4921L427.251 22.7821L423.909 21.2177Z" fill="black"/>
        <path d="M451.825 21.9999V34.1698H455.515V21.9999H451.825Z" fill="black"/>
        <path d="M361.172 35.1928L361.169 35.1864C361.129 35.0985 361.051 34.9257 361.01 34.8036L364.511 33.6366L364.544 33.6947C364.602 33.8222 364.686 34.0063 364.796 34.245L365.001 34.6884L365.736 36.2665C366.539 37.9882 367.676 40.4125 369.035 43.3051C371.751 49.0893 375.352 56.7401 378.947 64.3715C382.542 72.0023 386.13 79.6127 388.819 85.3153L391.594 91.1986L412.179 45.6205L415.542 47.1396L391.667 100.001L389.962 96.3876L391.631 95.6C389.962 96.3876 389.962 96.3871 389.961 96.3847L389.941 96.3432L389.88 96.2133L385.482 86.8891C382.792 81.1864 379.204 73.5756 375.609 65.9438C373.641 61.767 371.672 57.5839 369.846 53.7035L365.694 44.8734C364.336 41.9804 363.198 39.5526 362.392 37.8275C361.99 36.9648 361.669 36.2758 361.446 35.7914L361.44 35.7797L361.181 35.2138L361.172 35.1928Z" fill="black"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M726.155 65.6205C726.155 48.1454 739.84 33.8651 756.86 33.8651C773.879 33.8651 787.565 48.1454 787.565 65.6205C787.565 83.0956 773.879 97.3754 756.86 97.3754C739.84 97.3754 726.155 83.0956 726.155 65.6205ZM756.86 37.5556C742.001 37.5556 729.845 50.058 729.845 65.6205C729.845 81.183 742.001 93.6855 756.86 93.6855C771.718 93.6855 783.875 81.183 783.875 65.6205C783.875 50.058 771.718 37.5556 756.86 37.5556Z" fill="black"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M191.155 64.58C191.155 47.622 204.902 33.8749 221.86 33.8749C238.818 33.8749 252.565 47.622 252.565 64.58C252.565 65.2113 252.546 65.8383 252.508 66.4604H252.535V97.6606C252.535 105.512 248.235 111.285 242.489 115.014C236.783 118.717 229.537 120.505 223.15 120.505C216.094 120.505 209.152 117.752 204.076 115.1C201.517 113.764 199.387 112.429 197.892 111.426C197.628 111.248 197.384 111.081 197.16 110.926C196.751 110.642 196.411 110.398 196.148 110.206C195.945 110.058 195.787 109.94 195.679 109.857L195.553 109.762L195.518 109.735L195.508 109.727L195.505 109.725C195.505 109.725 195.503 109.724 195.823 109.315L197.777 106.817L197.782 106.821L197.805 106.839L197.907 106.916L198.098 107.06L198.325 107.227L198.656 107.466L199.02 107.725C199.29 107.914 199.601 108.128 199.949 108.362C201.357 109.307 203.371 110.569 205.785 111.83C210.654 114.373 216.967 116.815 223.15 116.815C228.933 116.815 235.458 115.179 240.48 111.919C245.461 108.686 248.846 103.959 248.846 97.6606V79.2401C243.642 88.7982 233.509 95.2851 221.86 95.2851C204.902 95.2851 191.155 81.538 191.155 64.58ZM221.86 37.5653C206.94 37.5653 194.845 49.6601 194.845 64.58C194.845 79.4999 206.94 91.5951 221.86 91.5951C236.78 91.5951 248.875 79.4999 248.875 64.58C248.875 49.6601 236.78 37.5653 221.86 37.5653Z" fill="black"/>
        <path d="M272.195 44.8315C268.485 48.9423 266.835 54.3373 266.835 59.3803V97.3202H263.145V59.3803C263.145 53.5834 265.035 47.2582 269.455 42.3593C273.912 37.4198 280.794 34.0951 290.43 34.0951V37.7856C281.706 37.7856 275.868 40.7607 272.195 44.8315Z" fill="black"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M305.591 46.162C307.067 44.3148 310.313 42.1952 314.438 40.5243C318.509 38.8744 323.136 37.7856 327.15 37.7856C332.136 37.7856 337.035 39.2006 340.636 41.7196C344.205 44.2162 346.435 47.7318 346.435 52.0805V62.7353H319.85C312.743 62.7353 308.045 65.224 305.129 68.3046C302.29 71.3041 301.195 74.8178 301.195 76.8603V80.8603C301.195 86.5517 308.196 97.2856 324.93 97.2856C333.424 97.2856 339.723 93.9086 343.888 89.7172C347.973 85.6044 350.125 80.5722 350.125 77.0805V52.0805C350.125 46.289 347.095 41.7343 342.751 38.6962C338.44 35.6801 332.774 34.0951 327.15 34.0951C322.544 34.0951 317.441 35.3261 313.052 37.1039C308.717 38.8607 304.772 41.2758 302.708 43.8588L305.591 46.162ZM319.85 66.4252H346.435V77.0805C346.435 79.3388 344.876 83.4862 341.27 87.1161C337.742 90.6669 332.366 93.5951 324.93 93.5951C309.804 93.5951 304.885 84.1088 304.885 80.8603V76.8603C304.885 75.8427 305.56 73.2167 307.808 70.8412C309.98 68.5468 313.686 66.4252 319.85 66.4252Z" fill="black"/>
        <path d="M451.825 97.3105V46.1103H455.515V97.3105H451.825Z" fill="black"/>
        <path d="M485.375 65.1303C485.375 62.1469 485.709 55.1493 488.854 48.9569C490.412 45.8886 492.639 43.0605 495.827 40.9931C499.007 38.9315 503.252 37.5556 508.97 37.5556C518.906 37.5556 524.226 40.8505 527.182 45.2807C530.24 49.8651 531.025 56.0321 531.025 62.2602V64.9213L531.025 65.1303L531.025 97.3105H534.715V65.1303C534.715 62.1469 535.049 55.1493 538.194 48.9569C539.752 45.8886 541.979 43.0605 545.167 40.9931C548.347 38.9315 552.592 37.5556 558.31 37.5556C568.245 37.5556 573.566 40.8505 576.521 45.2807C579.58 49.8651 580.365 56.0321 580.365 62.2602V97.3105H584.055V62.2602C584.055 55.8783 583.285 48.7704 579.591 43.2328C575.794 37.5399 569.164 33.8651 558.31 33.8651C551.973 33.8651 547.011 35.4003 543.16 37.8974C539.317 40.3886 536.692 43.766 534.904 47.286C534.345 48.3871 533.865 49.5063 533.454 50.623C532.774 48.0028 531.755 45.4877 530.251 43.2328C526.454 37.5399 519.825 33.8651 508.97 33.8651C502.633 33.8651 497.671 35.4003 493.82 37.8974C489.977 40.3886 487.352 43.766 485.564 47.286C482.016 54.2714 481.685 61.9838 481.685 65.1303V97.3105H485.375V65.1303Z" fill="black"/>
        <path d="M610.566 65.1303C610.566 62.1469 610.899 55.1493 614.044 48.9569C615.603 45.8886 617.83 43.0605 621.018 40.9931C624.198 38.9315 628.443 37.5556 634.161 37.5556C644.096 37.5556 649.417 40.8505 652.372 45.2807C655.431 49.8651 656.216 56.0321 656.216 62.2602V64.9213L656.215 65.1303L656.216 97.3105H659.906V65.1303C659.906 62.1469 660.239 55.1493 663.384 48.9569C664.943 45.8886 667.17 43.0605 670.358 40.9931C673.537 38.9315 677.783 37.5556 683.5 37.5556C693.436 37.5556 698.757 40.8505 701.712 45.2807C704.77 49.8651 705.556 56.0321 705.556 62.2602V97.3105H709.245V62.2602C709.245 55.8783 708.475 48.7704 704.782 43.2328C700.984 37.5399 694.355 33.8651 683.5 33.8651C677.163 33.8651 672.201 35.4003 668.35 37.8974C664.508 40.3886 661.882 43.766 660.094 47.286C659.535 48.3871 659.056 49.5063 658.645 50.623C657.965 48.0028 656.946 45.4877 655.442 43.2328C651.644 37.5399 645.015 33.8651 634.161 33.8651C627.823 33.8651 622.861 35.4003 619.011 37.8974C615.168 40.3886 612.542 43.766 610.754 47.286C607.207 54.2714 606.875 61.9838 606.875 65.1303V97.3105H610.566V65.1303Z" fill="black"/>
        <path d="M84.8783 107.279C83.9549 111.907 82.3578 115.953 79.7093 119.15C73.5404 126.685 64.4525 130.465 52.4452 130.465C44.598 130.465 35.5414 128.952 25.3456 125.988C24.7713 125.5 24.1776 125.049 23.5848 124.598C22.6478 123.886 21.7118 123.175 20.8548 122.319C-4.73843 96.7274 -6.67349 56.7597 14.4872 28.6518C9.41294 36.3236 6.86362 45.0536 6.86362 54.8398C6.86215 67.4018 11.1156 78.1859 19.6483 87.2475C23.9837 91.8319 29.0423 95.4169 34.8509 97.9745C40.6874 100.532 46.6341 101.809 52.7489 101.809C58.1986 101.809 63.2826 100.725 68.0086 98.5575C70.9554 97.2509 74.7342 94.8607 79.3211 91.3866V74.5434C75.6512 77.767 72.7323 80.0463 70.5658 81.4359C65.6463 84.4662 60.2826 85.9672 54.5018 85.9672C45.577 85.9662 38.1024 82.7157 32.0711 76.2118C26.4002 70.1234 23.5926 62.9247 23.5941 54.6435C23.5926 45.8603 26.5672 38.3002 32.5418 31.9906C38.3797 25.7646 45.6893 22.6523 54.4159 22.6523C63.5873 22.6523 71.2879 26.0439 77.4569 32.7973C81.723 37.5463 83.8412 44.5087 84.8783 52.5858C84.9925 53.4745 85.1488 54.3207 85.305 55.1669C85.6058 56.7973 85.9071 58.4281 85.9076 60.369V94.9164C85.9066 99.8358 85.6839 103.697 85.2401 106.45C85.2118 106.619 85.1346 106.747 85.057 106.875C84.9832 106.998 84.9095 107.121 84.8783 107.279Z" fill="black"/>
        </svg>';

        $logopng='data:image/png;base64,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';

        $datas = [
            'logopng' => $logopng,
            'logo1' => base64_encode($svg1),
            'logo2' => base64_encode($svg2),
            'logo3' => base64_encode($svg3),
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

        return $datas;

    }


}