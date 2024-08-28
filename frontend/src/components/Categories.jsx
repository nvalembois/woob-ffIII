import React, { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { DataGrid } from '@mui/x-data-grid';

const dtFmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeZone: 'Europe/Paris'});
const nbFmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export default function Categories() {

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const columns = [
    { field: 'id', headerName: 'ID', type: 'string' },
    { field: 'journal_id', headerName: 'JID', type: 'string' },
    { field: 'date', headerName: 'Date', type: 'date',
      valueFormatter: (value) => {return dtFmt.format(value)}, },
    { field: 'description', headerName: 'Description', type: 'string' },
    { field: 'amount', headerName: 'Montant', type: 'number',
      valueFormatter: (value) => {return nbFmt.format(value)}, },
    { field: 'category_id', headerName: 'Catégorie', type: 'singleSelect',
      getOptionValue: (value) => value.id,
      getOptionLabel: (value) => value.name,
      valueOptions: categories },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      navigate("/");
    }
  }, [navigate]);
  
  
  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    function setData(data) {
      const categories = {};
      data.data.map(categorie => { categories.push({ id: categorie.id, name: categorie.attributes.name }) });
      setCategories(categories);
    }

    fetch("/api/v1/categories", 
    { headers: {Authorization: `Bearer ${accessToken}`}})
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => console.log(error));
  }, []);
  
  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    
    function setData(data) {
      const transactions = [];
      data.data.map(transaction => {
        transaction.attributes.transactions.map(split => {
          transactions.push({
            id: transaction.id,
            journal_id: split.transaction_journal_id,
            type: split.type,
            date: Date.parse(split.date),
            amount: split.amount,
            description: split.description,
            category_id: split.category_id
          })
        });
      });
      setTransactions(transactions)
    }

    fetch("/api/v1/categories/14/transactions", 
        { headers: {Authorization: `Bearer ${accessToken}`}})
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => console.log(error));
  }, []);

  // const handleUpdate = async (e) => {
  //   const payload = {
  //       "apply_rules": false,
  //       "fire_webhooks": false,
  //       "transactions":
  //       [
  //           {
  //               "transaction_journal_id": 1222,
  //               "description": "Updated description"
  //           },
  //           {
  //               "transaction_journal_id": 1333
  //           }
  //       ]
  //   }
  //   e.preventDefault();
  //   try {
  //     await fetch("https://api/products", {
  //       method: "POST",
  //       headers: { admin: "true", "Content-Type": "application/json" },
  //       body: JSON.stringify(body),
  //     });
  //   } catch (error) {
  //     console.log("error");
  //   }
  // };

  return (
    <div>
      <DataGrid
        rows={transactions}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          columnVisibilityModel: {
            id: false,
            journal_id: false,
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        autosizeOptions={{
          columns: ['description', 'amoun'],
          includeOutliers: true,
          includeHeaders: false,
        }}
      />
      <pre><code>{JSON.stringify(transactions, null, 2)}</code></pre>
    </div>
  );
}