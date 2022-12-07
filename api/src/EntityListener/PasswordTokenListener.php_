<?php

namespace App\EntityListener;


use App\Entity\PasswordToken;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\MailerInterface;

class PasswordTokenListener
{

    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    
    public function postPersist(PasswordToken $token)
    {
        $message = (new Email())
        ->from('system@example.com')
        ->to($token->getUser()->getEmail())
        ->subject('Gravimmo - Mot de passe perdu')
        ->text(sprintf('Reset Token :'.$token->getToken(), $token->getToken()));

    $this->mailer->send($message);

    }

}
