"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import client from '../lib/apolloClient';
import '../styles/style.css';

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

const GET_ALL_ANIMALS = gql`
  query {
    findAllAnimal {
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
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [animalsPerPage, setAnimalsPerPage] = useState(5);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      const { data } = await client.query({
        query: GET_ALL_ANIMALS,
      });
      setAnimals(data.findAllAnimal);
    };

    fetchAnimals();
  }, []);

  useEffect(() => {
    const calculateAnimalsPerPage = () => {
      const ulElement = ulRef.current;

      const burgerMenu = document.querySelector('.burgerMenu');
      const burgerHeight = burgerMenu ? burgerMenu.getBoundingClientRect().height : 0;

      if (ulElement) {
        const windowHeight = window.innerHeight;
        const availableHeight = windowHeight - burgerHeight;
        const animalHeight = 70;

        const numberOfAnimals = Math.floor(availableHeight / animalHeight);
        setAnimalsPerPage(numberOfAnimals);
      }
    };

    calculateAnimalsPerPage();

    window.addEventListener('resize', calculateAnimalsPerPage);

    return () => {
      window.removeEventListener('resize', calculateAnimalsPerPage);
    };
  }, []);

  const indexOfLastAnimal = currentPage * animalsPerPage;
  const indexOfFirstAnimal = indexOfLastAnimal - animalsPerPage;
  const currentAnimals = animals.slice(indexOfFirstAnimal, indexOfLastAnimal);

  const totalPages = Math.ceil(animals.length / animalsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='list'>
      <h1>Liste des animaux</h1>
      <ul ref={ulRef}>
        {currentAnimals.map((animal) => (
          <li key={animal.id} className='listLi'>
            <Link href={`/animal/${animal.id}`}>
              <div className='flex'>
                <p>
                  {animal.name} <span>{animal.species}</span>
                </p>
                <p>
                  Voir plus
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export default AnimalPage;
