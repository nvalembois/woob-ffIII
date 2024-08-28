import React, { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Categories() {
  const navigate = useNavigate();
  const accessToken = Cookies.get("access_token");
  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [navigate]);
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("/api/v1/categories/14/transactions", 
        { headers: {Authorization: `Bearer ${accessToken}`}})
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => console.log(error));
  }, []);

  const dtFmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeZone: 'Europe/Paris'});
  const nbFmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
  return (
    <div>
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
        { data.data ? data.data.map(row => {
          const id = row.id
          const transaction = row.attributes.transactions[0]
          return (
          <tr key={id}>
            <td>{transaction.type}</td>
            <td>{dtFmt.format(Date.parse(transaction.date))}</td>
            <td>{transaction.description}</td>
            <td style={{ textAlign: "right" }}>{nbFmt.format(transaction.amount)}</td>
            <td>{transaction.category_name}</td>
          </tr>
          )
        }) : '' }
        </tbody>
      </table>
      <pre><code>typeof data : {typeof data}</code></pre>
      <pre><code>apiData data: {Object.keys(data)}</code></pre>
      <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
    </div>
  );
}