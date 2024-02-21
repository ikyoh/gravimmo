<?php

namespace App\Entity;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\CommandRepository;
use ApiPlatform\Metadata\GetCollection;
use App\EntityListener\CommandListener;
use App\Filter\MultipleFieldsSearchFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use Doctrine\Common\Collections\ArrayCollection;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use Symfony\Component\Serializer\Annotation\Groups;



#[ORM\Entity(repositoryClass: CommandRepository::class)]
#[ORM\EntityListeners([CommandListener::class])]
#[ApiResource(
    normalizationContext: ['groups' => ['commands:read']],
    denormalizationContext: ['groups' => ["command:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['command:read']]),
        new Put(),
        new Post()
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['id', 'status', 'createdAt', 'madeAt', 'deliveredAt', 'trustee.title', 'property.title', 'property.zone','tour.scheduledAt'])]
#[ApiFilter(SearchFilter::class, properties: ['status' => 'partial'])]
#[ApiFilter(BooleanFilter::class, properties: ['isHanging'])]
#[ApiFilter(ExistsFilter::class, properties: ['tour'])]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    "id",
    "trustee.title",
    "property.title",
    "property.zone"
])]


class Command
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["commands:read", "command:read", "tours:read", "tour:read", "invoices:read"])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'commands')]
    #[Groups(["commands:read", "command:read", "command:write", "invoices:read", "tour:read", "tours:read",])]
    private ?Trustee $trustee = null;

    #[ORM\ManyToOne(inversedBy: 'commands')]
    #[Groups(["commands:read", "command:read", "command:write", "tour:read", "tours:read", "invoices:read"])]
    private ?Property $property = null;

    #[ORM\ManyToOne(inversedBy: 'commands')]
    #[Groups(["commands:read", "command:read", "command:write", "invoices:read", "tour:read","tours:read"])]
    private ?Customer $customer = null;

    #[ORM\Column]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private ?\DateTimeInterface $madeAt = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private ?\DateTimeInterface $deliveredAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["command:read", "command:write"])]
    private ?string $trackingEmail = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private ?string $comment = null;

    #[ORM\Column(length: 255)]
    #[Groups(["commands:read", "command:read", "command:write", "tour:read"])]
    private ?string $status = 'DEFAULT - à traiter';

    #[ORM\Column(nullable: true)]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private array $details = [];

    #[ORM\Column]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private ?bool $isHanging = false;

    #[ORM\OneToMany(mappedBy: 'command', targetEntity: MediaObject::class)]
    #[Groups(["commands:read","command:read"])]
    private Collection $images;

    #[ORM\Column]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private ?bool $isCustom = false;

    #[ORM\OneToMany(mappedBy: 'command', targetEntity: CommandCustomService::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private Collection $customServices;

    #[ORM\OneToMany(mappedBy: 'command', targetEntity: CommandExtraService::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private Collection $extraServices;
    
    #[ORM\ManyToOne(inversedBy: 'commands')]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private ?Tour $tour = null;

    #[ORM\OneToOne(mappedBy: 'command', cascade: ['persist', 'remove'])]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private ?Invoice $invoice = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["commands:read", "command:read", "command:write"])]
    private ?string $contractorEmail = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->images = new ArrayCollection();
        $this->customServices = new ArrayCollection();
        $this->extraServices = new ArrayCollection();
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
     * @return Collection<int, MediaObject>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(MediaObject $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setCommand($this);
        }

        return $this;
    }

    public function removeImage(MediaObject $image): self
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getCommand() === $this) {
                $image->setCommand(null);
            }
        }

        return $this;
    }

    public function getIsCustom(): ?bool
    {
        return $this->isCustom;
    }

    public function setIsCustom(bool $isCustom): self
    {
        $this->isCustom = $isCustom;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    /**
     * @return Collection<int, CommandCustomService>
     */
    public function getCustomServices(): Collection
    {
        return $this->customServices;
    }

    public function addCustomService(CommandCustomService $customService): self
    {
        if (!$this->customServices->contains($customService)) {
            $this->customServices->add($customService);
            $customService->setCommand($this);
        }

        return $this;
    }

    public function removeCustomService(CommandCustomService $customService): self
    {
        if ($this->customServices->removeElement($customService)) {
            // set the owning side to null (unless already changed)
            if ($customService->getCommand() === $this) {
                $customService->setCommand(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, CommandExtraService>
     */
    public function getExtraServices(): Collection
    {
        return $this->extraServices;
    }

    public function addExtraService(CommandExtraService $extraService): self
    {
        if (!$this->extraServices->contains($extraService)) {
            $this->extraServices->add($extraService);
            $extraService->setCommand($this);
        }

        return $this;
    }

    public function removeExtraService(CommandExtraService $extraService): self
    {
        if ($this->extraServices->removeElement($extraService)) {
            // set the owning side to null (unless already changed)
            if ($extraService->getCommand() === $this) {
                $extraService->setCommand(null);
            }
        }

        return $this;
    }

    public function getTour(): ?Tour
    {
        return $this->tour;
    }

    public function setTour(?Tour $tour): self
    {
        $this->tour = $tour;

        return $this;
    }

    public function getInvoice(): ?Invoice
    {
        return $this->invoice;
    }

    public function setInvoice(Invoice $invoice): self
    {
        // set the owning side of the relation if necessary
        if ($invoice->getCommand() !== $this) {
            $invoice->setCommand($this);
        }

        $this->invoice = $invoice;

        return $this;
    }

    public function getContractorEmail(): ?string
    {
        return $this->contractorEmail;
    }

    public function setContractorEmail(?string $contractorEmail): self
    {
        $this->contractorEmail = $contractorEmail;

        return $this;
    }



}
