<?php

namespace App\Service;

use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;


class MailerService
{

    public function __invoke(MailerInterface $mailer, Email $email)
    {

        $email = (new Email())
            ->from('hello@example.com')
            ->to('user@example.com')
            ->subject('Daily Reminder')
            ->text('This is your daily reminder.');

        $mailer->send($email);
    }

}