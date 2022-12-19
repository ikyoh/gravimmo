<?php

namespace App\DataFixtures;

use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use App\Entity\Trustee;
use App\Entity\User;
use App\Entity\Property;
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

        for ($i = 0; $i < 50; $i++) {

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

            for ($j = 0; $j < 5; $j++) {
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
                for ($k = 0; $k < 4; $k++) {
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
                        ->setParams(["N° d'appartement", "N° d'étage"])
                        ->setContactName($faker->name)
                        ->setContactPhone($faker->phoneNumber);
                    $manager->persist($property);
                }
                for ($k = 0; $k < 4; $k++) {
                    $property = new Property();
                    $property->setTitle($faker->company)
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06300")
                        ->setCity($faker->city)
                        ->setTva(20.00)
                        ->addContact($user)
                        ->setZone("Nice Ouest")
                        ->setTrustee($trustee)
                        ->setAccessType("VIGIK")
                        ->setAccessCode("1234A")
                        ->setParams(["N° d'appartement", "N° d'étage"])
                        ->setContactName($faker->name)
                        ->setContactPhone($faker->phoneNumber);
                    $manager->persist($property);
                }
                for ($k = 0; $k < 4; $k++) {
                    $property = new Property();
                    $property->setTitle($faker->company)
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06300")
                        ->setCity($faker->city)
                        ->setTva(20.00)
                        ->addContact($user)
                        ->setZone("Nice Nord")
                        ->setTrustee($trustee)
                        ->setAccessType("VIGIK")
                        ->setAccessCode("1234A")
                        ->setParams(["N° d'appartement", "N° d'étage"])
                        ->setContactName($faker->name)
                        ->setContactPhone($faker->phoneNumber);
                    $manager->persist($property);
                }
                for ($k = 0; $k < 4; $k++) {
                    $property = new Property();
                    $property->setTitle($faker->company)
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06300")
                        ->setCity($faker->city)
                        ->setTva(20.00)
                        ->addContact($user)
                        ->setZone("Nice Centre")
                        ->setTrustee($trustee)
                        ->setAccessType("VIGIK")
                        ->setAccessCode("1234A")
                        ->setParams(["N° d'appartement", "N° d'étage"])
                        ->setContactName($faker->name)
                        ->setContactPhone($faker->phoneNumber);
                    $manager->persist($property);
                }
                for ($k = 0; $k < 4; $k++) {
                    $property = new Property();
                    $property->setTitle($faker->company)
                        ->setAddress($faker->streetAddress)
                        ->setPostcode("06300")
                        ->setCity($faker->city)
                        ->setTva(20.00)
                        ->addContact($user)
                        ->setZone("Autre")
                        ->setTrustee($trustee)
                        ->setAccessType("VIGIK")
                        ->setAccessCode("1234A")
                        ->setParams(["N° d'appartement", "N° d'étage"])
                        ->setContactName($faker->name)
                        ->setContactPhone($faker->phoneNumber);
                    $manager->persist($property);
                }
            }
        }

        $manager->flush();
    }
}
