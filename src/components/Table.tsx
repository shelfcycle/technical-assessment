interface TableRow<T> {
  field: string;
  render?: (item: T) => JSX.Element;
  title: string;
}

interface TableProps<T> {
  items: T[];
  rowConfig: TableRow<T>[];
}
export const Table = <T,>(props: TableProps<T>) => {
  return (
    <div className="relative overflow-x-auto rounded-lg drop-shadow-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {props.rowConfig.map((x, i) => (
              <th key={`table_heading_${i}`} scope="col" className="px-6 py-3">
                {x.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {props.items.map((x, i) => (
            <tr
              key={`table_row_${i}`}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              {props.rowConfig.map((y, idx) => (
                <td key={`table_row_column_${i}_${idx}`} className="px-6 py-4">
                  {y.render ? y.render(x) : x[y.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
