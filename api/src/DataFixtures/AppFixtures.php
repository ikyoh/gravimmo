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

        $serviceA = new Service();
        $serviceA->setTitle("Plaque boîtes à lettres")
            ->setCategory("Gravure")
            ->setMaterial(["Gravoply 1mm", "Gravoply 0.8mm"])
            ->setFinishing(["Double Face", "Chanfrein"])
            ->setColor(["Noir / Blanc", "Blanc / Noir"])
            ->setConfiguration("#Plaque BAL")
            ->setPrice(5.50);
        $manager->persist($serviceA);

        $serviceB = new Service();
        $serviceB->setTitle("Plaque parlophone")
            ->setCategory("Gravure")
            ->setMaterial(["Gravoply 1mm", "Gravoply 0.8mm"])
            ->setFinishing(["Double Face", "Chanfrein"])
            ->setColor(["Noir / Blanc", "Blanc / Noir"])
            ->setConfiguration("#Plaque Parlophone")
            ->setPrice(5.50);
        $manager->persist($serviceB);
        $manager->persist($serviceB);

        $serviceC = new Service();
        $serviceC->setTitle("Pose")
            ->setCategory("Pose")
            ->setPrice(4.20);
        $manager->persist($serviceC);

        $serviceD = new Service();
        $serviceD->setTitle("Pose hors secteur")
            ->setCategory("Pose")
            ->setPrice(2.20);
        $manager->persist($serviceD);

        $serviceE = new Service();
        $serviceE->setTitle("Cache pour boîte à lettre")
            ->setCategory("Fourniture")
            ->setPrice(7.10);
        $manager->persist($serviceE);

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
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06300")
                        ->setCity($faker->city)
                        ->setTva(20.00)
                        ->addContact($user)
                        ->setZone("Nice Est")
                        ->setTrustee($trustee)
                        ->setAccessType("VIGIK")
                        ->setAccessCode("1234A")
                        ->setParams(["numeroetage"])
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
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06200")
                        ->setCity($faker->city)
                        ->setTva(20.00)
                        ->addContact($user)
                        ->setZone("Nice Ouest")
                        ->setTrustee($trustee)
                        ->setAccessType("VIGIK")
                        ->setAccessCode("1234A")
                        ->setParams(["numeroetage"])
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
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06100")
                        ->setCity($faker->city)
                        ->setTva(20.00)
                        ->addContact($user)
                        ->setZone("Nice Nord")
                        ->setTrustee($trustee)
                        ->setAccessType("VIGIK")
                        ->setAccessCode("1234A")
                        ->setParams(["numeroetage"])
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
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06000")
                        ->setCity($faker->city)
                        ->setTva(20.00)
                        ->addContact($user)
                        ->setZone("Nice Centre")
                        ->setTrustee($trustee)
                        ->setAccessType("VIGIK")
                        ->setAccessCode("1234A")
                        ->setParams(["numeroetage"])
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
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06730")
                        ->setCity($faker->city)
                        ->setTva(20.00)
                        ->addContact($user)
                        ->setZone("Autre")
                        ->setTrustee($trustee)
                        ->setAccessType("VIGIK")
                        ->setAccessCode("1234A")
                        ->setParams(["numeroetage"])
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
