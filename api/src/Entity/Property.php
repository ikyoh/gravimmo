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
use Symfony\Component\Validator\Constraints as Assert;
use App\Filter\NotEqualFilter;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;


use DateTime;

#[ORM\Entity(repositoryClass: PropertyRepository::class)]
#[UniqueEntity(
    fields: ['reference'],
    message: 'Cette référence existe déjà.',
    ignoreNull: true
)]
// #[UniqueEntity(
//     fields: ['transmitter'],
//     message: 'Cette référence existe déjà.',
//     ignoreNull: true
// )]
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
#[ApiFilter(OrderFilter::class, properties: ['id', 'reference', 'title', 'vigik', 'postcode', 'city', 'zone', 'trustee.title', 'trustee.reference'])]
#[ApiFilter(SearchFilter::class, properties: ['trustee' => 'exact', 'vigik' => 'exact', 'transmitter' => 'exact'])]
#[ApiFilter(NotEqualFilter::class, properties: ["id"])]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    "id",
    "reference",
    "vigik",
    "transmitter",
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
    #[Groups(["properties:read", "property:read", "letterbox:read"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "command:read", "invoices:read", "tour:read", "letterbox:read"])]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "command:read"])]
    private ?string $address = null;

    #[ORM\Column(length: 5)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "command:read"])]
    private ?string $postcode = null;

    #[ORM\Column(length: 255)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "command:read"])]
    private ?string $city = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["property:read", "property:write", "commands:read", "command:read"])]
    private ?string $contactName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["property:read", "property:write", "commands:read", "command:read"])]
    private ?string $contactPhone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "command:read", "tour:read"])]
    private ?string $zone = null;

    #[ORM\ManyToOne(inversedBy: 'properties')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["properties:read", "property:read", "property:write"])]
    private ?Trustee $trustee = null;

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: PropertyService::class, orphanRemoval: true)]
    #[Groups(["property:read", "property:write", "commands:read", "command:read"])]
    private Collection $services;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(["property:read", "property:write", "commands:read", "command:read"])]
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
    #[Groups(["property:read", "property:write", "commands:read", "command:read"])]
    private array $accesses = [];

    #[ORM\Column(length: 255)]
    #[Groups(["properties:read", "property:read", "property:write"])]
    private ?string $reference = null;

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: Invoice::class)]
    private Collection $invoices;

    #[ORM\Column(nullable: true)]
    #[Groups(["properties:read", "property:read", "property:write"])]
    private array $entrances = [];

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "command:read"])]
    private ?string $digicode = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "command:read"])]
    private ?string $vigik = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "command:read"])]
    private ?string $transmitter = null;

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: Letterbox::class)]
    #[Groups(["properties:read", "property:read", "property:write", "commands:read", "command:read"])]
    private Collection $letterboxes;



    public function __construct()
    {
        $this->services = new ArrayCollection();
        $this->commands = new ArrayCollection();
        $this->contacts = new ArrayCollection();
        $this->invoices = new ArrayCollection();
        $this->letterboxes = new ArrayCollection();
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
            return (20);
        } else {
            return (10);
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

    public function getEntrances(): array
    {
        return $this->entrances;
    }

    public function setEntrances(?array $entrances): self
    {
        $this->entrances = $entrances;

        return $this;
    }

    public function getDigicode(): ?string
    {
        return $this->digicode;
    }

    public function setDigicode(?string $digicode): self
    {
        $this->digicode = $digicode;
        return $this;
    }

    public function getVigik(): ?string
    {
        return $this->vigik;
    }

    public function setVigik(?string $vigik): self
    {
        if ($vigik === "") {
            $this->vigik = null;
            return $this;
        }
        $this->vigik = $vigik;
        return $this;
    }

    public function getTransmitter(): ?string
    {
        return $this->transmitter;
    }

    public function setTransmitter(?string $transmitter): self
    {
        if ($transmitter === "") {
            $this->transmitter = null;
            return $this;
        }
        $this->transmitter = $transmitter;

        return $this;
    }

    /**
     * @return Collection<int, Letterbox>
     */
    public function getLetterboxes(): Collection
    {
        return $this->letterboxes;
    }

    public function addLetterbox(Letterbox $letterbox): self
    {
        if (!$this->letterboxes->contains($letterbox)) {
            $this->letterboxes->add($letterbox);
            $letterbox->setProperty($this);
        }

        return $this;
    }

    public function removeLetterbox(Letterbox $letterbox): self
    {
        if ($this->letterboxes->removeElement($letterbox)) {
            // set the owning side to null (unless already changed)
            if ($letterbox->getProperty() === $this) {
                $letterbox->setProperty(null);
            }
        }

        return $this;
    }
}
