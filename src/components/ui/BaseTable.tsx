import React from 'react';

interface BaseTableProps {
  tableHeaders: TableHeader[];
  tableData: React.ReactElement;
  showCheckBox?: boolean;
  showAction?: boolean;
}

export interface TableHeader {
  title: string;
}

const BaseTable: React.FC<BaseTableProps> = ({
  tableHeaders,
  tableData,
  showAction = true,
}) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                {tableHeaders.map((item: TableHeader) => (
                  <th
                    scope="col"
                    className={`p-4 text-xs font-medium ${
                      item.title.toLowerCase() === 'actions' ? 'text-right' : 'text-left'
                    } text-gray-500 dark:text-gray-400 uppercase tracking-wider`}
                    key={item.title}
                  >
                    {item.title}
                  </th>
                ))}

                {showAction && (
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium text-right text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tableData}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BaseTable;
