<?php

namespace App\Entity;

use App\Repository\CommandCustomServiceRepository;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;

#[ORM\Entity(repositoryClass: CommandCustomServiceRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['customservices:read']],
    denormalizationContext: ['groups' => ["customservice:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['customservice:read']]),
        new Put(),
        new Post()
    ]
)]
class CommandCustomService
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["customservices:read", "customservice:read"])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'customServices')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["customservices:read", "customservice:read", "customservice:write", "command:read", "command:write"])]
    private ?Command $command = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["commands:read", "customservices:read", "customservice:read", "customservice:write", "command:read", "command:write"])]
    private array $details = [];
    
    #[ORM\ManyToMany(targetEntity: PropertyService::class)]
    #[Groups(["commands:read", "customservices:read", "customservice:read", "customservice:write", "command:read", "command:write"])]
    private Collection $propertyServices;
    
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["commands:read", "customservices:read", "customservice:read", "customservice:write", "commands:read", "command:read", "command:write"])]
    private ?string $entrance = null;


    public function __construct()
    {
        $this->propertyServices = new ArrayCollection();
    }


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

    /**
     * @return Collection<int, PropertyService>
     */
    public function getPropertyServices(): Collection
    {
        return $this->propertyServices;
    }

    public function addPropertyService(PropertyService $propertyService): self
    {
        if (!$this->propertyServices->contains($propertyService)) {
            $this->propertyServices->add($propertyService);
        }

        return $this;
    }

    public function removePropertyService(PropertyService $propertyService): self
    {
        $this->propertyServices->removeElement($propertyService);

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
