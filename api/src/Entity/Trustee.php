<?php

namespace App\Entity;

use App\Repository\TrusteeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: TrusteeRepository::class)]
#[UniqueEntity(
    fields: ['reference'],
    message: "Donnée déjà enregistrée dans la base",
)]
#[ApiResource(
    normalizationContext: ['groups' => ['trustees:read']],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['trustee:read']]),
        new Put(),
        new Post()
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['id', 'reference', 'title', 'postcode', 'city'])]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    "id",
    "title",
    "reference",
    "city",
])]
class Trustee
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["trustees:read", "trustee:read", "tour:read"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["trustees:read", "trustee:read", "users:read", "properties:read", "property:read", "commands:read", "invoices:read"])]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    #[Groups(["trustees:read", "trustee:read"])]
    private ?string $address = null;

    #[ORM\Column(length: 255)]
    #[Groups(["trustees:read", "trustee:read", "property:read"])]
    private ?string $postcode = null;

    #[ORM\Column(length: 255)]
    #[Groups(["trustees:read", "trustee:read", "property:read"])]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Groups(["trustees:read", "trustee:read"])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Groups(["trustees:read", "trustee:read"])]
    private ?string $billingEmail = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["trustees:read", "trustee:read"])]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["trustees:read", "trustee:read"])]
    private ?string $mobile = null;

    #[ORM\Column(length: 7, nullable: true)]
    #[Groups(["trustees:read", "trustee:read", "commands:read"])]
    private ?string $color = '#C00000';

    #[ORM\Column(length: 7, nullable: true)]
    #[Groups(["trustees:read", "trustee:read", "commands:read"])]
    private ?string $color2 = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["trustee:read", "property:read"])]
    private array $orderTag = [];

    #[ORM\OneToMany(mappedBy: 'trustee', targetEntity: User::class)]
    #[Groups(["trustee:read","property:read"])]
    private Collection $contacts;

    #[ORM\OneToMany(mappedBy: 'trustee', targetEntity: Property::class)]
    #[Groups(["trustee:read"])]
    private Collection $properties;

    #[ORM\OneToMany(mappedBy: 'trustee', targetEntity: Command::class)]
    private Collection $commands;

    #[ORM\Column(name: 'reference', type: 'string', length: 5, unique: true)]
    #[Groups(["trustees:read", "trustee:read", "users:read", "properties:read", "property:read", "commands:read", "command:read", "invoices:read", "invoice:read"])]
    private ?string $reference = null;

    #[ORM\OneToMany(mappedBy: 'trustee', targetEntity: Invoice::class)]
    private Collection $invoices;


    public function __construct()
    {
        $this->contacts = new ArrayCollection();
        $this->properties = new ArrayCollection();
        $this->commands = new ArrayCollection();
        $this->invoices = new ArrayCollection();
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getBillingEmail(): ?string
    {
        return $this->billingEmail;
    }

    public function setBillingEmail(string $billingEmail): self
    {
        $this->billingEmail = $billingEmail;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getMobile(): ?string
    {
        return $this->mobile;
    }

    public function setMobile(?string $mobile): self
    {
        $this->mobile = $mobile;

        return $this;
    }


    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(string $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function getColor2(): ?string
    {
        return $this->color2;
    }

    public function setColor2(?string $color2): self
    {
        $this->color2 = $color2;

        return $this;
    }

    public function getOrderTag(): array
    {
        return $this->orderTag;
    }

    public function setOrderTag(?array $orderTag): self
    {
        $this->orderTag = $orderTag;

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
            $contact->setTrustee($this);
        }

        return $this;
    }

    public function removeContact(User $contact): self
    {
        if ($this->contacts->removeElement($contact)) {
            // set the owning side to null (unless already changed)
            if ($contact->getTrustee() === $this) {
                $contact->setTrustee(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Property>
     */
    public function getProperties(): Collection
    {
        return $this->properties;
    }

    public function addProperties(Property $properties): self
    {
        if (!$this->properties->contains($properties)) {
            $this->properties->add($properties);
            $properties->setTrustee($this);
        }

        return $this;
    }

    public function removeProperties(Property $properties): self
    {
        if ($this->properties->removeElement($properties)) {
            // set the owning side to null (unless already changed)
            if ($properties->getTrustee() === $this) {
                $properties->setTrustee(null);
            }
        }

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
            $command->setTrustee($this);
        }

        return $this;
    }

    public function removeCommand(Command $command): self
    {
        if ($this->commands->removeElement($command)) {
            // set the owning side to null (unless already changed)
            if ($command->getTrustee() === $this) {
                $command->setTrustee(null);
            }
        }

        return $this;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): self
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
            $invoice->setTrusteeIri($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getTrusteeIri() === $this) {
                $invoice->setTrusteeIri(null);
            }
        }

        return $this;
    }

}
