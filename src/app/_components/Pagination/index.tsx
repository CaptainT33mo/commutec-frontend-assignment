import React from "react";
import { usePagination, DOTS } from "@/hooks/usePagination";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

interface PaginationProps {
  onPageChange: (pageNumber: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className = "",
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const lastPage = paginationRange[paginationRange.length - 1];

  const onFirst = () => {
    onPageChange(1);
  };
  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };
  const onNext = () => {
    onPageChange(currentPage + 1);
  };
  const onLast = () => {
    lastPage && onPageChange(lastPage as number);
  };

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      <li
        className={`text-xl ${currentPage === 1 ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-black"}`}
        onClick={onFirst}
      >
        <MdKeyboardDoubleArrowLeft size={20} />
      </li>
      <li
        className={`text-xl ${currentPage === 1 ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-black"}`}
        onClick={onPrevious}
      >
        <MdOutlineKeyboardArrowLeft size={20} />
      </li>
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li key={index} className="pagination-item dots">
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={index}
            className={`cursor-pointer text-xl ${pageNumber === currentPage ? "text-black" : "text-gray-300"}`}
            onClick={() => onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={`text-xl ${currentPage === lastPage ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-black"}`}
        onClick={onNext}
      >
        <MdOutlineKeyboardArrowRight size={20} />
      </li>
      <li
        className={`text-xl ${currentPage === lastPage ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-black"}`}
        onClick={onLast}
      >
        <MdKeyboardDoubleArrowRight size={20} />
      </li>
    </ul>
  );
};

export default Pagination;
