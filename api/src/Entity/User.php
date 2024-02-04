<?php

namespace App\Entity;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use App\Filter\MultipleFieldsSearchFilter;
use App\Repository\UserRepository;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use App\EntityListener\UserListener;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Controller\AppUsersController;
use App\Controller\CurrentUserController;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\EntityListeners([UserListener::class])]
#[ApiResource(
    normalizationContext: ['groups' => ['users:read']],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['user:read']]),
        new Put(),
        new Post(),
        new Get(
            name: 'currentUser',
            uriTemplate: '/current_user',
            paginationEnabled: false,
            controller: CurrentUserController::class,
            read: false,
            security: "is_granted('ROLE_USER')"
        ),
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['id', 'title', 'lastname', 'email', 'phone', 'trustee.title', 'isActive'])]
#[ApiFilter(SearchFilter::class, properties: ['trustee' => 'exact', 'roles' => 'partial'])]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    "id",
    "email",
    "firstname",
    "lastname",
    "phone",
    "title",
    "trustee.title",
])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["users:read", "user:read"])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(["users:read", "user:read"])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(["users:read", "user:read", "user:write"])]
    private array $roles = [];

    private ?string $plainPassword = null;

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(["users:read", "user:write"])]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(["users:read", "user:read", "tours:read", "tour:read", "commands:read", "command:read"])]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups(["users:read", "user:read", "tours:read", "tour:read", "commands:read", "command:read"])]
    private ?string $lastname = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["users:read", "user:read"])]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    #[Groups(["users:read", "user:read"])]
    private ?string $phone = null;

    #[ORM\ManyToOne(inversedBy: 'contacts')]
    #[Groups(["users:read", "user:read"])]
    private ?Trustee $trustee = null;

    #[ORM\ManyToMany(targetEntity: Property::class, mappedBy: 'contacts')]
    #[Groups(["users:read", "user:read"])]
    private Collection $properties;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Tour::class, orphanRemoval: true)]
    private Collection $tours;

    #[ORM\Column]
    #[Groups(["users:read", "user:read", "user:write"])]
    private ?bool $isActive = true;

    public function __construct()
    {
        $this->properties = new ArrayCollection();
        $this->tours = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get the value of plainPassword
     */
    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    /**
     * Set the value of plainPassword
     *
     * @return  self
     */
    public function setPlainPassword($plainPassword)
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }


    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): self
    {
        $this->phone = $phone;

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
     * @return Collection<int, Property>
     */
    public function getProperties(): Collection
    {
        return $this->properties;
    }

    public function addProperty(Property $property): self
    {
        if (!$this->properties->contains($property)) {
            $this->properties->add($property);
            $property->addContact($this);
        }

        return $this;
    }

    public function removeProperty(Property $property): self
    {
        if ($this->properties->removeElement($property)) {
            $property->removeContact($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Tour>
     */
    public function getTours(): Collection
    {
        return $this->tours;
    }

    public function addTour(Tour $tour): self
    {
        if (!$this->tours->contains($tour)) {
            $this->tours->add($tour);
            $tour->setUser($this);
        }

        return $this;
    }

    public function removeTour(Tour $tour): self
    {
        if ($this->tours->removeElement($tour)) {
            // set the owning side to null (unless already changed)
            if ($tour->getUser() === $this) {
                $tour->setUser(null);
            }
        }

        return $this;
    }

    public function isIsActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }
}
