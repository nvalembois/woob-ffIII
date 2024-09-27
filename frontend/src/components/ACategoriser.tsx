import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { DataGrid, GridColDef, ValueOptions, useGridApiRef } from '@mui/x-data-grid';
import { useConfig } from '../utils/configLoader';
import { useTransactionsLoader } from "../api/FFIIITransaction";
import { useCategoriesLoader } from "../api/FFIIICategories";
import { FFIIICatefory } from "../model/FFIIICategory";
import { FFIIITransaction, FFIIITransactionItem } from "../model/FFIIITransaction";

const dtFmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeZone: 'Europe/Paris'});
const nbFmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

interface Transaction {
  id: string
  journal_id: string
  type: string
  date: Date
  description: string
  amount: number
  category_id: string
}

const ACategoriser: FC = () => {
  // get cookies
  const [cookies] = useCookies(['access_token'], {doNotParse: true})
  // verify session
  const navigate = useNavigate();
  useEffect(() => {
    if (! cookies.access_token) {
      navigate("/");
    }
  }, [navigate]);
  
  // load config
  const { config } = useConfig();
  
  // Load categories
  const [categories, setCategories] = useState<Array<ValueOptions>>(new Array<ValueOptions>());
  const { categoriesResult } = useCategoriesLoader(config, cookies.access_token);
  useEffect(() => {
    if (!categoriesResult) return;
    const categories = new Array<ValueOptions>();
    categoriesResult.data.map((categorie: FFIIICatefory) => { 
      categories.push({value: categorie.id, label: categorie.attributes.name})
    })
    setCategories(categories);
  }, []);

  // Load transactions
  const { transactionsResult } = useTransactionsLoader(config, cookies.access_token, {category: "14"});
  const [transactions, setTransactions] = useState<Array<Transaction>>(new Array<Transaction>());
  useEffect(() => {
    if (!transactionsResult) return;
    const transactions = new Array<Transaction>();
    transactionsResult.data.map((transaction: FFIIITransaction) => {
      transaction.attributes.transactions.map((split: FFIIITransactionItem) => {
        return transactions.push({
            id: transaction.id,
            journal_id: split.transaction_journal_id,
            type: split.type,
            date: new Date(split.date),
            description: split.description,
            amount: parseFloat(split.amount),
            category_id: split.category_id
        });
      });
    });
    setTransactions(transactions)
  }, []);

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

export default ACategoriser;