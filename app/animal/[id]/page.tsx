"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { gql } from '@apollo/client';
import client from '../../lib/apolloClient';
import Link from 'next/link';
import Image from 'next/image';

type Animal = {
  id: number;
  name: string;
  dateOfBirth: string;
  species: string;
  breed: string;
  color: string;
  weight: number;
  ownerId: number;
};

const GET_ANIMAL_BY_ID = gql`
    query findAnimalById($id: Int!) {
        findAnimalById(id: $id) {
            id
            name
            dateOfBirth
            species
            breed
            color
            weight
            ownerId
        }
    }
`;

const AnimalPage = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) return;

      const animalId = Array.isArray(id) ? id[0] : id;
      
      try {
        const parsedId = parseInt(animalId, 10);
        if (isNaN(parsedId)) {
            console.error('Invalid ID:', id);
            return;
        }
        const { data } = await client.query({
            query: GET_ANIMAL_BY_ID,
            variables: { id: parsedId },
        });

        setAnimal(data.findAnimalById);
      } catch (error) {
        console.error("Error fetching animal data:", error);
      }
    };

    fetchAnimal();
  }, [id]);

  if (!animal) {
    return <div>Erreur lors du chargement des informations de l'animal.</div>;
  }

  return (
    <div className="return">
        <Link  href={`/animal`}>&lt;retour</Link>
        <div className="card">
            <figure>
                <Image src="/img/animal.jpg" alt="animal" width={150} height={150} priority />
            </figure>
            <div className="infos">
                <h1>{animal.name}</h1>
                <p><span>Née le :</span> {animal.dateOfBirth}</p>
                <p><span>Espèce :</span> {animal.species}</p>
                <p><span>Race :</span> {animal.breed}</p>
                <p><span>Couleur :</span> {animal.color}</p>
                <p><span>Poids :</span> {animal.weight}</p>
            </div>
        </div>
    </div>
  );
};

export default AnimalPage;