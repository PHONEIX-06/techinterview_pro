import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onExportAll 
}) => {
  const positionOptions = [
    { value: '', label: 'All Positions' },
    { value: 'frontend', label: 'Frontend Developer' },
    { value: 'backend', label: 'Backend Developer' },
    { value: 'fullstack', label: 'Full Stack Developer' },
    { value: 'mobile', label: 'Mobile Developer' },
    { value: 'devops', label: 'DevOps Engineer' },
    { value: 'data', label: 'Data Scientist' },
    { value: 'ml', label: 'ML Engineer' },
    { value: 'qa', label: 'QA Engineer' }
  ];

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
    { value: '1', label: '1+ Stars' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' }
  ];

  const interviewerOptions = [
    { value: '', label: 'All Interviewers' },
    { value: 'john_doe', label: 'John Doe' },
    { value: 'sarah_wilson', label: 'Sarah Wilson' },
    { value: 'mike_chen', label: 'Mike Chen' },
    { value: 'emily_davis', label: 'Emily Davis' },
    { value: 'alex_johnson', label: 'Alex Johnson' }
  ];

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Filter Interviews</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportAll}
            iconName="Download"
            iconPosition="left"
          >
            Export All
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Search by Candidate */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search by candidate name..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Date Range From */}
        <div>
          <Input
            type="date"
            label="From Date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Date Range To */}
        <div>
          <Input
            type="date"
            label="To Date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Position Filter */}
        <div>
          <Select
            label="Position"
            options={positionOptions}
            value={filters.position}
            onChange={(value) => onFilterChange('position', value)}
            className="w-full"
          />
        </div>

        {/* Rating Filter */}
        <div>
          <Select
            label="Rating"
            options={ratingOptions}
            value={filters.rating}
            onChange={(value) => onFilterChange('rating', value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            label="Status"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => onFilterChange('status', value)}
            className="w-full"
          />
        </div>

        {/* Interviewer Filter */}
        <div>
          <Select
            label="Interviewer"
            options={interviewerOptions}
            value={filters.interviewer}
            onChange={(value) => onFilterChange('interviewer', value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm text-text-secondary">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              
              let displayValue = value;
              if (key === 'position') {
                displayValue = positionOptions.find(opt => opt.value === value)?.label || value;
              } else if (key === 'rating') {
                displayValue = ratingOptions.find(opt => opt.value === value)?.label || value;
              } else if (key === 'status') {
                displayValue = statusOptions.find(opt => opt.value === value)?.label || value;
              } else if (key === 'interviewer') {
                displayValue = interviewerOptions.find(opt => opt.value === value)?.label || value;
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                >
                  <span>{displayValue}</span>
                  <button
                    onClick={() => onFilterChange(key, '')}
                    className="hover:text-primary/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;