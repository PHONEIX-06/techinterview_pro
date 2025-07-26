import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CodeEditor = ({ 
  initialCode = "",
  language = "javascript",
  theme = "dark",
  onCodeChange = () => {},
  onLanguageChange = () => {},
  onThemeChange = () => {},
  onRunCode = () => {},
  isExecuting = false,
  executionResult = null,
  collaborators = []
}) => {
  const [code, setCode] = useState(initialCode);
  const [fontSize, setFontSize] = useState(14);
  const [isResultsPanelOpen, setIsResultsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const editorRef = useRef(null);

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' }
  ];

  const themeOptions = [
    { value: 'dark', label: 'Dark Theme' },
    { value: 'light', label: 'Light Theme' },
    { value: 'monokai', label: 'Monokai' },
    { value: 'github', label: 'GitHub' }
  ];

  const mockCode = {
    javascript: `// Two Sum Problem
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]`,
    python: `# Two Sum Problem
def two_sum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []

# Test cases
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))  # [1, 2]`,
    java: `// Two Sum Problem
import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            
            map.put(nums[i], i);
        }
        
        return new int[]{};
    }
}`
  };

  const mockExecutionResult = {
    success: true,
    output: `[0, 1]
[1, 2]`,
    executionTime: "0.045s",
    memoryUsed: "2.1 MB"
  };

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    } else {
      setCode(mockCode[language] || mockCode.javascript);
    }
  }, [language, initialCode]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleRunCode = () => {
    setIsResultsPanelOpen(true);
    setActiveTab('output');
    onRunCode(code);
  };

  const increaseFontSize = () => {
    if (fontSize < 20) setFontSize(fontSize + 1);
  };

  const decreaseFontSize = () => {
    if (fontSize > 10) setFontSize(fontSize - 1);
  };

  const formatCode = () => {
    // Mock code formatting
    console.log('Formatting code...');
  };

  const mockCollaborators = [
    { id: 1, name: 'Sarah Johnson', color: '#3B82F6', cursor: { line: 15, column: 8 } },
    { id: 2, name: 'Mike Chen', color: '#10B981', cursor: { line: 8, column: 12 } }
  ];

  const allCollaborators = collaborators.length > 0 ? collaborators : mockCollaborators;

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted">
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <Select
            options={languageOptions}
            value={language}
            onChange={onLanguageChange}
            className="w-32"
          />

          {/* Theme Selector */}
          <Select
            options={themeOptions}
            value={theme}
            onChange={onThemeChange}
            className="w-32"
          />

          {/* Font Size Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={decreaseFontSize}
              className="p-1 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors duration-200"
              title="Decrease font size"
            >
              <Icon name="Minus" size={14} />
            </button>
            <span className="text-sm text-text-secondary px-2 font-mono">{fontSize}px</span>
            <button
              onClick={increaseFontSize}
              className="p-1 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors duration-200"
              title="Increase font size"
            >
              <Icon name="Plus" size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Collaborators */}
          <div className="flex items-center space-x-1">
            {allCollaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium"
                style={{ backgroundColor: `${collaborator.color}20`, color: collaborator.color }}
                title={`${collaborator.name} - Line ${collaborator.cursor.line}`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: collaborator.color }}
                ></div>
                <span>{collaborator.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* Editor Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={formatCode}
            iconName="Code"
            title="Format code"
          />

          <Button
            variant="default"
            size="sm"
            onClick={handleRunCode}
            loading={isExecuting}
            iconName="Play"
            iconPosition="left"
          >
            Run Code
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className={`w-full h-full p-4 font-mono resize-none border-none outline-none ${
              theme === 'dark' ?'bg-gray-900 text-gray-100' :'bg-white text-gray-900'
            }`}
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
            placeholder="Start coding here..."
            spellCheck={false}
          />

          {/* Line Numbers */}
          <div className={`absolute left-0 top-0 bottom-0 w-12 ${
            theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'
          } font-mono text-right pr-2 pt-4 text-sm select-none pointer-events-none`}>
            {code.split('\n').map((_, index) => (
              <div key={index} style={{ height: `${fontSize * 1.5}px`, lineHeight: `${fontSize * 1.5}px` }}>
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Results Panel */}
        {isResultsPanelOpen && (
          <div className="w-80 border-l border-border bg-surface flex flex-col">
            {/* Results Header */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted">
              <div className="flex items-center space-x-2">
                <Icon name="Terminal" size={16} className="text-primary" />
                <h3 className="font-semibold text-text-primary">Results</h3>
              </div>
              <button
                onClick={() => setIsResultsPanelOpen(false)}
                className="p-1 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors duration-200"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Results Tabs */}
            <div className="flex border-b border-border">
              {['output', 'errors', 'tests'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-2 text-sm font-medium capitalize transition-colors duration-200 ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary bg-background' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Results Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'output' && (
                <div className="p-4">
                  {executionResult || mockExecutionResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Icon name="CheckCircle" size={16} className="text-success" />
                        <span className="text-success font-medium">Execution Successful</span>
                      </div>
                      
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                        <pre className="whitespace-pre-wrap">{(executionResult || mockExecutionResult).output}</pre>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>Time: {(executionResult || mockExecutionResult).executionTime}</span>
                        <span>Memory: {(executionResult || mockExecutionResult).memoryUsed}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-text-secondary py-8">
                      <Icon name="Play" size={32} className="mx-auto mb-2 opacity-50" />
                      <p>Run your code to see the output</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'errors' && (
                <div className="p-4">
                  <div className="text-center text-text-secondary py-8">
                    <Icon name="CheckCircle" size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No errors found</p>
                  </div>
                </div>
              )}

              {activeTab === 'tests' && (
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 bg-success bg-opacity-10 border border-success border-opacity-30 rounded-lg">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-sm font-medium">Test Case 1: Passed</span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-success bg-opacity-10 border border-success border-opacity-30 rounded-lg">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-sm font-medium">Test Case 2: Passed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted text-xs text-text-secondary">
        <div className="flex items-center space-x-4">
          <span>Line {code.split('\n').length}, Column 1</span>
          <span>{language.toUpperCase()}</span>
          <span>{code.length} characters</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Auto-save enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;