"use client";
import React from "react";
import { useTableLogic } from "./TableLogic";

const TableUI: React.FC = () => {
  const {
    columns,
    filters,
    setFilters,
    inputValue,
    setInputValue,
    determinantValue,
    setDeterminantValue,
    startOrEnd,
    setStartOrEnd,
    selectedColumn,
    setSelectedColumn,
    filteredInvoices,
  } = useTableLogic();

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h2 className="text-gray-800 text-lg font-bold mb-4">فیلترها</h2>
        <div className="flex gap-4 items-center">
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="">انتخاب ستون</option>
            {columns.map((column) => (
              <option key={column.key} value={column.key}>
                {column.label}
              </option>
            ))}
          </select>

          {["sender", "receiver"].includes(selectedColumn) && (
            <select
              value={startOrEnd}
              onChange={(e) => setStartOrEnd(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            >
              <option value="شروع از">شروع از</option>
              <option value="ختم به">ختم به</option>
            </select>
          )}

          {["amount", "invoiceNumber", "date"].includes(selectedColumn) && (
            <select
              value={determinantValue}
              onChange={(e) => setDeterminantValue(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
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
            className="border border-gray-300 p-2 rounded-md"
            placeholder="مقدار فیلتر"
          />

          <button
            onClick={() =>
              setFilters({ ...filters, [selectedColumn]: inputValue })
            }
            className="bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            اعمال
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <table className="table-auto w-full text-center">
          <thead className="bg-gray-700 text-white">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-2">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2">
                    {invoice[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableUI;
