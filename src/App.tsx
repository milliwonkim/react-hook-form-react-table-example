// import { useFieldArray, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// const schema = yup
//   .object({
//     firstName: yup.string().required(),
//     age: yup.number().positive().integer().required(),
//   })
//   .required();

// export default function App() {
//   const { register, control, handleSubmit } = useForm();
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "emails", // 폼 필드 배열의 이름
//   });

//   const onSubmit = (data) => {
//     console.log(data);
//   };

//   return (
//     // <form onSubmit={handleSubmit(onSubmit)}>
//     //   {fields.map((field, index) => {
//     //     console.log(field);
//     //     return (
//     //       <div key={field.id}>
//     //         <input
//     //           {...register(`emails.${index}.address`)} // 필드의 이름 설정
//     //           defaultValue={field.address} // 기본 값 설정
//     //         />
//     //         <input
//     //           {...register(`emails.${index}.name`)} // 필드의 이름 설정
//     //           defaultValue={field.name} // 기본 값 설정
//     //         />
//     //         <button type="button" onClick={() => remove(index)}>
//     //           Remove
//     //         </button>
//     //       </div>
//     //     );
//     //   })}
//     //   <button type="button" onClick={() => append({ address: "" })}>
//     //     Add Email
//     //   </button>
//     //   <button type="submit">Submit</button>
//     // </form>
//   );
// }

import * as React from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MenuItem, Select } from "@mui/material";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import Selection from "./Selection";
import useTables from "./useTables";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 24,
    visits: 100,
    status: "In Relationship",
    progress: 50,
  },
  {
    firstName: "tandy",
    lastName: "miller",
    age: 40,
    visits: 40,
    status: "Single",
    progress: 80,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
];

const STATUS = [
  { name: "a", id: "1", value: "Complicated" },
  { name: "b", id: "2", value: "Single" },
  { name: "c", id: "3", value: "In Relationship" },
];

const AGE = [
  { name: "40", id: "1", value: 40 },
  { name: "24", id: "2", value: 7 },
  { name: "45", id: "3", value: 19 },
  { name: "45", id: "3", value: 39 },
  { name: "45", id: "3", value: 28 },
  { name: "45", id: "3", value: 22 },
  { name: "45", id: "3", value: 9 },
  { name: "45", id: "3", value: 24 },
  { name: "45", id: "3", value: 18 },
];

const columnHelper = createColumnHelper<Person>();

function App() {
  const [defaultValues, setDefaultValues] = React.useState({});
  const { control, watch, setValue } = useForm({});

  const columns = [
    columnHelper.accessor("firstName", {
      header: "firstName",
      cell: (info) => info.getValue(),
      // footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: "lastName",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>,
      // footer: (info) => info.column.id,
    }),
    columnHelper.accessor("visits", {
      header: () => <span>Visits</span>,
      // footer: (info) => info.column.id,
    }),
    columnHelper.accessor("progress", {
      header: "Profile Progress",

      // footer: (info) => info.column.id,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (table) => {
        return (
          <Controller
            control={control}
            defaultValue={table.getValue()}
            name={`userInfo.${table.row.id}.status`}
            render={({ field }) => {
              return (
                <Select {...field} defaultValue={table.getValue()}>
                  {STATUS.map((el) => {
                    return (
                      <MenuItem key={el.id} value={el.value}>
                        {el.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              );
            }}
          />
        );
      },
      // footer: (info) => info.column.id,
    }),
    columnHelper.accessor("age", {
      header: () => "Age",
      cell: (table) => {
        console.log("table", table, table.getValue());
        return (
          <Controller
            control={control}
            defaultValue={table.getValue()}
            name={`userInfo.${table.row.id}.age`}
            render={({ field }) => {
              return (
                <Select {...field}>
                  {AGE.map((el) => {
                    return (
                      <MenuItem key={el.id} value={el.value}>
                        {el.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              );
            }}
          />
        );
      },
      // footer: (info) => info.column.id,
    }),
  ];

  const {
    table: tables,
    globalFilter,
    setGlobalFilter,
    rowSelection,
  } = useTables();

  const datas = React.useMemo(
    () =>
      tables.getSelectedRowModel().rows.map((el) => {
        console.log(el);
        return el.original;
      }),
    [rowSelection, tables]
  );

  const table = useReactTable({
    data: datas,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  React.useEffect(() => {
    const defaultValue = { userInfo: {} };
    tables.getSelectedRowModel().rows.forEach((el) => {
      setValue(`userInfo.${el.id}.age`, el.original.age);
      setValue(`userInfo.${el.id}.status`, el.original.status);
      setValue(`userInfo.${el.id}.firstName`, el.original.firstName);
    });
    setDefaultValues(defaultValue);
  }, [tables, rowSelection]);

  console.log("----", table.getRowModel());

  console.log("watch", watch());
  console.log("datas", datas);

  return (
    <div className="p-2">
      <Selection
        table={tables}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
    </div>
  );
}

export default App;
