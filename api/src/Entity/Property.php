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
#[ApiFilter(OrderFilter::class, properties: ['id', 'title', 'postcode', 'city', 'zone', 'trustee.title'])]
#[ApiFilter(SearchFilter::class, properties: ['trustee' => 'exact'])]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    "id",
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
    #[Groups(["properties:read", "property:read", "property:write", "orders:read"])]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    #[Groups(["properties:read", "property:read", "property:write", "orders:read"])]
    private ?string $address = null;

    #[ORM\Column(length: 5)]
    #[Groups(["properties:read", "property:read", "property:write", "orders:read"])]
    private ?string $postcode = null;

    #[ORM\Column(length: 255)]
    #[Groups(["properties:read", "property:read", "property:write", "orders:read"])]
    private ?string $city = null;

    #[ORM\Column]
    #[Groups(["property:read", "property:write"])]
    private ?float $tva = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["property:read", "property:write", "orders:read"])]
    private ?string $contactName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["property:read", "property:write", "orders:read"])]
    private ?string $contactPhone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["properties:read", "property:read", "property:write", "orders:read"])]
    private ?string $zone = null;

    #[ORM\ManyToOne(inversedBy: 'properties')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["properties:read", "property:read", "property:write"])]
    private ?Trustee $trustee = null;

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: PropertyService::class, orphanRemoval: true)]
    #[Groups(["property:read", "property:write", "orders:read"])]
    private Collection $services;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(["property:read", "property:write", "orders:read"])]
    private $params = [];

    #[ORM\Column(length: 255)]
    #[Groups(["property:read", "property:write", "orders:read"])]
    private ?string $accessType = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["property:read", "property:write", "orders:read"])]
    private ?string $accessCode = null;

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: Order::class)]
    private Collection $orders;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'properties')]
    #[Groups(["property:read", "property:write"])]
    private Collection $contacts;


    public function __construct()
    {
        $this->services = new ArrayCollection();
        $this->orders = new ArrayCollection();
        $this->contacts = new ArrayCollection();
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

    public function getTva(): ?float
    {
        return $this->tva;
    }

    public function setTva(float $tva): self
    {
        $this->tva = $tva;

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

    public function getAccessType(): ?string
    {
        return $this->accessType;
    }

    public function setAccessType(string $accessType): self
    {
        $this->accessType = $accessType;

        return $this;
    }

    public function getAccessCode(): ?string
    {
        return $this->accessCode;
    }

    public function setAccessCode(?string $accessCode): self
    {
        $this->accessCode = $accessCode;

        return $this;
    }

    /**
     * @return Collection<int, Order>
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }

    public function addOrder(Order $order): self
    {
        if (!$this->orders->contains($order)) {
            $this->orders->add($order);
            $order->setProperty($this);
        }

        return $this;
    }

    public function removeOrder(Order $order): self
    {
        if ($this->orders->removeElement($order)) {
            // set the owning side to null (unless already changed)
            if ($order->getProperty() === $this) {
                $order->setProperty(null);
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
}
