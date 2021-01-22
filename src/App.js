import { API } from './api'
import useSWR from "swr";
import React, { useState, useEffect } from 'react';

import ReactTable from "react-table-6";
import "react-table-6/react-table.css"

//utilisation de swr pour plus flixiblité de fetching vous pouvez consulter mon article sur swr
//---> https://aboujaafar-othmane.medium.com/useswr-best-react-hook-fetch-library-7038ddbe9e3a
const fetcher = (...args) => fetch(...args).then((res) => res.json());



function App() {
  //instialisation et declaration
  const [dataCopy, setdataCopy] = useState();
  let categorys = [];
  const { data, error } = useSWR(API + '/products', fetcher, {
    revalidateOnFocus: false,
  });
  //afichage par categorie
  let filter = (e) => {
    const category = e.target.value;
    let productsFiltred = data?.products.filter((product) => product.category === category);
    setdataCopy(productsFiltred);
  }

  //filtrer et supprimer les redendance dans les categories
  data?.products.map((product) => {
    return categorys.indexOf(product.category) === -1 ? categorys.push(product.category) : -1;
  });
  let options = categorys.map((category) => {
    return <option key={category} value={category}>{category}</option>;
  });

  //copie de data pour le filtrage
  useEffect(() => {
    setdataCopy(data?.products);
  }, [data]);

  const columns = [
    {
      Header: "name",
      accessor: "name"
    },
    {
      Header: "Description",
      accessor: "description"
    }, {
      Header: "Model",
      accessor: "modelId"
    },
    {

      Header: "Image",
      Cell: porp => {
        return (
          <img alt="Produit" src={porp.original.thumbnail} width='180px' height='120px' />
        );
      },
    },
    {
      Header: "Action",
      Cell: porp => {
        return (
          <a style={{ margin: "40px" }} className='btn btn-primary text-center' rel="noreferrer" href={porp.original.link} target='_blank'>Plus</a>

        );
      },
      headerStyle: { textAlign: 'left' }

    }
  ]
  if (!data) return "I am loading...";
  if (error) return "there is an error";
  return (
    <div className="container">

      <div className="row">
        <div className="form-group col-4">
          <label htmlFor="exampleFormControlSelect1">Filtrer par categorie :</label>
          <select className="form-control" onChange={(e) => { filter(e) }}>
            {options}
          </select>
        </div>
      </div>


      <ReactTable
        columns={columns}
        data={dataCopy}
      >
      </ReactTable>
    </div>
  );
}

export default App;
