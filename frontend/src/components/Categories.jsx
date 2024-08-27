import React, { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Select } from '@chakra-ui/react';

export default function Categories() {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      navigate("/");
    }
  }, [navigate]);
  
  const [categories, setCategories] = useState({});
  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    fetch("/api/v1/categories", 
        { headers: {Authorization: `Bearer ${accessToken}`}})
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.log(error));
    }, []);
  
  const [transactions, setTransactions] = useState({});
  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    fetch("/api/v1/categories/14/transactions", 
        { headers: {Authorization: `Bearer ${accessToken}`}})
    .then((response) => response.json())
    .then((data) => setTransactions(data))
    .catch((error) => console.log(error));
  }, []);

  const dtFmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeZone: 'Europe/Paris'});
  const nbFmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
  return (
    <div>
      {/* <pre><code>{JSON.stringify(transactions, null, 2)}</code></pre> */}
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Description</th>
            <th>Montant</th>
            <th>Catégorie</th>
          </tr>
        </thead>
        <tbody>
        { transactions.data ? transactions.data.map(row => {
          const id = row.id
          const transaction = row.attributes.transactions[0]
          return (
          <tr key={id}>
            <td>{transaction.type}</td>
            <td>{dtFmt.format(Date.parse(transaction.date))}</td>
            <td>{transaction.description}</td>
            <td style={{ textAlign: "right" }}>{nbFmt.format(transaction.amount)}</td>
            <td>
              <Select value={transaction.category_id}>
                { categories.data.map(cat => {
                    return (
                <option value={cat.id}>{cat.attributes.name}</option>
                  )
                  })
                }
              </Select>
            </td>
          </tr>
          )
        }) : '' }
        </tbody>
      </table>
    </div>
  );
}