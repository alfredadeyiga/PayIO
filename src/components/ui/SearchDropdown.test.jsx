import { render, screen } from "../../test/test-utils";
import SearchDropdown from "./SearchDropdown";
import userEvent from "@testing-library/user-event";
import { useTransactions } from "../../hooks/features/transactions/useTransactions";
import { formatCurrency } from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

vi.mock("../../hooks/features/transactions/useTransactions");

const navigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => navigate,
}));

describe("SearchDropdown", () => {
  const mockResults = [
    {
      id: "1",
      item_name: "Jeans",
      shop_name: "XL Fashions",
      amount: 200,
      category: "shopping",
      transaction_type: "expenses",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTransactions).mockReturnValue({
      data: [],
    });
  });

  it("hides loader by default", () => {
    render(<SearchDropdown />);

    const loader = screen.queryByRole("status");
    expect(loader).not.toBeInTheDocument();
  });

  it("renders loader when isLoading is true", () => {
    vi.mocked(useTransactions).mockReturnValue({
      isLoading: true,
    });

    render(<SearchDropdown />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
  });

  it("renders filtered data when query matches", () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: mockResults,
    });

    render(<SearchDropdown query="jeans" />);

    const itemName = screen.getByText(/jeans/i);
    expect(itemName).toBeInTheDocument();

    const shopName = screen.getByText(/xl fashions/i);
    expect(shopName).toBeInTheDocument();

    const amount = screen.getByText(`$${formatCurrency(200)}`);
    expect(amount).toBeInTheDocument();

    const emptyResults = screen.queryByText(/no results/i);
    expect(emptyResults).not.toBeInTheDocument();
  });

  it("renders no results when query does not match", () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: mockResults,
    });

    render(<SearchDropdown query="shirt" />);

    const emptyResults = screen.getByText(/no results/i);
    expect(emptyResults).toBeInTheDocument();
  });

  it("calls onSelect and navigates to transactions on item click", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    vi.mocked(useTransactions).mockReturnValue({
      data: mockResults,
    });

    render(<SearchDropdown query="jeans" onSelect={onSelect} />);

    const itemName = screen.getByText(/jeans/i);
    await user.click(itemName);

    expect(onSelect).toHaveBeenCalledTimes(1);

    expect(navigate).toHaveBeenCalledWith(
      "/dashboard/transactions?tab=expenses",
    );
  });
});
