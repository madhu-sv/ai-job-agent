// src/components/__tests__/JobCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobCard from '../JobCard';

describe('<JobCard />', () => {
  const props = {
    title: 'Dev',
    company: 'Co',
    location: 'Remote',
    logoUrl: undefined,
    onApply: jest.fn(),
    onSave: jest.fn(),
  };

  it('renders correctly and fires callbacks', () => {
    render(<JobCard {...props} />);

    expect(screen.getByText('Dev')).toBeInTheDocument();
    expect(screen.getByText('Co')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /apply/i }));
    expect(props.onApply).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(props.onSave).toHaveBeenCalled();
  });
});
