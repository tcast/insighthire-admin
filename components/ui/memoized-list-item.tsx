'use client';

import { memo, ReactNode } from 'react';

/**
 * Optimized list item component for use in lists and grids
 * Prevents unnecessary re-renders when parent component re-renders
 */

interface MemoizedListItemProps {
  id: string | number;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

// Deep comparison for list items
function areListItemPropsEqual(prevProps: MemoizedListItemProps, nextProps: MemoizedListItemProps) {
  // If ID changes, definitely re-render
  if (prevProps.id !== nextProps.id) return false;
  
  // Check other primitive props
  if (prevProps.className !== nextProps.className) return false;
  if (prevProps.onClick !== nextProps.onClick) return false;
  
  // For children, we'll allow React to handle the comparison
  // since it's often complex nested structures
  return true;
}

export const MemoizedListItem = memo<MemoizedListItemProps>(
  ({ id, children, className, onClick }) => {
    return (
      <div 
        key={id}
        className={className}
        onClick={onClick}
        data-item-id={id}
      >
        {children}
      </div>
    );
  },
  areListItemPropsEqual
);

MemoizedListItem.displayName = 'MemoizedListItem';

/**
 * Specialized memoized component for table rows
 */
interface MemoizedTableRowProps {
  id: string | number;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MemoizedTableRow = memo<MemoizedTableRowProps>(
  ({ id, children, className, onClick }) => {
    return (
      <tr 
        key={id}
        className={className}
        onClick={onClick}
        data-row-id={id}
      >
        {children}
      </tr>
    );
  },
  (prev, next) => prev.id === next.id && prev.className === next.className
);

MemoizedTableRow.displayName = 'MemoizedTableRow';

/**
 * Specialized memoized component for card components in grids
 */
interface MemoizedCardProps {
  id: string | number;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MemoizedCard = memo<MemoizedCardProps>(
  ({ id, children, className, onClick }) => {
    return (
      <article 
        key={id}
        className={className}
        onClick={onClick}
        data-card-id={id}
      >
        {children}
      </article>
    );
  },
  (prev, next) => prev.id === next.id && prev.className === next.className
);

MemoizedCard.displayName = 'MemoizedCard';