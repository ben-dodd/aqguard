import { useTable, useBlockLayout, useSortBy } from "react-table";

export default function Table({ data, columns }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable(
    {
      columns,
      data,
      autoResetSortBy: false,
    },
    useBlockLayout,
    useSortBy
  );

  return (
    <div className="w-full">
      {!data ? (
        <div>No data found.</div>
      ) : (
        <div className="w-full">
          <table {...getTableProps()} className="w-full border-collapse">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={`text-left pl-4 border ${column?.width} bg-gray-200 hover:bg-gray-300`}
                    >
                      {column.render("Header")}
                      <span className="ml-2">
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " ↑"
                            : " ↓"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                let rowProps = row.getRowProps();
                return (
                  <tr {...rowProps} className="even:bg-gray-100">
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className={`text-left pl-4 border ${cell?.column?.width}`}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
