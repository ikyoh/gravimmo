<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use App\Filter\MultipleFieldsSearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
#[ApiResource(
    normalizationContext: ['groups' => ['orders:read']],
    denormalizationContext: ['groups' => ["order:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['order:read']]),
        new Put(),
        new Post()
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['id', 'status', 'createdAt', 'madeAt', 'deliveredAt', 'trustee.title', 'property.title', 'property.zone'])]
#[ApiFilter(SearchFilter::class, properties: ['status' => 'exact'])]
#[ApiFilter(BooleanFilter::class, properties: ['isHanging'])]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    "id",
    "trustee.title",
    "property.title",
    "property.zone"
])]


class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["orders:read", "order:read"])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["orders:read", "order:read", "order:write"])]
    private ?Trustee $trustee = null;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["orders:read", "order:read", "order:write"])]
    private ?Property $property = null;

    #[ORM\Column]
    #[Groups(["orders:read", "order:read", "order:write"])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(["orders:read", "order:read", "order:write"])]
    private ?\DateTimeInterface $madeAt = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(["orders:read", "order:read", "order:write"])]
    private ?\DateTimeInterface $deliveredAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["order:read", "order:write"])]
    private ?string $trackingEmail = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(["order:read", "order:write"])]
    private ?string $comment = null;

    #[ORM\Column(length: 255)]
    #[Groups(["orders:read", "order:read", "order:write"])]
    private ?string $status = 'à traiter';

    #[ORM\Column(nullable: true)]
    #[Groups(["orders:read", "order:read", "order:write"])]
    private array $details = [];

    #[ORM\Column]
    #[Groups(["orders:read", "order:read", "order:write"])]
    private ?bool $isHanging = false;

    #[ORM\ManyToMany(targetEntity: Service::class)]
    #[Groups(["orders:read", "order:read", "order:write"])]
    private Collection $services;


    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->services = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTrustee(): ?Trustee
    {
        return $this->trustee;
    }

    public function setTrustee(?Trustee $trustee): self
    {
        $this->trustee = $trustee;

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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getMadeAt(): ?\DateTimeInterface
    {
        return $this->madeAt;
    }

    public function setMadeAt(?\DateTimeInterface $madeAt): self
    {
        $this->madeAt = $madeAt;

        return $this;
    }

    public function getDeliveredAt(): ?\DateTimeInterface
    {
        return $this->deliveredAt;
    }

    public function setDeliveredAt(?\DateTimeInterface $deliveredAt): self
    {
        $this->deliveredAt = $deliveredAt;

        return $this;
    }

    public function getTrackingEmail(): ?string
    {
        return $this->trackingEmail;
    }

    public function setTrackingEmail(?string $trackingEmail): self
    {
        $this->trackingEmail = $trackingEmail;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;

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

    public function getDetails(): array
    {
        return $this->details;
    }

    public function setDetails(?array $details): self
    {
        $this->details = $details;

        return $this;
    }

    public function isIsHanging(): ?bool
    {
        return $this->isHanging;
    }

    public function setIsHanging(bool $isHanging): self
    {
        $this->isHanging = $isHanging;

        return $this;
    }

    /**
     * @return Collection<int, Service>
     */
    public function getServices(): Collection
    {
        return $this->services;
    }

    public function addService(Service $service): self
    {
        if (!$this->services->contains($service)) {
            $this->services->add($service);
        }

        return $this;
    }

    public function removeService(Service $service): self
    {
        $this->services->removeElement($service);

        return $this;
    }

}
