<?php

namespace App\DataFixtures;

use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use App\Entity\Trustee;
use App\Entity\User;
use App\Entity\Property;
use App\Entity\Service;
use App\Entity\PropertyService;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker;


class AppFixtures extends Fixture
{

    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {

        $faker = Faker\Factory::create('fr_FR');
        $user = new User();
        $hasher = $this->hasher->hashPassword($user, "password");


        $user = new User();
        $user->setFirstname("Administrateur")
            ->setLastname("Gravimmo")
            ->setTitle("Administrateur")
            ->setEmail("admin@user.com")
            ->setPhone("0612111748")
            ->setRoles(['ROLE_ADMINISTRATOR'])
            ->setPassword($hasher)
            ->setIsActive(true);
        $manager->persist($user);

        $user = new User();
        $user->setFirstname("Atelier")
            ->setLastname("Gravimmo")
            ->setTitle("Atelier")
            ->setEmail("workshop@user.com")
            ->setPhone("0612111722")
            ->setRoles(['ROLE_WORKSHOP'])
            ->setPassword($hasher)
            ->setIsActive(true);
        $manager->persist($user);

        $user = new User();
        $user->setFirstname("Steven")
            ->setLastname("Patrosso")
            ->setTitle("Poseur")
            ->setEmail("steven@user.com")
            ->setPhone("0612111701")
            ->setRoles(['ROLE_INSTALLER'])
            ->setPassword($hasher)
            ->setIsActive(true);
        $manager->persist($user);

        $user = new User();
        $user->setFirstname("Serge")
            ->setLastname("Patrosso")
            ->setTitle("Poseur")
            ->setEmail("serge@user.com")
            ->setPhone("0612111701")
            ->setRoles(['ROLE_INSTALLER'])
            ->setPassword($hasher)
            ->setIsActive(true);
        $manager->persist($user);


        $serviceA = new Service();
        $serviceA->setTitle("Etiquette boîtes aux lettres")
            ->setInvoiceTitle("Etiquette boîtes aux lettres")
            ->setCategory("Gravure")
            ->setMaterial(["Gravoply 1mm", "Gravoply 0.8mm"])
            ->setFinishing(["Double Face", "Chanfrein"])
            ->setColor(["Noir / Blanc", "Blanc / Noir"])
            ->setConfiguration("#Plaque BAL")
            ->setReference("gB")
            ->setPrice(5.50);
        $manager->persist($serviceA);

        $serviceB = new Service();
        $serviceB->setTitle("Plaque parlophone")
            ->setInvoiceTitle("Etiquette parlophone")
            ->setCategory("Gravure")
            ->setMaterial(["Gravoply 1mm", "Gravoply 0.8mm"])
            ->setFinishing(["Double Face", "Chanfrein"])
            ->setColor(["Noir / Blanc", "Blanc / Noir"])
            ->setConfiguration("#Plaque Parlophone")
            ->setReference("gP")
            ->setPrice(5.50);
        $manager->persist($serviceB);
        $manager->persist($serviceB);

        $serviceC = new Service();
        $serviceC->setTitle("Pose")
            ->setCategory("Pose")
            ->setReference("pP")
            ->setPrice(4.20);
        $manager->persist($serviceC);

        $serviceD = new Service();
        $serviceD->setTitle("Pose hors secteur")
            ->setCategory("Pose")
            ->setPrice(2.20)
            ->setReference("pHS");
        $manager->persist($serviceD);

        $serviceE = new Service();
        $serviceE->setTitle("Porte étiquette boîte à lettres")
            ->setInvoiceTitle("Porte étiquette boîte à lettres")
            ->setCategory("Fourniture")
            ->setReference("fPeBAL")
            ->setPrice(7.10);
        $manager->persist($serviceE);

        $serviceF = new Service();
        $serviceF->setTitle("Porte étiquette parlophone")
            ->setInvoiceTitle("Porte étiquette parlophone")
            ->setCategory("Fourniture")
            ->setReference("fPeP")
            ->setPrice(7.10);
        $manager->persist($serviceF);

        $serviceG = new Service();
        $serviceG->setTitle("Visserie")
            ->setInvoiceTitle("Visserie")
            ->setCategory("Quincaillerie")
            ->setReference("qV")
            ->setPrice(7.10);
        $manager->persist($serviceG);

        $serviceH = new Service();
        $serviceH->setTitle("Envoie colis")
            ->setInvoiceTitle("Envoie colis")
            ->setCategory("Livraison")
            ->setPrice(5.50)
            ->setReference("lEC");
        $manager->persist($serviceH);

        for ($i = 0; $i < 25; $i++) {

            $trustee = new Trustee();
            $trustee->setTitle($faker->company)
                ->setAddress($faker->streetAddress)
                ->setPostcode($faker->postcode)
                ->setCity($faker->city)
                ->setEmail($faker->email)
                ->setBillingEmail($faker->email)
                ->setColor($faker->hexcolor)
                ->setColor2($faker->hexcolor)
                ->setReference("syn" . $i)
                ->setPhone($faker->phoneNumber);
            $manager->persist($trustee);

            for ($j = 0; $j < 3; $j++) {

                $user = new User();
                $user->setFirstname($faker->firstName)
                    ->setLastname($faker->lastName)
                    ->setTitle("Gestionnaire")
                    ->setEmail($faker->email)
                    ->setPhone($faker->phoneNumber)
                    ->setRoles(['ROLE_USER'])
                    ->setTrustee($trustee)
                    ->setPassword($hasher);
                $manager->persist($user);

                for ($k = 0; $k < 3; $k++) {

                    $property = new Property();
                    $property->setTitle($faker->company)
                        ->setReference("proA" . $i)
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06300")
                        ->setCity($faker->city)
                        ->addContact($user)
                        ->setZone("Nice Est")
                        ->setTrustee($trustee)
                        ->setAccesses(["VIGIK : 1234A"])
                        ->setParams(["numeroetage"])
                        ->setDeliveredAt($faker->dateTime())
                        ->setContactName($faker->name)
                        ->setContactPhone($faker->phoneNumber);
                    $manager->persist($property);

                    $propertysServiceA = new PropertyService();
                    $propertysServiceA->setProperty($property)
                        ->setService($serviceA)
                        ->setColor("Blanc / Noir")
                        ->setConfiguration("#BAL")
                        ->setMaterial("Gravoply 1mm");
                    $manager->persist($propertysServiceA);

                    $propertysServiceB = new PropertyService();
                    $propertysServiceB->setProperty($property)
                        ->setService($serviceB)
                        ->setColor("Blanc / Noir")
                        ->setConfiguration("#Parlo")
                        ->setMaterial("Gravoply 1mm");
                    $manager->persist($propertysServiceB);

                    $propertysServiceC = new PropertyService();
                    $propertysServiceC->setProperty($property)
                        ->setService($serviceC);
                    $manager->persist($propertysServiceC);
                }
                for ($k = 0; $k < 3; $k++) {

                    $property = new Property();
                    $property->setTitle($faker->company)
                        ->setReference("proB" . $i)
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06200")
                        ->setCity($faker->city)
                        ->addContact($user)
                        ->setZone("Nice Ouest")
                        ->setTrustee($trustee)
                        ->setAccesses(["VIGIK : 1234A"])
                        ->setParams(["numeroetage"])
                        ->setDeliveredAt($faker->dateTime())
                        ->setContactName($faker->name)
                        ->setContactPhone($faker->phoneNumber);
                    $manager->persist($property);

                    $propertysServiceA = new PropertyService();
                    $propertysServiceA->setProperty($property)
                        ->setService($serviceA)
                        ->setColor("Blanc / Noir")
                        ->setConfiguration("#BAL")
                        ->setMaterial("Gravoply 1mm");
                    $manager->persist($propertysServiceA);

                    $propertysServiceB = new PropertyService();
                    $propertysServiceB->setProperty($property)
                        ->setService($serviceB)
                        ->setColor("Blanc / Noir")
                        ->setConfiguration("#Parlo")
                        ->setMaterial("Gravoply 1mm");
                    $manager->persist($propertysServiceB);

                    $propertysServiceC = new PropertyService();
                    $propertysServiceC->setProperty($property)
                        ->setService($serviceC);
                    $manager->persist($propertysServiceC);
                }

                for ($k = 0; $k < 3; $k++) {
                    $property = new Property();
                    $property->setTitle($faker->company)
                        ->setReference("proC" . $i)
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06100")
                        ->setCity($faker->city)
                        ->addContact($user)
                        ->setZone("Nice Nord")
                        ->setTrustee($trustee)
                        ->setAccesses(["VIGIK : 1234A"])
                        ->setParams(["numeroetage"])
                        ->setDeliveredAt($faker->dateTime())
                        ->setContactName($faker->name)
                        ->setContactPhone($faker->phoneNumber);
                    $manager->persist($property);

                    $propertysServiceA = new PropertyService();
                    $propertysServiceA->setProperty($property)
                        ->setService($serviceA)
                        ->setColor("Blanc / Noir")
                        ->setConfiguration("#BAL")
                        ->setMaterial("Gravoply 1mm");
                    $manager->persist($propertysServiceA);

                    $propertysServiceB = new PropertyService();
                    $propertysServiceB->setProperty($property)
                        ->setService($serviceB)
                        ->setColor("Blanc / Noir")
                        ->setConfiguration("#Parlo")
                        ->setMaterial("Gravoply 1mm");
                    $manager->persist($propertysServiceB);

                    $propertysServiceC = new PropertyService();
                    $propertysServiceC->setProperty($property)
                        ->setService($serviceC);
                    $manager->persist($propertysServiceC);
                }
                for ($k = 0; $k < 3; $k++) {
                    $property = new Property();
                    $property->setTitle($faker->company)
                        ->setReference("proD" . $i)
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06000")
                        ->setCity($faker->city)
                        ->addContact($user)
                        ->setZone("Nice Centre")
                        ->setTrustee($trustee)
                        ->setAccesses(["VIGIK : 1234A"])
                        ->setParams(["numeroetage"])
                        ->setDeliveredAt($faker->dateTime())
                        ->setContactName($faker->name)
                        ->setContactPhone($faker->phoneNumber);
                    $manager->persist($property);

                    $propertysServiceA = new PropertyService();
                    $propertysServiceA->setProperty($property)
                        ->setService($serviceA)
                        ->setColor("Blanc / Noir")
                        ->setConfiguration("#BAL")
                        ->setMaterial("Gravoply 1mm");
                    $manager->persist($propertysServiceA);

                    $propertysServiceB = new PropertyService();
                    $propertysServiceB->setProperty($property)
                        ->setService($serviceB)
                        ->setColor("Blanc / Noir")
                        ->setConfiguration("#Parlo")
                        ->setMaterial("Gravoply 1mm");
                    $manager->persist($propertysServiceB);

                    $propertysServiceC = new PropertyService();
                    $propertysServiceC->setProperty($property)
                        ->setService($serviceC);
                    $manager->persist($propertysServiceC);
                }
                for ($k = 0; $k < 3; $k++) {
                    $property = new Property();
                    $property->setTitle($faker->company)
                        ->setReference("proE" . $i)
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06730")
                        ->setCity($faker->city)
                        ->addContact($user)
                        ->setZone("Autre")
                        ->setTrustee($trustee)
                        ->setAccesses(["VIGIK : 1234A"])
                        ->setParams(["numeroetage"])
                        ->setDeliveredAt($faker->dateTime())
                        ->setContactName($faker->name)
                        ->setContactPhone($faker->phoneNumber);
                    $manager->persist($property);

                    $propertysServiceA = new PropertyService();
                    $propertysServiceA->setProperty($property)
                        ->setService($serviceA)
                        ->setColor("Blanc / Noir")
                        ->setConfiguration("#BAL")
                        ->setMaterial("Gravoply 1mm");
                    $manager->persist($propertysServiceA);

                    $propertysServiceB = new PropertyService();
                    $propertysServiceB->setProperty($property)
                        ->setService($serviceB)
                        ->setColor("Blanc / Noir")
                        ->setConfiguration("#Parlo")
                        ->setMaterial("Gravoply 1mm");
                    $manager->persist($propertysServiceB);

                    $propertysServiceC = new PropertyService();
                    $propertysServiceC->setProperty($property)
                        ->setService($serviceD);
                    $manager->persist($propertysServiceC);
                }
            }
        }

        $manager->flush();
    }
}
