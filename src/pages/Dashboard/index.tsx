import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repos, Error } from './styles';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import logo from '../../assets/logo.svg';

interface GithubRepository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [repos, setRepos] = React.useState<GithubRepository[]>(() => {
    const storageRepos = localStorage.getItem('@GitColletion:repositories');

    if (storageRepos) {
      return JSON.parse(storageRepos);
    }
    return [];
  });
  const [newRepo, setNewRepo] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const [errorState, setErrorState] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem('@GitColletion:repositories', JSON.stringify(repos));
  }, [repos]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNewRepo(event.target.value);
  };

  const handleAddRepo = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!newRepo && !errorState) {
      setErrorState(true);
      setInputError('Informe o username/repositório');
      return;
    }
    try {
      const response = await api.get<GithubRepository>(`repos/${newRepo}`);

      const repository = response.data;
      setRepos([...repos, repository]);
      setNewRepo('');
      setErrorState(false);
      setInputError('');
    } catch {
      setErrorState(true);
      setInputError('Repositório não encontrado no Github');
    }
  };

  return (
    <>
      <img src={logo} alt="Git Collection image" />
      <Title>Catálogo de repositórios do Github</Title>

      <Form hasError={errorState} onSubmit={handleAddRepo}>
        <input
          type="text"
          value={newRepo}
          placeholder="username/repository_name"
          onChange={handleChange}
        />
        <button type="submit">Buscar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repos>
        {repos.map((repository, index) => (
          <Link
            to={`repositories/${repository.full_name}`}
            key={repository.full_name + index}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repos>
    </>
  );
};

export default Dashboard;
