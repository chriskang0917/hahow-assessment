import { useAutoPagination } from "@/components/ui/data-table/hooks/use-auto-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * Properties for the AutoPagination component
 *
 * @interface AutoPaginationProps
 */
interface AutoPaginationProps {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether the previous page button is enabled */
  canPreviousPage: boolean;
  /** Whether the next page button is enabled */
  canNextPage: boolean;
  /** Number of page numbers displayed on the left and right of the current page (default: 1) */
  siblingCount?: number;
  /** Number of page numbers displayed at the beginning and end of the pagination (default: 1) */
  boundaryCount?: number;
  /** Custom Pagination CSS class name */
  className?: string;
  /** Callback function triggered when page changes */
  onPageChange: (page: number) => void;
}

/**
 * Auto Pagination Component
 *
 * Provides complete pagination functionality including previous/next buttons and
 * intelligently displayed page number lists. Automatically shows ellipsis when
 * there are many pages and supports customizable sibling and boundary page counts.
 *
 * @param props - Component properties
 * @param props.currentPage - Current page number (1-based)
 * @param props.totalPages - Total number of pages
 * @param props.canPreviousPage - Whether the previous page button is enabled
 * @param props.canNextPage - Whether the next page button is enabled
 * @param props.siblingCount - Number of page numbers displayed on the left and right of the current page (default: 1)
 * @param props.boundaryCount - Number of page numbers displayed at the beginning and end of the pagination (default: 1)
 * @param props.className - Custom Pagination CSS class name
 * @param props.onPageChange - Callback function triggered when page changes
 *
 * @returns Returns null if totalPages <= 0, otherwise returns the pagination JSX element
 *
 * @example
 * ```tsx
 * <AutoPagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => console.log(page)}
 *   canPreviousPage={false}
 *   canNextPage={true}
 *   siblingCount={1}
 *   boundaryCount={1}
 * />
 * ```
 */
function AutoPagination({
  currentPage,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
  canPreviousPage,
  canNextPage,
  className,
  onPageChange,
}: AutoPaginationProps) {
  const paginationItems = useAutoPagination({
    currentPage,
    totalPages,
    siblingCount,
    boundaryCount,
  });

  if (totalPages <= 0) {
    return null;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={!canPreviousPage}
            onClick={() => onPageChange(currentPage - 1)}
          />
        </PaginationItem>

        {paginationItems.map((item, index) => (
          <PaginationItem key={index}>
            {item.type === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink isActive={item.isActive} onClick={() => onPageChange(item.page!)}>
                {item.page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            aria-disabled={!canNextPage}
            onClick={() => onPageChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default AutoPagination;
