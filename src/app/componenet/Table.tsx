"use client";
import React, { useState } from "react";
import Image from "next/image";
// import filter from "@/app/assent/icons8-filter-24.png"
// import pencil from "@/app/assent/school-material_3156591 (1).png"
// import trash from "@/app/assent/delete_2550213.png"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  const [filterLogic, setFilterLogic] = useState<"AND" | "OR" | "NAND" | "NOR">("AND");
  const [draggedFilters, setDraggedFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});
  const [initialFilters, setInitialFilters] = useState<{ [key: string]: any }>({});
  const [appliedFilters, setAppliedFilters] = useState<any[]>([]);  // فیلترهای اعمال‌شده

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

  const handleApplyFilter = () => {
    if (!selectedColumn || !inputValue) return;

    const newFilter = {
      column: selectedColumn,
      value: inputValue,
      determinant: determinantValue,  // استفاده از مقادیر جداگانه برای هر فیلتر
      startOrEnd: startOrEnd
    };

    setFilters((prev) => ({
      ...prev,
      [selectedColumn]: inputValue,
      determinant: determinantValue,  // فقط برای همین فیلتر
      startOrEnd: startOrEnd
    }));

    
    setAppliedFilters((prev) => [...prev, newFilter]);

    setInputValue("");
    setSelectedColumn("");
  };

  const handleDeterminantChange = (filterIndex: number, newDeterminant: string) => {
    setAppliedFilters((prev) => {
      const updatedFilters = [...prev];
      updatedFilters[filterIndex].determinant = newDeterminant;  
      return updatedFilters;
    });
  };



  const handleCheckboxChange = (key: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    if (!selectedFilters[key]) {
      handleDropFilter(key);
    }

  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedFilters = Array.from(draggedFilters);
    const [movedItem] = updatedFilters.splice(result.source.index, 1);
    updatedFilters.splice(result.destination.index, 0, movedItem);

    setDraggedFilters(updatedFilters);
  };

  const handleClearFilter = (key: string) => {
    setDraggedFilters((prevDraggedFilters) => {
      return prevDraggedFilters.filter((filterKey) => filterKey !== key);
    });


    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[key] !== null && initialFilters[key]) {
        updatedFilters[key] = initialFilters[key];

} else {
        updatedFilters[key] = null;
      }
      return updatedFilters;
    });
    setSelectedFilters((prevSelectedFilters) => {
      const updatedSelectedFilters = { ...prevSelectedFilters };
      delete updatedSelectedFilters[key];
      return updatedSelectedFilters;
    });

  };

  const handleDropFilter = (key) => {
    if (!draggedFilters.includes(key)) {
      setDraggedFilters([...draggedFilters, key]);
    }
  };

  const handleClearFilterd = (key: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      delete updatedFilters[key];
      return updatedFilters;
    });
  };

  const handleEditFilter = (key: string) => {
    setActiveHeaderFilter(key);
    setSelectedColumn(key);
    setInputValue(filters[key] || "");
    setDeterminantValue(filters.determinant || "مساوی");
    setStartOrEnd(filters.startOrEnd || "شروع از");
  };

  const parseDate = (date: string) => {
    const [year, month, day] = date.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const filterResults = columns.map((column) => {
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
        const numInvoiceValue = parseFloat(invoice[column.key].replace(/\D/g, ""));
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

    switch (filterLogic) {
      case "AND":
        return filterResults.every((result) => result);
      case "OR":
        return filterResults.some((result) => result);
      case "NAND":
        return !filterResults.every((result) => result);
      case "NOR":
        return !filterResults.some((result) => result);
      default:
        return true;
    }
  });

  const handleKeyPress = (e: React.KeyboardEvent, key: string) => {
    if (e.key === "Enter") {
      setFilters((prev) => ({
        ...prev,
        [key]: (e.target as HTMLInputElement).value,
        determinant: determinantValue,
        startOrEnd: startOrEnd,
      }));

      setInputValue("");
      setSelectedColumn("");
    }
  };

  const handleFilterChange = (value: string, key: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className=" p-6  ">
      <div className="flex flex-wrap space-x-2 mb-6">
        <div className="my-4 w-full md:w-auto">
          <div className="flex space-x-4 mb-4">
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              style={{ marginLeft: "16px" }}
              className="border border-gray-300 bg-white px-1 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                      className="border  border-gray-300 bg-white px-1  rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                      className="border mr-2 border-gray-300 bg-white px-1  rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                  className="border border-gray-300 bg-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="مقدار فیلتر"
                />
              </>
            )}

            <button
              onClick={handleApplyFilter}
              className="bg-gray-200  px-2 py-1 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <Image src={filter} alt="" />
            </button>
          </div>
        </div>
      </div>

      {(Object.keys(filters).length > 3 || draggedFilters.length > 0) ? (
        <div>
          <div className="space-y-2 flex flex-row">
            {Object.keys(filters).map((key) => {
              if (key !== "determinant" && key !== "startOrEnd") {
                return (
                  <div
                    key={key}
                    className="flex flex-row items-center space-x-2"
                    onClick={() => handleClearFilterd(key)}
                  >
                    <div
                      className="flex flex-row gap-1 ml-4 bg-gray-200 px-2 py-1 rounded-md"
                    >
                      <div>
                        <input
                          type="checkbox"
                          checked={selectedFilters[key] || false}
                          onChange={() => handleCheckboxChange(key)}
                        />
                      </div>
                      <div>{columns.find((col) => col.key === key)?.label}</div>
                      <div>{filters.determinant}</div>

                     <div>{filters[key]}</div>
                      <div>
                        <button
                          className="mr-4 hover:bg-gray-500 hover:rounded-full"
                          onClick={() => handleEditFilter(key)}
                        >
                          <Image className="w-4" src={pencil} alt="" />
                        </button>
                      </div>
                      <div>
                        <button
                          className="hover:bg-gray-500 hover:rounded-full"
                          onClick={() => handleClearFilterd(key)}
                        >
                          <Image className="w-4" src={trash} alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="filters">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-4 border rounded bg-gray-100 min-h-[100px]"
                  style={{
                    border: "2px dashed #ccc",
                  }}
                >
                  {draggedFilters.map((filterKey, index) => (
                    <Draggable key={filterKey} draggableId={filterKey} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 mb-2 rounded shadow w-64 flex items-center justify-between"
                        >
                          <span>
                            {columns.find((col) => col.key === filterKey)?.label}
                            {filters.determinant}
                            <div>{filters[filterKey]}</div> 
                          </span>
                          <button
                            onClick={() => handleClearFilter(filterKey)}
                            className="text-red-500 hover:underline"
                          >
                            <Image className="w-4" src={trash} alt="" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ) : (
        <div className="space-y-2 flex flex-row">
          {Object.keys(filters).map((key) => {
            if (key !== "determinant" && key !== "startOrEnd") {
              return (
                <div
                  key={key}
                  onClick={() => handleDropFilter(key)}
                  className="flex flex-row items-center space-x-2"
                >
                  <div
                    className="flex flex-row gap-1 ml-4 bg-gray-200 px-2 py-1 rounded-md"
                    onClick={() => handleClearFilter(key)}
                  >
                    <div>{columns.find((col) => col.key === key)?.label}</div>
                    <div>{filters.determinant}</div>
                    <div>{filters[key]}</div>
                    <div>
                      <button
                        className="mr-4 hover:bg-gray-500 hover:rounded-full"
                        onClick={() => handleEditFilter(key)}
                      >
                        <Image className="w-4" src={pencil} alt="" />
                      </button>
                    </div>
                    <div>
                      <button
                        className="hover:bg-gray-500 hover:rounded-full"
                        onClick={() => handleClearFilterd(key)}
                      >
                        <Image className="w-4" src={trash} alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      <table className="w-full mt-6 table-auto border-collapse rounded-md overflow-hidden">
        <thead className="bg-gray-200 text-black">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-center border border-gray-300 px-6 py-3"
              >
                {column.label}
              </th>
            ))}
          </tr>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="text-center border border-gray-300">
                <input
                  type="text"
                  value={filters[column.key] || ""}
                  onKeyPress={(e) => handleKeyPress(e, column.key)}
                  onChange={(e) => handleFilterChange(e.target.value, column.key)}
                  className="border hover:border-gray-400 ml-2 border-gray-300 w-28 px-1  rounded-md focus:ring-2 focus:ring-gray-500"
                />
                {(column.key === "sender" || column.key === "receiver") && (
                  <select
                    value={startOrEnd}
                    onChange={(e) => setStartOrEnd(e.target.value)}
                    className="border ml-2 border-gray-300 px-1  rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="شروع از">شروع از</option>
                    <option value="ختم به">ختم به</option>
                  </select>
                )}
                {(column.key === "amount" ||
                  column.key === "invoiceNumber" ||
                  column.key === "date") && (
                    <select
                      value={determinantValue}
                      onChange={(e) => setDeterminantValue(e.target.value)}
                      className="border ml-2 border-gray-300 px-1  rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="مساوی">مساوی</option>
                      <option value="بزرگ تر">بزرگ تر</option>
                      <option value="بزرگ تر مساوی">بزرگ تر مساوی</option>
                      <option value="کوچک تر">کوچک تر</option>
                      <option value="کوچک تر مساوی">کوچک تر مساوی</option>
                    </select>
                  )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} className="border text-center p-2">
                  {invoice[column.key]}
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