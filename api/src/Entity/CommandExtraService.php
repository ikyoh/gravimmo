<?php

namespace App\Entity;

use App\Repository\CommandExtraServiceRepository;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;

#[ORM\Entity(repositoryClass: CommandExtraServiceRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['extraservices:read']],
    denormalizationContext: ['groups' => ["extraservice:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['extraservice:read']]),
        new Put(),
        new Post()
    ]
)]
class CommandExtraService
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["extraservices:read", "extraservice:read"])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'extraServices')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["extraservices:read", "extraservice:read", "extraservice:write"])]
    private ?Command $command = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["extraservices:read", "extraservice:read", "extraservice:write", "command:read", "command:write"])]
    private array $details = [];

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["extraservices:read", "extraservice:read", "extraservice:write", "command:read", "command:write"])]
    private ?Service $service = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCommand(): ?Command
    {
        return $this->command;
    }

    public function setCommand(?Command $command): self
    {
        $this->command = $command;

        return $this;
    }

    public function getDetails(): array
    {
        return $this->details;
    }

    public function setDetails(?array $details): self
    {
        $this->details = $details;

        return $this;
    }

    public function getService(): ?Service
    {
        return $this->service;
    }

    public function setService(?Service $service): self
    {
        $this->service = $service;

        return $this;
    }
}
