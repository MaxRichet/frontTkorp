"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { gql } from '@apollo/client';
import client from '../../lib/apolloClient';
import Link from 'next/link';
import Image from 'next/image';

type Person = {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
};

const GET_PERSON_BY_ID = gql`
    query findPersonById($id: Int!) {
        findPersonById(id: $id) {
            id
            lastName
            firstName
            email
            phoneNumber
        }
    }
`;

const PersonPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      if (!id) return;

      const personId = Array.isArray(id) ? id[0] : id;
      
      try {
        const parsedId = parseInt(personId, 10);
        if (isNaN(parsedId)) {
            console.error('Invalid ID:', id);
            return;
        }
        const { data } = await client.query({
            query: GET_PERSON_BY_ID,
            variables: { id: parsedId },
        });

        setPerson(data.findPersonById);
      } catch (error) {
        console.error("Error fetching person data:", error);
      }
    };

    fetchPerson();
  }, [id]);

  if (!person) {
    return <div>Erreur lors du chargement des informations de la personne.</div>;
  }

  return (
    <div className="return">
        <Link  href={`/person`}>&lt;retour</Link>
        <div className="card">
            <figure>
                <Image src="/img/avatar.jpg" alt="avatar" width={150} height={150} priority />
            </figure>
            <div className="infos">
                <h1>{person.firstName} {person.lastName}</h1>
                <p><span>Adresse email :</span> {person.email}</p>
                <p><span>Numéro de téléphone :</span> {person.phoneNumber}</p>
            </div>
        </div>
    </div>
  );
};

export default PersonPage;