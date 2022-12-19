<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PropertyServiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;


#[ORM\Entity(repositoryClass: PropertyServiceRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['propertyservices:read']],
    denormalizationContext : ['groups' => ["propertyservice:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['propertyservice:read']]),
        new Put(),
        new Post(),
        new Delete()
    ]
)]
class PropertyService
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["propertyservices:read", "propertyservice:read"])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write"])]
    private ?Service $service = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write"])]
    private ?string $material = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write"])]
    private ?string $size = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write"])]
    private ?string $color = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write"])]
    private ?string $font = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write"])]
    private ?string $margin = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write"])]
    private array $finishing = [];

    #[ORM\ManyToOne(inversedBy: 'services')]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write"])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Property $property = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getMaterial(): ?string
    {
        return $this->material;
    }

    public function setMaterial(?string $material): self
    {
        $this->material = $material;

        return $this;
    }

    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(?string $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function getFont(): ?string
    {
        return $this->font;
    }

    public function setFont(?string $font): self
    {
        $this->font = $font;

        return $this;
    }

    public function getMargin(): ?string
    {
        return $this->margin;
    }

    public function setMargin(?string $margin): self
    {
        $this->margin = $margin;

        return $this;
    }

    public function getFinishing(): array
    {
        return $this->finishing;
    }

    public function setFinishing(?array $finishing): self
    {
        $this->finishing = $finishing;

        return $this;
    }

    public function getProperty(): ?Property
    {
        return $this->property;
    }

    public function setProperty(?Property $property): self
    {
        $this->property = $property;

        return $this;
    }
}
