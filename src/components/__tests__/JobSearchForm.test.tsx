// __tests__/JobSearchForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobSearchForm from '@/components/JobSearchForm';

type Job = {
  job_title: string;
  employer_name: string;
  job_apply_link: string;
};

describe('<JobSearchForm />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // @ts-expect-error: Mocking global.fetch for testing purposes
    global.fetch = jest.fn();
  });

  it('renders inputs and calls onResults with data', async () => {
    const mockOnResults = jest.fn();
    const fakeJobs: Job[] = [{ job_title: 'X', employer_name: 'Y', job_apply_link: '#' }];

    // @ts-expect-error: Mocking global.fetch for testing purposes
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: fakeJobs }),
    });

    render(<JobSearchForm onResults={mockOnResults} />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText('query'), {
      target: { value: 'React' },
    });
    fireEvent.change(screen.getByLabelText('type'), {
      target: { value: 'FULLTIME' },
    });
    fireEvent.click(screen.getByLabelText('remote'));

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /search jobs/i }));

    // Wait for onResults to be called with our fake jobs
    await waitFor(() => expect(mockOnResults).toHaveBeenCalledWith(fakeJobs));
  });

  it('on fetch error calls onResults with empty array', async () => {
    const mockOnResults = jest.fn();
    // @ts-expect-error: Mocking global.fetch for testing purposes
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('fail'));

    render(<JobSearchForm onResults={mockOnResults} />);

    // Submit without typing anything
    fireEvent.click(screen.getByRole('button', { name: /search jobs/i }));

    await waitFor(() => expect(mockOnResults).toHaveBeenCalledWith([]));
  });
});
