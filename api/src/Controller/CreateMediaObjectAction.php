<?php
// api/src/Controller/CreateMediaObjectAction.php

namespace App\Controller;

use App\Entity\MediaObject;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use App\Repository\CommandRepository;


#[AsController]
final class CreateMediaObjectAction extends AbstractController
{

    public function __construct(private CommandRepository $commandRepository)
    {
    }

    public function __invoke(Request $request): MediaObject
    {
        $uploadedFile = $request->files->get('file');
        $commandID= $request->request->get('command');
        $command = $this->commandRepository->findOneBy(['id' => $commandID]);
        if (!$uploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }

        $mediaObject = new MediaObject();
        $mediaObject->file = $uploadedFile;

        if ($commandID) {
            $mediaObject->setCommand($command);
        }

        return $mediaObject;
    }
}