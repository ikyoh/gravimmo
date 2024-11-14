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
    denormalizationContext: ['groups' => ["propertyservice:write"]],
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
    #[Groups(["commands:read", "propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private ?Service $service = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private ?string $material = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private ?string $size = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private ?string $color = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private ?string $font = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private ?string $thickness = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private ?string $height = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private ?string $ratio = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private ?string $margin = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private array $finishing = [];

    #[ORM\ManyToOne(inversedBy: 'services')]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write"])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Property $property = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["propertyservices:read", "propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private ?string $configuration = null;


    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(["propertyservice:read", "propertyservice:write", "commands:read", "command:read"])]
    private $params = [];

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

    public function getConfiguration(): ?string
    {
        return $this->configuration;
    }

    public function setConfiguration(?string $configuration): self
    {
        $this->configuration = $configuration;

        return $this;
    }

    public function getThickness(): ?string
    {
        return $this->thickness;
    }

    public function setThickness(?string $thickness): self
    {
        $this->thickness = $thickness;

        return $this;
    }

    public function getHeight(): ?string
    {
        return $this->height;
    }

    public function setHeight(?string $height): self
    {
        $this->height = $height;

        return $this;
    }

    public function getRatio(): ?string
    {
        return $this->ratio;
    }

    public function setRatio(?string $ratio): self
    {
        $this->ratio = $ratio;

        return $this;
    }

    public function getParams(): array
    {
        return $this->params;
    }

    public function setParams(?array $params): self
    {
        $this->params = $params;

        return $this;
    }
}
