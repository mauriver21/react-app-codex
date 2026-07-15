import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider } from '@/components/I18nProvider';
import { FormShowcasePage } from '@/pages/FormShowcase';
import { store } from '@/store';

const renderPage = () =>
  render(
    <Provider store={store}>
      <I18nProvider>
        <FormShowcasePage />
      </I18nProvider>
    </Provider>
  );

describe('FormShowcasePage', () => {
  it('validates, fills, clears, and submits from the action buttons', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Validate' }));
    expect(await screen.findByText('Review the highlighted fields.')).toBeInTheDocument();
    expect(screen.getAllByText('This field is required.')).not.toHaveLength(0);
    expect(screen.getByText('Accept the terms to continue.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Fill example' }));
    expect(screen.getByRole('textbox', { name: /Full name/ })).toHaveValue('Alex Morgan');
    expect(screen.getByRole('textbox', { name: /Email/ })).toHaveValue('alex.morgan@example.com');
    expect(screen.getByLabelText(/Password/)).toHaveValue('AccessibleDemo123');
    expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /showcase terms/ })).toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('textbox', { name: /Full name/ })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /Email/ })).toHaveValue('');
    expect(screen.getByLabelText(/Password/)).toHaveValue('');
    expect(screen.getByRole('checkbox', { name: /showcase terms/ })).not.toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Fill example' }));
    await user.click(screen.getByRole('button', { name: 'Submit form' }));

    expect(await screen.findByText('The form was submitted successfully.')).toBeInTheDocument();
    expect(screen.getByText('Submitted values')).toBeInTheDocument();
    expect(screen.getByText(/Alex Morgan/)).toBeInTheDocument();
    expect(screen.queryByText(/AccessibleDemo123/)).not.toBeInTheDocument();
  });
});
