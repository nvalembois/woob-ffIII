import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { DataGrid, GridColDef, ValueOptions, useGridApiRef } from '@mui/x-data-grid';

const dtFmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeZone: 'Europe/Paris'});
const nbFmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

type Transaction = {
  id: string
  journal_id: string
  type: string
  date: Date
  description: string
  amount: number
  category_id: string
}

export default function Categories() {
  const [cookies] = useCookies(['access_token'], {doNotParse: true})
  const [categories, setCategories] = useState<ValueOptions[]>(new Array<ValueOptions>());
  const [transactions, setTransactions] = useState<Transaction[]>(new Array<Transaction>());
  const apiRef = useGridApiRef();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', type: 'string', editable: false },
    { field: 'journal_id', headerName: 'JID', type: 'string', editable: false },
    { field: 'date', headerName: 'Date', type: 'date', editable: false,
      valueFormatter: (value: Date) => {return dtFmt.format(value)}, },
    { field: 'description', headerName: 'Description', type: 'string', editable: false },
    { field: 'amount', headerName: 'Montant', type: 'number', editable: false,
      valueFormatter: (value: number) => {return nbFmt.format(value)}, },
    { field: 'category_id', headerName: 'Catégorie', type: 'singleSelect', valueOptions: categories, editable: true },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    if (! cookies.access_token) {
      navigate("/");
    }
  }, [navigate]);
  
  
  useEffect(() => {
    function setData(data: any) {
      const categories = new Array<ValueOptions>();
      data.data.map((categorie: any) => { categories.push({value: categorie.id, label: categorie.attributes.name}) })
      setCategories(categories);
    }
    fetch("/api/v1/categories", { headers: {"Authorization": `Bearer ${cookies.access_token}`} })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.log(error));
  }, []);
  
  useEffect(() => {
    function setData(data: any) {
      const transactions = new Array<Transaction>();
      data.data.map((transaction: any) => {
        transaction.attributes.transactions.map((split: any) => {
          return transactions.push({
              id: transaction.id,
              journal_id: split.transaction_journal_id,
              type: split.type,
              date: new Date(split.date),
              description: split.description,
              amount: split.amount,
              category_id: split.category_id
          });
        });
      });
      setTransactions(transactions)
    }
    fetch("/api/v1/categories/14/transactions", { headers: {Authorization: `Bearer ${cookies.access_token}`}})
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.log(error));
  }, []);

  function handleCellUpdate(updatedRow: Transaction, originalRow: Transaction) {
    console.log(`handleCellUpdate: ${originalRow.id}/${originalRow.journal_id} ${originalRow.category_id}->${updatedRow.category_id}`)
    if (originalRow.category_id === updatedRow.category_id) return originalRow
    const payload: any = {
        apply_rules: false,
        fire_webhooks: false,
        transactions: []
    }
    transactions.map((transaction: Transaction) => {
      if (transaction.id === originalRow.id) {
        if (transaction.journal_id === originalRow.journal_id) {
          payload.transactions.push({
            transaction_journal_id: transaction.journal_id,
            category_id: updatedRow.category_id
          })
        } else {
          payload.transactions.push({transaction_journal_id: transaction.journal_id})
        }
      }
    })
    console.log(`url: /api/v1/transactions/${updatedRow.id}`)
    console.log(`payload: ${JSON.stringify(payload)}`)
    fetch(`/api/v1/transactions/${updatedRow.id}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${cookies.access_token}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      console.log(error);
      return originalRow;
    })
    return updatedRow;
  }

  return (
    <div>
      <DataGrid
        rows={transactions}
        columns={columns}
        columnVisibilityModel={{id: false, journal_id: false}}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            }
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        autosizeOnMount
        autosizeOptions={{
          columns: ['description', 'amount'],
          includeOutliers: true,
          includeHeaders: true,
        }}
        apiRef={apiRef}
        onCellClick={(e) => {
          if (e.field === "category_id" && e.cellMode === 'view' )
            apiRef.current.startCellEditMode({ id: e.id, field: e.field });
        }}
        processRowUpdate={handleCellUpdate}
      />
      {/* <pre><code>{JSON.stringify(transactions, null, 2)}</code></pre> */}
    </div>
  );
}