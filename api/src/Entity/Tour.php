<?php

namespace App\Entity;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use Doctrine\DBAL\Types\Types;
use ApiPlatform\Metadata\Delete;
use Doctrine\ORM\Mapping as ORM;

use App\Repository\TourRepository;
use ApiPlatform\Metadata\ApiFilter;
use App\EntityListener\TourListener;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\Common\Collections\Collection;

use Doctrine\Common\Collections\ArrayCollection;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Filter\MultipleFieldsSearchFilter;

#[ORM\Entity(repositoryClass: TourRepository::class)]
#[ORM\EntityListeners([TourListener::class])]
#[ApiResource(
    normalizationContext: ['groups' => ['tours:read']],
    denormalizationContext: ['groups' => ["tour:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['tour:read']]),
        new Put(),
        new Post(),
        new Delete()
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['id', 'sector', 'status', 'scheduledAt', 'user.firstname'])]
#[ApiFilter(SearchFilter::class, properties: ['user' => 'exact','status' => 'partial'])]
#[ApiFilter(DateFilter::class, properties: ['scheduledAt'])]
#[ApiFilter(ExistsFilter::class, properties: ['commands'])]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    "id",
    "commands.id",
])]
class Tour
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["tours:read", "tour:read", "commands:read"])]
    private ?int $id = null;


    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(["tours:read", "tour:read", "tour:write"])]
    private ?\DateTimeInterface $scheduledAt = null;

    #[ORM\OneToMany(mappedBy: 'tour', targetEntity: Command::class)]
    #[Groups(["tours:read", "tour:read", "tour:write"])]
    private Collection $commands;

    #[ORM\Column(length: 255)]
    #[Groups(["tours:read", "tour:read", "tour:write"])]
    private ?string $status = 'DEFAULT - à traiter';

    #[ORM\Column(length: 255)]
    #[Groups(["tours:read", "tour:read", "tour:write"])]
    private ?string $sector;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(["tours:read", "tour:read", "tour:write"])]
    private array $positions = [];

    #[ORM\ManyToOne(inversedBy: 'tours')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["tours:read", "tour:read", "tour:write", "commands:read"])]
    private ?User $user = null;

    public function __construct()
    {
        $this->commands = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getScheduledAt(): ?\DateTimeInterface
    {
        return $this->scheduledAt;
    }

    public function setScheduledAt(\DateTimeInterface $scheduledAt): self
    {
        $this->scheduledAt = $scheduledAt;

        return $this;
    }

    /**
     * @return Collection<int, Command>
     */
    public function getCommands(): Collection
    {
        return $this->commands;
    }

    public function addCommand(Command $command): self
    {
        if (!$this->commands->contains($command)) {
            $this->commands->add($command);
            $command->setTour($this);
        }

        return $this;
    }

    public function removeCommand(Command $command): self
    {
        if ($this->commands->removeElement($command)) {
            // set the owning side to null (unless already changed)
            if ($command->getTour() === $this) {
                $command->setTour(null);
            }
        }

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getSector(): ?string
    {
        return $this->sector;
    }

    public function setSector(?string $sector): self
    {
        $this->sector = $sector;

        return $this;
    }

    public function getPositions(): array
    {
        return $this->positions;
    }

    public function setPositions(?array $positions): self
    {
        $this->positions = $positions;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
