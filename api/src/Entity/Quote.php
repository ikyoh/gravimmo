<?php

namespace App\Entity;

use NumberFormatter;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;

use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\QuoteRepository;

use ApiPlatform\Metadata\GetCollection;
use App\EntityListener\QuoteListener;
use App\Controller\PdfQuoteController;
use App\Filter\MultipleFieldsSearchFilter;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use Symfony\Component\Serializer\Annotation\Groups;


#[ORM\Entity(repositoryClass: QuoteRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['quotes:read']],
    denormalizationContext: ['groups' => ["quote:write"]],
    operations: [
        new GetCollection(),
        new Get(normalizationContext: ['groups' => ['quote:read']]),
        new Put(),
        new Post(),
        new Delete(),
        new Get(
            name: 'PdfQuote',
            uriTemplate: '/pdf/quote/{id}',
            controller: PdfQuoteController::class,
        ),
    ]
)]
#[ORM\EntityListeners([QuoteListener::class])]
#[ApiFilter(OrderFilter::class, properties: ['chrono', 'status', 'createdAt', 'amountHT', 'command.id', 'trusteeTitle', 'propertyTitle'])]
#[ApiFilter(SearchFilter::class, properties: ['status' => 'exact'])]
#[ApiFilter(DateFilter::class, properties: ['createdAt'])]
#[ApiFilter(BooleanFilter::class, properties: ['isSend'])]
#[ApiFilter(ExistsFilter::class, properties: ['refundReference'])]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    "chrono",
    "trusteeTitle",
    "propertyTitle",
    "customerTitle"
])]


class Quote
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["quotes:read", "quote:read", "commands:read"])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(["quotes:read", "quote:read"])]
    private ?\DateTimeImmutable $createdAt = null;

    // édité validé lettré
    #[ORM\Column(length: 255)]
    #[Groups(["quotes:read", "quote:read", "quote:write", "command:write"])]
    private ?string $status = null;

    #[ORM\Column]
    #[Groups(["quotes:read", "quote:read"])]
    private ?int $chrono = null;

    // #[ORM\OneToOne(inversedBy: 'quote')]
    // #[ORM\JoinColumn(nullable: true)]
    // #[Groups(["quotes:read", "quote:read", "quote:write"])]
    // private ?Command $command = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["quote:read", "quote:write"])]
    private array $content = [];

    #[ORM\Column(nullable: true)]
    #[Groups(["quotes:read", "quote:read", "quote:write"])]
    private ?string $trusteeTitle = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["quotes:read", "quote:read", "quote:write"])]
    private ?string $propertyTitle = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["quotes:read", "quote:read", "quote:write"])]
    private ?string $customerTitle = null;

    #[ORM\Column]
    #[Groups(["quotes:read", "quote:read", "quote:write"])]
    private ?float $tva = 10;

    #[ORM\Column]
    #[Groups(["quotes:read", "quote:read", "quote:write"])]
    private ?float $amountHT = null;

    #[ORM\Column]
    #[Groups(["quotes:read", "quote:read", "quote:write"])]
    private ?float $amountTTC = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["quotes:read", "quote:read", "quote:write"])]
    private ?int $refundReference = null;

    #[ORM\Column]
    #[Groups(["quotes:read", "quote:read", "quote:write"])]
    private ?bool $isSend = false;

    #[ORM\Column]
    #[Groups(["quotes:read", "quote:read", "quote:write"])]
    private ?bool $isRefund = false;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["quotes:read", "quote:read", "quote:write"])]
    private ?string $comment = null;

    // #[ORM\ManyToOne(inversedBy: 'quotes')]
    // #[Groups(["quotes:read", "quote:read", "quote:write"])]
    // private ?Trustee $trustee = null;

    // #[ORM\ManyToOne(inversedBy: 'quotes')]
    // #[Groups(["quotes:read", "quote:read", "quote:write"])]
    // private ?Customer $customer = null;
    
    // #[ORM\ManyToOne(inversedBy: 'quotes')]
    // #[Groups(["quotes:read", "quote:read", "quote:write"])]
    // private ?Property $property = null;


    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    #[Groups(["quotes:read", "quote:read"])]
    public function getFormattedAmountHT(): ?string
    {
        $fmt = numfmt_create( 'fr_FR', NumberFormatter::CURRENCY );
        return numfmt_format_currency($fmt, $this->amountHT, "EUR");
    }

    #[Groups(["quotes:read", "quote:read"])]
    public function getFormattedAmountTTC(): ?string
    {
        $fmt = numfmt_create( 'fr_FR', NumberFormatter::CURRENCY );
        return numfmt_format_currency($fmt, $this->amountTTC, "EUR");
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }

    public function getCommand(): ?Command
    {
        return $this->command;
    }

    public function setCommand(Command $command): self
    {
        $this->command = $command;

        return $this;
    }

    public function getContent(): array
    {
        return $this->content;
    }

    public function setContent(?array $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getTrusteeTitle(): ?string
    {
        return $this->trusteeTitle;
    }

    public function setTrusteeTitle(string $trusteeTitle): self
    {
        $this->trusteeTitle = $trusteeTitle;

        return $this;
    }

    public function getPropertyTitle(): ?string
    {
        return $this->propertyTitle;
    }

    public function setPropertyTitle(string $propertyTitle): self
    {
        $this->propertyTitle = $propertyTitle;

        return $this;
    }

    public function getCustomerTitle(): ?string
    {
        return $this->customerTitle;
    }

    public function setCustomerTitle(string $customerTitle): self
    {
        $this->customerTitle = $customerTitle;

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

    public function getAmountHT(): ?float
    {
        return $this->amountHT;
    }

    public function setAmountHT(float $amountHT): self
    {
        $this->amountHT = $amountHT;

        return $this;
    }

    public function getAmountTTC(): ?float
    {
        return $this->amountTTC;
    }

    public function setAmountTTC(float $amountTTC): self
    {
        $this->amountTTC = $amountTTC;

        return $this;
    }

    public function getRefundReference(): ?int
    {
        return $this->refundReference;
    }

    public function setRefundReference(?int $refundReference): self
    {
        $this->refundReference = $refundReference;

        return $this;
    }

    public function isIsSend(): ?bool
    {
        return $this->isSend;
    }

    public function setIsSend(bool $isSend): self
    {
        $this->isSend = $isSend;

        return $this;
    }

    public function isIsRefund(): ?bool
    {
        return $this->isRefund;
    }

    public function setIsRefund(bool $isRefund): self
    {
        $this->isRefund = $isRefund;

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

    public function getTrustee(): ?Trustee
    {
        return $this->trustee;
    }

    public function setTrustee(?Trustee $trustee): self
    {
        $this->trustee = $trustee;

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

    public function getProperty(): ?Property
    {
        return $this->property;
    }

    public function setProperty(?Property $property): self
    {
        $this->property = $property;

        return $this;
    }


}
