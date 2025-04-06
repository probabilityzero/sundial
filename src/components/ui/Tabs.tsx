import React from 'react';
import { cn } from '../../lib/utils';

// Tabs Context
type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// Main Tabs Component
interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps & React.HTMLAttributes<HTMLDivElement>) {
  const [tabValue, setTabValue] = React.useState(value || defaultValue);
  
  const handleValueChange = React.useCallback((newValue: string) => {
    setTabValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);
  
  // If controlled value changes, update internal state
  React.useEffect(() => {
    if (value !== undefined && value !== tabValue) {
      setTabValue(value);
    }
  }, [value, tabValue]);
  
  return (
    <TabsContext.Provider
      value={{
        value: tabValue,
        onValueChange: handleValueChange,
      }}
    >
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// TabsList Component
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({
  children,
  className,
  ...props
}: TabsListProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-background p-1 text-text-secondary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// TabsTrigger Component
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled = false,
  ...props
}: TabsTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-surface text-text-primary shadow-sm"
          : "text-text-secondary hover:bg-background/80 hover:text-text-primary",
        className
      )}
      onClick={() => onValueChange(value)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// TabsContent Component
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className,
  ...props
}: TabsContentProps & React.HTMLAttributes<HTMLDivElement>) {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;
  
  if (!isSelected) return null;
  
  return (
    <div
      className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}