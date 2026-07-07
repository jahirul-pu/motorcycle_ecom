import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders landing page content correctly', () => {
    render(<Home />);
    
    // Check main title
    const heading = screen.getByRole('heading', {
      name: /Premium Motorcycle Parts/i,
    });
    expect(heading).toBeInTheDocument();

    // Check header branding
    const brand = screen.getByText('MOTO');
    expect(brand).toBeInTheDocument();
  });
});
