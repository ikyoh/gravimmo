<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\ServiceRepository;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use App\Filter\CustomSearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;


#[ORM\Entity(repositoryClass: ServiceRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['services:read']],
    denormalizationContext : ['groups' => ["service:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['service:read']]),
        new Put(),
        new Post()
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['id', 'title', 'category'])]
#[ApiFilter(CustomSearchFilter::class)]

class Service
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["services:read", "service:read", "propertyservice:read"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["services:read", "service:read", "service:write", "propertyservice:read"])]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    #[Groups(["services:read", "service:read", "service:write", "propertyservice:read"])]
    private ?string $category = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["services:read", "service:read", "service:write"])]
    private array $material = [];

    #[ORM\Column(nullable: true)]
    #[Groups(["services:read", "service:read", "service:write"])]
    private array $size = [];

    #[ORM\Column(nullable: true)]
    #[Groups(["services:read", "service:read", "service:write"])]
    private array $color = [];

    #[ORM\Column(nullable: true)]
    #[Groups(["services:read", "service:read", "service:write"])]
    private array $font = [];

    #[ORM\Column(nullable: true)]
    #[Groups(["services:read", "service:read", "service:write"])]
    private array $margin = [];

    #[ORM\Column(nullable: true)]
    #[Groups(["services:read", "service:read", "service:write"])]
    private array $finishing = [];

    #[ORM\Column(length: 255)]
    #[Groups(["services:read", "service:read", "service:write"])]
    private ?string $configuration = null;

    #[ORM\Column]
    #[Groups(["services:read", "service:read", "service:write"])]
    private ?float $price = null;


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

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getMaterial(): array
    {
        return $this->material;
    }

    public function setMaterial(?array $material): self
    {
        $this->material = $material;

        return $this;
    }

    public function getSize(): array
    {
        return $this->size;
    }

    public function setSize(?array $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getColor(): array
    {
        return $this->color;
    }

    public function setColor(?array $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function getFont(): array
    {
        return $this->font;
    }

    public function setFont(?array $font): self
    {
        $this->font = $font;

        return $this;
    }

    public function getMargin(): array
    {
        return $this->margin;
    }

    public function setMargin(?array $margin): self
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

    public function getConfiguration(): string
    {
        return $this->configuration;
    }

    public function setConfiguration(?string $configuration): self
    {
        $this->configuration = $configuration;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }
}
