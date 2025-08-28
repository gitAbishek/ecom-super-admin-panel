import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  handlePageChange: (data: { selected: number }) => void;
  total: number;
  pageCount?: number;
  currentPage?: number;
}

export const Pagination: React.FC<Props> = ({ handlePageChange, total, pageCount, currentPage }) => {
  const totalPages = pageCount || Math.ceil(total/7);
  
  return (
    <div className="flex justify-end py-5">
      <ReactPaginate
        previousLabel={
          <span className="px-3 py-2 rounded-lg font-medium transition-colors bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <ChevronLeft className="h-4 w-4" />
          </span>
        }
        nextLabel={
          <span className="px-3 py-2 rounded-lg font-medium transition-colors bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <ChevronRight className="h-4 w-4" />
          </span>
        }
        breakLabel={<span className="px-2 text-gray-400 dark:text-gray-500">...</span>}
        pageCount={totalPages}
        forcePage={currentPage}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName="flex gap-2 items-center justify-end"
        pageClassName=""
        pageLinkClassName="px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer shadow-sm border border-gray-200 dark:border-gray-700"
        activeClassName="pagination-active"
        disabledClassName="opacity-50 cursor-not-allowed"
        previousClassName=""
        nextClassName=""
      />
    </div>
  );
};

export default Pagination;
