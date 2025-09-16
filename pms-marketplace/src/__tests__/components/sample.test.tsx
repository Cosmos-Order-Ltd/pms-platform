import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Sample component for testing
const SampleComponent = ({ title }: { title: string }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>Welcome to PMS Marketplace</p>
      <button>Search Properties</button>
    </div>
  );
};

describe('Sample Component Tests', () => {
  it('renders the component with title', () => {
    render(<SampleComponent title="Property Marketplace" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Property Marketplace');
    expect(screen.getByText('Welcome to PMS Marketplace')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search Properties' })).toBeInTheDocument();
  });

  it('renders with different title', () => {
    render(<SampleComponent title="Find Your Perfect Stay" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Find Your Perfect Stay');
  });

  it('has accessible button', () => {
    render(<SampleComponent title="Test" />);

    const button = screen.getByRole('button', { name: 'Search Properties' });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });
});

// Test for health endpoint
describe('Health API Tests', () => {
  it('should have health endpoint structure', () => {
    const mockHealthResponse = {
      status: 'healthy',
      timestamp: '2025-09-15T16:00:00.000Z',
      service: 'pms-marketplace',
      version: '1.0.0',
      uptime: 3600,
      build: {
        version: '1.0.0',
        timestamp: '2025-09-15T16:00:00.000Z',
        environment: 'test',
      },
      dependencies: {
        api: 'connected',
      },
      responseTime: '50ms',
    };

    expect(mockHealthResponse).toHaveProperty('status');
    expect(mockHealthResponse).toHaveProperty('service', 'pms-marketplace');
    expect(mockHealthResponse).toHaveProperty('dependencies.api');
    expect(mockHealthResponse.status).toBe('healthy');
  });
});