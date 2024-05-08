import React from "react";
import { usePagination, DOTS } from "@/hooks/usePagination";
import {
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

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      <li
        className={`cursor-pointer text-xl ${currentPage === 1 ? "text-gray-300" : "text-black"}`}
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
        className={`cursor-pointer text-xl ${currentPage === lastPage ? "text-gray-300" : "text-black"}`}
        onClick={onNext}
      >
        <MdOutlineKeyboardArrowRight size={20} />
      </li>
    </ul>
  );
};

export default Pagination;
