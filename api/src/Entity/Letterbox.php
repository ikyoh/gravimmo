<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\LetterboxRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: LetterboxRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['letterboxes:read']],
    denormalizationContext: ['groups' => ["letterbox:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['letterbox:read']]),
        new Put(),
        new Post()
    ]
)]
class Letterbox
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["letterboxes:read", "letterbox:read", "property:read"])]
    private ?int $id = null;
    
    #[ORM\Column]
    #[Groups(["letterboxes:read", "letterbox:read", "letterbox:write"])]
    private array $content = [];
    
    #[ORM\Column]
    #[Groups(["letterboxes:read", "letterbox:read", "letterbox:write"])]
    private ?int $columns = null;
    
    #[ORM\ManyToOne(inversedBy: 'letterboxes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["letterboxes:read", "letterbox:read", "letterbox:write"])]
    private ?Property $property = null;
    
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["letterboxes:read", "letterbox:read", "letterbox:write", "property:read"])]
    private ?string $entrance = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): array
    {
        return $this->content;
    }

    public function setContent(array $content): self
    {
        $this->content = $content;

        return $this;
    }


    public function getColumns(): ?int
    {
        return $this->columns;
    }

    public function setColumns(int $columns): self
    {
        $this->columns = $columns;

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

    public function getEntrance(): ?string
    {
        return $this->entrance;
    }

    public function setEntrance(?string $entrance): self
    {
        $this->entrance = $entrance;

        return $this;
    }
}
