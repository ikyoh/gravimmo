<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ReportRepository;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;

use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ReportRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['reports:read']],
    denormalizationContext: ['groups' => ["report:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['report:read']]),
        new Put(),
        new Delete(),
        new Post()
    ]
)]
class Report
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["reports:read", "report:read"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["reports:read", "report:read", "report:write", "command_report:read"])]
    private ?string $title = null;


    #[ORM\ManyToOne]
    #[Groups(["reports:read", "report:read", "report:write"])]
    private ?Service $service = null;

    #[ORM\Column]
    #[Groups(["reports:read", "report:read", "report:write"])]
    private ?bool $toDeliver = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

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

    public function getToDeliver(): ?bool
    {
        return $this->toDeliver;
    }

    public function setToDeliver(bool $toDeliver): static
    {
        $this->toDeliver = $toDeliver;

        return $this;
    }
}
