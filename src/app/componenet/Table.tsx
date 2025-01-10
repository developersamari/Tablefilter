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

const Table: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeHeaderFilter, setActiveHeaderFilter] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [determinantValue, setDeterminantValue] = useState<string>("مساوی");
  const [startOrEnd, setStartOrEnd] = useState<string>("شروع از");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [];
  const [columns] = useState<Column[]>([
    { key: "sender", label: "فرستنده" },
    { key: "receiver", label: "گیرنده" },
    { key: "invoiceNumber", label: "شماره فاکتور" },
    { key: "amount", label: "مبلغ" },
    { key: "date", label: "تاریخ" },
  ]);

  const [invoices] = useState<Invoice[]>([
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
  ]);

  const handleHeaderClick = (key: string) => {
    if (activeHeaderFilter !== key) {
      setActiveHeaderFilter(key);
      setInputValue("");
    }
  };
  const handleApplyFilter = () => {
    if (!selectedColumn || !inputValue) return;

    setFilters((prev) => ({
      ...prev,
      [selectedColumn]: inputValue,
      determinant: determinantValue,
      startOrEnd: startOrEnd,
    }));
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleDeterminantChange = (value: string) => {
    setDeterminantValue(value);
  };

  const handleStartOrEndChange = (value: string) => {
    setStartOrEnd(value);
  };

  const handleClearFilter = (key: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      delete updatedFilters[key];
      return updatedFilters;
    });
  };

  const handleEditFilter = (key: string) => {
    setActiveHeaderFilter(key);
    setInputValue(filters[key] || "");
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setFilters((prev) => ({
        ...prev,
        [activeHeaderFilter || ""]: inputValue,
        determinant: determinantValue,
        startOrEnd: startOrEnd,
      }));
      setActiveHeaderFilter(null);
    }
  };
  const handleApplyFilters = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <div className="flex space-x-2">
        <div className="my-4">
          <div className="flex space-x-2 mb-4">
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="border px-2 py-1"
            >
              <option value="">انتخاب ستون</option>
              {columns.map((column) => (
                <option key={column.key} value={column.key}>
                  {column.label}
                </option>
              ))}
            </select>

            {selectedColumn && (
              <>
                {(selectedColumn === "sender" ||
                  selectedColumn === "receiver") && (
                  <select
                    value={startOrEnd}
                    onChange={(e) => setStartOrEnd(e.target.value)}
                    className="border px-2 py-1"
                  >
                    <option value="شروع از">شروع از</option>
                    <option value="ختم به">ختم به</option>
                  </select>
                )}

                {(selectedColumn === "amount" ||
                  selectedColumn === "invoiceNumber" ||
                  selectedColumn === "date") && (
                  <select
                    value={determinantValue}
                    onChange={(e) => setDeterminantValue(e.target.value)}
                    className="border px-2 py-1"
                  >
                    <option value="مساوی">مساوی</option>
                    <option value="بزرگ تر">بزرگ تر</option>
                    <option value="بزرگ تر مساوی">بزرگ تر مساوی</option>
                    <option value="کوچک تر">کوچک تر</option>
                    <option value="کوچک تر مساوی">کوچک تر مساوی</option>
                  </select>
                )}

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="border px-2 py-1"
                  placeholder="مقدار فیلتر"
                />
              </>
            )}

            <button
              onClick={handleApplyFilter}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              اعمال فیلتر
            </button>
          </div>
        </div>

        {Object.keys(filters).map((key) => {
          if (key !== "determinant" && key !== "startOrEnd") {
            return (
              <div key={key} className="flex items-center space-x-2">
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={() => handleClearFilter(key)}
                >
                  {columns.find((col) => col.key === key)?.label}
                  {filters[key]} {filters.determinant}
                </button>
                <button
                  className="text-yellow-500"
                  onClick={() => handleEditFilter(key)}
                >
                  ویرایش
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleClearFilter(key)}
                >
                  سطل
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleHeaderClick(column.key)}
                className="border border-gray-300 px-4 py-2 cursor-pointer"
              >
                {column.label}

                {activeHeaderFilter === column.key && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="border px-2 py-1 mr-2"
                      />
                      {column.key === "sender" || column.key === "receiver" ? (
                        <select
                          value={startOrEnd}
                          onChange={(e) =>
                            handleStartOrEndChange(e.target.value)
                          }
                          className="border px-2 py-1 mr-2"
                        >
                          <option value="شروع از">شروع از</option>
                          <option value="ختم به">ختم به</option>
                        </select>
                      ) : (
                        <select
                          value={determinantValue}
                          onChange={(e) =>
                            handleDeterminantChange(e.target.value)
                          }
                          className="border px-2 py-1 mr-2"
                        >
                          <option value="مساوی">مساوی</option>
                          <option value="بزرگ تر">بزرگ تر</option>
                          <option value="بزرگ تر مساوی">بزرگ تر مساوی</option>
                          <option value="کوچک تر">کوچک تر</option>
                          <option value="کوچک تر مساوی">کوچک تر مساوی</option>
                        </select>
                      )}
                    </div>
                  </div>
                )}

                {filters[column.key] && (
                  <div className="text-sm mt-1 text-gray-600">
                    <span>
                      {column.label}: {filters[column.key]}{" "}
                      {filters.determinant}
                    </span>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="border border-gray-300 px-4 py-2"
                >
                  {invoice[column.key as keyof Invoice]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
