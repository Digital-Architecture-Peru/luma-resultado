import { createAccountsClient } from "./api/accountsClient";
import { TransferPage } from "./pages/TransferPage";

const api = createAccountsClient();

export function App() {
  return <TransferPage api={api} />;
}
