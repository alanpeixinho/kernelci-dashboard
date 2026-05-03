import classNames from 'classnames';
import { useCallback, useMemo, type JSX } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PossibleTableFilters } from '@/types/tree/TreeDetails';

interface ITableStatusFilter {
  onClickBuild?: (value: PossibleTableFilters) => void;
  onClickTest?: (value: PossibleTableFilters) => void;
  filters: {
    label: string;
    value: PossibleTableFilters;
    isSelected: boolean;
  }[];
}

const TableStatusFilter = ({
  filters,
  onClickBuild,
  onClickTest,
}: ITableStatusFilter): JSX.Element => {
  const onClickFilter = useCallback(
    (filter: PossibleTableFilters) => {
      onClickBuild?.(filter);
      onClickTest?.(filter);
    },
    [onClickBuild, onClickTest],
  );

  const filterButtons = useMemo(
    () =>
      filters.map((filter, index) => (
        <Button
          variant="outline"
          key={filter.label}
          className={classNames(
            'hover:bg-light-blue border border-black',
            index === 0 ? 'rounded-l-full' : 'rounded-l-none',
            index === filters.length - 1 ? 'rounded-r-full' : 'rounded-r-none',
            filter.isSelected
              ? 'bg-blue text-white'
              : 'bg-transparent text-black',
          )}
          onClick={() => onClickFilter(filter.value)}
        >
          {filter.label}
        </Button>
      )),
    [filters, onClickFilter],
  );

  const selectedFilter = useMemo(
    () => filters.find(f => f.isSelected)?.value || filters[0]?.value,
    [filters],
  );

  const isAnySelected = useMemo(
    () => filters.some(f => f.isSelected),
    [filters],
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const selectItems = useMemo(
    () =>
      filters.map(filter => (
        <SelectItem
          key={filter.value}
          value={filter.value}
          className="hover:bg-light-blue cursor-pointer"
        >
          {filter.label}
        </SelectItem>
      )),
    [filters],
  );

  const filterDropdown = (
    <Select value={selectedFilter} onValueChange={onClickFilter}>
      <SelectTrigger
        className={classNames(
          'w-36 rounded-full border border-black',
          isAnySelected ? 'bg-blue text-white' : 'bg-transparent text-black',
        )}
      >
        <SelectValue placeholder="Select filter" />
      </SelectTrigger>
      <SelectContent>{selectItems}</SelectContent>
    </Select>
  );
  return (
    <div className="flex flex-col">
      <span className="ml-0 lg:ml-4">
        <FormattedMessage id="filter.tableFilter" />
      </span>
      <span>{isSmallScreen ? filterDropdown : filterButtons}</span>
    </div>
  );
};

export default TableStatusFilter;
