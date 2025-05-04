// __tests__/JobSearchForm.test.tsx
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import JobSearchForm from '@/components/JobSearchForm';

describe('<JobSearchForm />', () => {
  const mockOnResults = jest.fn();

  // Suppress console.error for this test suite
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockOnResults.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders inputs and calls onResults with data', async () => {
    const fakeJobs = [
      { job_title: 'Frontend Developer', employer_name: 'Acme', job_apply_link: '#' },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      redirected: false,
      json: async () => ({ results: fakeJobs }),
    } as Response);

    render(<JobSearchForm onResults={mockOnResults} onSearch={() => Promise.resolve()} />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText('query'), {
      target: { value: 'React' },
    });
    fireEvent.change(screen.getByLabelText('type'), {
      target: { value: 'FULLTIME' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /remote/i }));

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /search jobs/i }));

    // Wait for onResults to be called with our fake jobs
    await waitFor(() => expect(mockOnResults).toHaveBeenCalledWith(fakeJobs));
  });

  it('on fetch error calls onResults with empty array', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('fail'));

    render(<JobSearchForm onResults={mockOnResults} onSearch={() => Promise.resolve()} />);

    // Submit without typing anything
    fireEvent.click(screen.getByRole('button', { name: /search jobs/i }));

    await waitFor(() => expect(mockOnResults).toHaveBeenCalledWith([]));
  });
});
