import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InterviewTable = ({ 
  interviews, 
  onViewDetails, 
  onScheduleFollowup, 
  onExportPDF,
  sortConfig,
  onSort,
  expandedRows,
  onToggleExpand
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(interviews.map(interview => interview.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-success', text: 'text-success-foreground', label: 'Completed' },
      cancelled: { bg: 'bg-error', text: 'text-error-foreground', label: 'Cancelled' },
      no_show: { bg: 'bg-warning', text: 'text-warning-foreground', label: 'No Show' }
    };
    
    const config = statusConfig[status] || statusConfig.completed;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={14}
        className={i < rating ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.size === interviews.length && interviews.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border"
                />
              </th>
              {[
                { key: 'date', label: 'Date' },
                { key: 'candidate', label: 'Candidate' },
                { key: 'position', label: 'Position' },
                { key: 'interviewer', label: 'Interviewer' },
                { key: 'duration', label: 'Duration' },
                { key: 'rating', label: 'Rating' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: 'Actions', sortable: false }
              ].map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-medium text-text-primary ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-muted-foreground/10' : ''
                  }`}
                  onClick={() => column.sortable !== false && onSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable !== false && (
                      <Icon name={getSortIcon(column.key)} size={14} className="text-text-secondary" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {interviews.map((interview) => (
              <React.Fragment key={interview.id}>
                <tr className="hover:bg-muted/50 transition-colors duration-200">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(interview.id)}
                      onChange={(e) => handleSelectRow(interview.id, e.target.checked)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary">
                    {new Date(interview.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-foreground">
                          {interview.candidate.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">{interview.candidate}</div>
                        <div className="text-xs text-text-secondary">{interview.candidateEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary">{interview.position}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{interview.interviewer}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{interview.duration} min</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      {getRatingStars(interview.rating)}
                      <span className="text-sm text-text-secondary ml-2">({interview.rating}/5)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(interview.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onToggleExpand(interview.id)}
                        className="p-1 text-text-secondary hover:text-text-primary rounded transition-colors duration-200"
                        title={expandedRows.has(interview.id) ? 'Collapse' : 'Expand'}
                      >
                        <Icon 
                          name={expandedRows.has(interview.id) ? 'ChevronUp' : 'ChevronDown'} 
                          size={16} 
                        />
                      </button>
                      <button
                        onClick={() => onViewDetails(interview)}
                        className="p-1 text-text-secondary hover:text-primary rounded transition-colors duration-200"
                        title="View Details"
                      >
                        <Icon name="Eye" size={16} />
                      </button>
                      <button
                        onClick={() => onExportPDF(interview)}
                        className="p-1 text-text-secondary hover:text-primary rounded transition-colors duration-200"
                        title="Export PDF"
                      >
                        <Icon name="Download" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedRows.has(interview.id) && (
                  <tr>
                    <td colSpan="9" className="px-4 py-4 bg-muted/30">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-text-primary mb-2">Interview Summary</h4>
                          <p className="text-sm text-text-secondary mb-4">{interview.summary}</p>
                          
                          <h4 className="text-sm font-medium text-text-primary mb-2">Feedback Notes</h4>
                          <p className="text-sm text-text-secondary">{interview.feedback}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-text-primary mb-2">Code Snippets</h4>
                          <div className="bg-surface rounded border border-border p-3 mb-4">
                            <pre className="text-xs text-text-primary overflow-x-auto">
                              <code>{interview.codeSnippet}</code>
                            </pre>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetails(interview)}
                              iconName="Play"
                              iconPosition="left"
                            >
                              Watch Recording
                            </Button>
                            {interview.status === 'completed' && interview.rating >= 4 && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => onScheduleFollowup(interview)}
                                iconName="Calendar"
                                iconPosition="left"
                              >
                                Schedule Follow-up
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Bulk Actions */}
      {selectedRows.size > 0 && (
        <div className="border-t border-border bg-muted/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {selectedRows.size} interview{selectedRows.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
              >
                Export Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRows(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewTable;