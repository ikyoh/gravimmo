<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ServiceRepository;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(paginationEnabled: false)]
#[ORM\Entity(repositoryClass: ServiceRepository::class)]
class Service
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    private ?string $category = null;

    #[ORM\Column(nullable: true)]
    private array $material = [];

    #[ORM\Column(nullable: true)]
    private array $size = [];

    #[ORM\Column(nullable: true)]
    private array $color = [];

    #[ORM\Column(nullable: true)]
    private array $font = [];

    #[ORM\Column(nullable: true)]
    private array $margin = [];

    #[ORM\Column(nullable: true)]
    private array $finishing = [];

    #[ORM\Column(length: 255)]
    private ?string $configuration = null;

    #[ORM\Column]
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
