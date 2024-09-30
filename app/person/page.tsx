"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import client from '../lib/apolloClient';
import '../styles/style.css';

type Person = {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
};

const GET_ALL_PERSONS = gql`
  query {
    findAllPerson {
      id
      lastName
      firstName
      email
      phoneNumber
    }
  }
`;

const PersonListPage = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [personsPerPage, setPersonsPerPage] = useState(5);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchPersons = async () => {
      const { data } = await client.query({
        query: GET_ALL_PERSONS,
      });
      setPersons(data.findAllPerson);
    };

    fetchPersons();
  }, []);

  useEffect(() => {
    const calculatePersonsPerPage = () => {
      const ulElement = ulRef.current;

      const burgerMenu = document.querySelector('.burgerMenu');
      const burgerHeight = burgerMenu ? burgerMenu.getBoundingClientRect().height : 0;

      if (ulElement) {
        const windowHeight = window.innerHeight;
        const availableHeight = windowHeight - burgerHeight;
        const personHeight = 70;
        
        const numberOfPersons = Math.floor(availableHeight / personHeight);
        setPersonsPerPage(numberOfPersons);
      }
    };

    calculatePersonsPerPage();

    window.addEventListener('resize', calculatePersonsPerPage);

    return () => {
      window.removeEventListener('resize', calculatePersonsPerPage);
    };
  }, []);

  const indexOfLastPerson = currentPage * personsPerPage;
  const indexOfFirstPerson = indexOfLastPerson - personsPerPage;
  const currentPersons = persons.slice(indexOfFirstPerson, indexOfLastPerson);

  const totalPages = Math.ceil(persons.length / personsPerPage);

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
      <h1>Liste des personnes</h1>
      <ul ref={ulRef}>
        {currentPersons.map((person) => (
          <li key={person.id} className='listLi'>
            <Link href={`/person/${person.id}`}>
              <div className='flex'>
                <p>
                  {person.firstName} {person.lastName}
                </p>
                <p>
                  voir plus
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

export default PersonListPage;