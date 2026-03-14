import { useMemo } from "react";

export interface PaginationItemConfig {
  type: "page" | "ellipsis";
  page?: number;
  isActive?: boolean;
}

export interface UseAutoPaginationProps {
  currentPage: number; // 1-based
  totalPages: number;
  siblingCount?: number; // 當前頁左右各顯示幾頁
  boundaryCount?: number; // 首尾各顯示幾頁
}

export const useAutoPagination = ({
  currentPage,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
}: UseAutoPaginationProps): PaginationItemConfig[] => {
  return useMemo(() => {
    if (totalPages <= 0) return [];

    if (totalPages === 1) {
      return [
        {
          type: "page" as const,
          page: 1,
          isActive: currentPage === 1,
        },
      ];
    }

    const range = (start: number, end: number) => {
      const length = end - start + 1;
      return Array.from({ length }, (_, idx) => idx + start);
    };

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - boundaryCount - 1;

    if (!shouldShowLeftDots && !shouldShowRightDots) {
      return range(1, totalPages).map((page) => ({
        type: "page" as const,
        page,
        isActive: page === currentPage,
      }));
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 2 * siblingCount + boundaryCount + 2;
      const leftRange = range(1, leftItemCount);

      return [
        ...leftRange.map((page) => ({
          type: "page" as const,
          page,
          isActive: page === currentPage,
        })),
        { type: "ellipsis" as const },
        ...range(totalPages - boundaryCount + 1, totalPages).map((page) => ({
          type: "page" as const,
          page,
          isActive: page === currentPage,
        })),
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 2 * siblingCount + boundaryCount + 2;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);

      return [
        ...range(1, boundaryCount).map((page) => ({
          type: "page" as const,
          page,
          isActive: page === currentPage,
        })),
        { type: "ellipsis" as const },
        ...rightRange.map((page) => ({
          type: "page" as const,
          page,
          isActive: page === currentPage,
        })),
      ];
    }

    return [
      ...range(1, boundaryCount).map((page) => ({
        type: "page" as const,
        page,
        isActive: page === currentPage,
      })),
      { type: "ellipsis" as const },
      ...range(leftSiblingIndex, rightSiblingIndex).map((page) => ({
        type: "page" as const,
        page,
        isActive: page === currentPage,
      })),
      { type: "ellipsis" as const },
      ...range(totalPages - boundaryCount + 1, totalPages).map((page) => ({
        type: "page" as const,
        page,
        isActive: page === currentPage,
      })),
    ];
  }, [currentPage, totalPages, siblingCount, boundaryCount]);
};
