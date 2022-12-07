<?php

/*
 * This file is part of the CoopTilleulsForgotPasswordBundle package.
 *
 * (c) Vincent CHALAMON <vincent@les-tilleuls.coop>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\User;
use CoopTilleuls\ForgotPasswordBundle\Event\CreateTokenEvent;
use CoopTilleuls\ForgotPasswordBundle\Event\ForgotPasswordEvent;
use CoopTilleuls\ForgotPasswordBundle\Event\UpdatePasswordEvent;
use Doctrine\Bundle\DoctrineBundle\Registry;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;

/**
 * @author Vincent CHALAMON <vincent@les-tilleuls.coop>
 */
final class ForgotPasswordEventListener implements EventSubscriberInterface
{
    /**
     * @var MailerInterface
     */
    private $mailer;

    /**
     * @var EngineInterface|Environment
     */
    private $twig;

    private UserPasswordHasherInterface $hasher;

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(MailerInterface $mailer, ManagerRegistry $doctrine, UserPasswordHasherInterface $hasher)
    {
        $this->mailer = $mailer;
        //$this->twig = $twig;
        $this->hasher = $hasher;
        $this->entityManager = $doctrine->getManager();
    }

    public static function getSubscribedEvents()
    {
        return [
            CreateTokenEvent::class => 'onCreateToken',
            UpdatePasswordEvent::class => 'onUpdatePassword',
            // Symfony 4.3 and inferior
            //ForgotPasswordEvent::CREATE_TOKEN => 'onCreateToken',
            //ForgotPasswordEvent::UPDATE_PASSWORD => 'onUpdatePassword',
        ];
    }

    public function onCreateToken(CreateTokenEvent $event): void
    {
        $passwordToken = $event->getPasswordToken();
        /** @var User $user */
        $user = $passwordToken->getUser();

        $message = (new TemplatedEmail())
            ->from('no-reply@example.com')
            ->to($user->getEmail())
            ->subject('Réinitialisation de votre mot de passe')
            ->htmlTemplate('ResetPassword/mail.html.twig')
            ->context([
                'token' =>  $passwordToken->getToken()
            ]);
            //->text(sprintf('Reset Token :'.$passwordToken->getToken(), $passwordToken->getToken()));
            //->html($this->twig->render('ResetPassword/mail.html.twig', ['token' => $passwordToken->getToken()]));
        $this->mailer->send($message);
    }

    public function onUpdatePassword(UpdatePasswordEvent $event): void
    {
        $passwordToken = $event->getPasswordToken();
        $user = $passwordToken->getUser();
        $hasher = $this->hasher->hashPassword($user, $event->getPassword());
        $user->setPassword($hasher);
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
}