"use client";

import React, { useState } from "react";

interface Column {
  key: string;
  label: string;
}

interface Invoice {
  sender: string;
  receiver: string;
  invoiceNumber: string;
  amount: string;
  date: string;
}

export const useTableLogic = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeHeaderFilter, setActiveHeaderFilter] = useState<string | null>(
    null
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [determinantValue, setDeterminantValue] = useState<string>("مساوی");
  const [startOrEnd, setStartOrEnd] = useState<string>("شروع از");
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  const columns: Column[] = [
    { key: "sender", label: "فرستنده" },
    { key: "receiver", label: "گیرنده" },
    { key: "invoiceNumber", label: "شماره فاکتور" },
    { key: "amount", label: "مبلغ" },
    { key: "date", label: "تاریخ" },
  ];

  const invoices: Invoice[] = [
    {
      sender: "شرکت الف",
      receiver: "شرکت ب",
      invoiceNumber: "001",
      amount: "10000 تومان",
      date: "1402/01/01",
    },
    {
      sender: "شرکت ج",
      receiver: "شرکت د",
      invoiceNumber: "002",
      amount: "15000 تومان",
      date: "1402/01/02",
    },
    {
      sender: "شرکت الف",
      receiver: "شرکت د",
      invoiceNumber: "003",
      amount: "12000 تومان",
      date: "1402/01/03",
    },
    {
      sender: "شرکت ج",
      receiver: "شرکت ب",
      invoiceNumber: "004",
      amount: "13000 تومان",
      date: "1402/01/04",
    },
  ];

  const parseDate = (date: string) => {
    const [year, month, day] = date.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const filteredInvoices = invoices.filter((invoice) => {
    return columns.every((column) => {
      const filterValue = filters[column.key];
      const determinant = filters.determinant || "مساوی";
      const startEnd = filters.startOrEnd || "شروع از";

      if (!filterValue) return true;

      const invoiceValue = invoice[column.key].toLowerCase();
      const filterValueLower = filterValue.toLowerCase();

      if (column.key === "sender" || column.key === "receiver") {
        if (startEnd === "شروع از") {
          return invoiceValue.startsWith(filterValueLower);
        } else if (startEnd === "ختم به") {
          return invoiceValue.endsWith(filterValueLower);
        }
      }

      if (column.key === "amount" || column.key === "invoiceNumber") {
        const numInvoiceValue = parseFloat(
          invoice[column.key].replace(/\D/g, "")
        );
        const numFilterValue = parseFloat(filterValue);

        if (isNaN(numInvoiceValue) || isNaN(numFilterValue)) {
          return true;
        }

        switch (determinant) {
          case "بزرگ تر":
            return numInvoiceValue > numFilterValue;
          case "بزرگ تر مساوی":
            return numInvoiceValue >= numFilterValue;
          case "مساوی":
            return numInvoiceValue === numFilterValue;
          case "کوچک تر":
            return numInvoiceValue < numFilterValue;
          case "کوچک تر مساوی":
            return numInvoiceValue <= numFilterValue;
          default:
            return true;
        }
      }

      if (column.key === "date") {
        const dateInvoiceValue = parseDate(invoice[column.key]);
        const dateFilterValue = parseDate(filterValue);

        switch (determinant) {
          case "بزرگ تر":
            return dateInvoiceValue > dateFilterValue;
          case "بزرگ تر مساوی":
            return dateInvoiceValue >= dateFilterValue;
          case "مساوی":
            return dateInvoiceValue.getTime() === dateFilterValue.getTime();
          case "کوچک تر":
            return dateInvoiceValue < dateFilterValue;
          case "کوچک تر مساوی":
            return dateInvoiceValue <= dateFilterValue;
          default:
            return true;
        }
      }

      return invoice[column.key].includes(filterValue);
    });
  });

  return {
    columns,
    invoices,
    filteredInvoices,

    filters,
    setFilters,
    activeHeaderFilter,
    setActiveHeaderFilter,
    inputValue,
    setInputValue,
    determinantValue,
    setDeterminantValue,
    startOrEnd,
    setStartOrEnd,
    selectedColumn,
    setSelectedColumn,
  };
};
