import React, { createContext, useState, useRef } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {

    // Referência para o campo de entrada do nome do herói
    const nameInputRef = useRef(null);
    const attrInputRef = useRef(null);
    // useState essenciais
    const [inputSearch, setInputSearch] = useState('');
    const [selectedAttribute, setSelectedAttribute] = useState('');
    const [originalData, setOriginalData] = useState([]);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    // useState para o usuário só poder escolher por herói OU por atributo
    const [isHeroChecked, setIsHeroChecked] = useState(true);
    const [isHeroSearchDisabled, setIsHeroSearchDisabled] = useState(false);
    const [isHeroButtonDisabled, setIsHeroButtonDisabled] = useState(false);
    const [isAttrChecked, setIsAttrChecked] = useState(false);
    const [isAttrSearchDisabled, setIsAttrSearchDisabled] = useState(true);
    const [isAttrButtonDisabled, setIsAttrButtonDisabled] = useState(true);

    // Bloco para paginação
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const handleInputKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        fetchData();
      }
    };
  
    // Quando clicar em pesquisar por herói, dar disable em todos os componentes no de atributo
    const handleHeroChecked = () => {
      setIsHeroChecked(true);
      setIsAttrChecked(false);
      setIsHeroSearchDisabled(false);
      setIsHeroButtonDisabled(false);
      setIsAttrSearchDisabled(true);
      setIsAttrButtonDisabled(true);
    }
  
    // Quando clicar em pesquisar por atributo, dar disable em todos os componentes no de herói
    const handleAttrChecked = () => {
      setInputSearch('');
      setError(null);
      setIsHeroChecked(false);
      setIsAttrChecked(true);
      setIsAttrSearchDisabled(false);
      setIsAttrButtonDisabled(false);
      setIsHeroSearchDisabled(true);
      setIsHeroButtonDisabled(true);
    }
  
    // Função para buscar dados com base na pesquisa por herói
    const fetchData = () => {
      if(inputSearch.length < 2){
        setError('No mínimo 2 caracteres têm que ser digitado');
        setData(originalData);
      } else {
        fetch('https://api.opendota.com/api/heroStats')
          .then(resp => resp.json())
          .then(data => {
            setError(null);
            const formattedSearch = inputSearch.charAt(0).toUpperCase() + inputSearch.slice(1).toLowerCase();
            // Filtra os dados com base em inputSearch
            const filteredData = data.filter(hero => hero.localized_name.includes(formattedSearch));
            if(filteredData.length === 0){
              setError('Nenhum herói com essas letras foi encontrado');
              setData(originalData);
              return
            }
            setData(filteredData);
          })
          .catch(err => {
            console.log('Error: ', err);
          });
      }
    };
  
    // Função para buscar dados com base na pesquisa por atributo
    const fetchDataAttr = () => {
      fetch('https://api.opendota.com/api/heroStats')
        .then(resp => resp.json())
        .then(data => {
          if(selectedAttribute === '-'){
            setData(originalData);
            return
          }
          const filteredData = data.filter(attr => attr.primary_attr.includes(selectedAttribute));
          setData(filteredData);
        })
        .catch(err => {
          console.log('Error: ', err);
        });
    }

  return (
    <DataContext.Provider value={{ setData,
        setOriginalData,
        setInputSearch,
        setSelectedAttribute,
        isHeroChecked,
        isHeroSearchDisabled,
        isAttrChecked,
        isAttrSearchDisabled,
        isHeroButtonDisabled,
        isAttrButtonDisabled,
        handleHeroChecked,
        handleInputKeyPress,
        handleAttrChecked,
        fetchData,
        fetchDataAttr,
        inputSearch,
        data,
        error,
        paginate,
        currentPage,
        itemsPerPage,
        currentItems,
        nameInputRef,
        attrInputRef }}>
      {children}
    </DataContext.Provider>
  );
}