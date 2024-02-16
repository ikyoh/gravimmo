<?php

namespace App\Entity;

use App\Repository\PropertyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use App\Filter\MultipleFieldsSearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

use DateTime;

#[ORM\Entity(repositoryClass: PropertyRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['properties:read']],
    denormalizationContext: ['groups' => ["property:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['property:read']]),
        new Put(),
        new Post()
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['id', 'reference', 'title', 'postcode', 'city', 'zone', 'trustee.title'])]
#[ApiFilter(SearchFilter::class, properties: ['trustee' => 'exact'])]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    "id",
    "reference",
    "title",
    "city",
    "zone",
    "postcode",
    "trustee.title",
])]
class Property
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["properties:read", "property:read"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "invoices:read", "tour:read"])]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read"])]
    private ?string $address = null;

    #[ORM\Column(length: 5)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read"])]
    private ?string $postcode = null;

    #[ORM\Column(length: 255)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read"])]
    private ?string $city = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["property:read", "property:write", "commands:read"])]
    private ?string $contactName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["property:read", "property:write", "commands:read"])]
    private ?string $contactPhone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "tour:read"])]
    private ?string $zone = null;

    #[ORM\ManyToOne(inversedBy: 'properties')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["properties:read", "property:read", "property:write"])]
    private ?Trustee $trustee = null;

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: PropertyService::class, orphanRemoval: true)]
    #[Groups(["property:read", "property:write", "commands:read"])]
    private Collection $services;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(["property:read", "property:write", "commands:read"])]
    private $params = [];

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: Command::class)]
    private Collection $commands;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'properties')]
    #[Groups(["property:read", "property:write"])]
    private Collection $contacts;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(["property:read", "property:write"])]
    private ?\DateTimeInterface $deliveredAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["property:read", "property:write", "commands:read"])]
    private array $accesses = [];

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["properties:read", "property:read", "property:write"])]
    private ?string $reference = null;

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: Invoice::class)]
    private Collection $invoices;


    public function __construct()
    {
        $this->services = new ArrayCollection();
        $this->services = new ArrayCollection();
        $this->commands = new ArrayCollection();
        $this->contacts = new ArrayCollection();
        $this->invoices = new ArrayCollection();
    }


     // Récupérer le montant de la TVA en fonction de la date de livraison )
    #[Groups(["property:read"])]
    public function getTva()
    {
        $deliveredDate = new DateTime($this->getDeliveredAt());
        $today = new DateTime();

        // Calcul de l'écart en années
        $yearsInterval = ($deliveredDate)->diff(($today))->y;

        if ($yearsInterval < 2) {
            return(20);
        } else {
            return(10);
        }

    }


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

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getPostcode(): ?string
    {
        return $this->postcode;
    }

    public function setPostcode(string $postcode): self
    {
        $this->postcode = $postcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getContactName(): ?string
    {
        return $this->contactName;
    }

    public function setContactName(?string $contactName): self
    {
        $this->contactName = $contactName;

        return $this;
    }

    public function getContactPhone(): ?string
    {
        return $this->contactPhone;
    }

    public function setContactPhone(?string $contactPhone): self
    {
        $this->contactPhone = $contactPhone;

        return $this;
    }

    public function getZone(): ?string
    {
        return $this->zone;
    }

    public function setZone(?string $zone): self
    {
        $this->zone = $zone;

        return $this;
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



    /**
     * @return Collection<int, PropertyService>
     */
    public function getServices(): Collection
    {
        return $this->services;
    }

    public function addService(PropertyService $service): self
    {
        if (!$this->services->contains($service)) {
            $this->services->add($service);
            $service->setProperty($this);
        }

        return $this;
    }

    public function removeService(PropertyService $service): self
    {
        if ($this->services->removeElement($service)) {
            // set the owning side to null (unless already changed)
            if ($service->getProperty() === $this) {
                $service->setProperty(null);
            }
        }

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
            $command->setProperty($this);
        }

        return $this;
    }

    public function removeCommand(Command $command): self
    {
        if ($this->commands->removeElement($command)) {
            // set the owning side to null (unless already changed)
            if ($command->getProperty() === $this) {
                $command->setProperty(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getContacts(): Collection
    {
        return $this->contacts;
    }

    public function addContact(User $contact): self
    {
        if (!$this->contacts->contains($contact)) {
            $this->contacts->add($contact);
        }

        return $this;
    }

    public function removeContact(User $contact): self
    {
        $this->contacts->removeElement($contact);

        return $this;
    }

    public function getDeliveredAt(): ?string
    {
        if ($this->deliveredAt) {
            return $this->deliveredAt->format('Y-m-d');
        } else {
            return $this->deliveredAt;
        }
    }

    public function setDeliveredAt(\DateTimeInterface $deliveredAt): self
    {
        $this->deliveredAt = $deliveredAt;

        return $this;
    }

    public function getAccesses(): array
    {
        return $this->accesses;
    }

    public function setAccesses(?array $accesses): self
    {
        $this->accesses = $accesses;

        return $this;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(?string $reference): self
    {
        $this->reference = $reference;

        return $this;
    }

    /**
     * @return Collection<int, Invoice>
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices->add($invoice);
            $invoice->setProperty($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getProperty() === $this) {
                $invoice->setProperty(null);
            }
        }

        return $this;
    }
}
