import { useState } from "react";
import { AccountDetail } from "../components/organisms/AccountDetail";
import { AccountList } from "../components/organisms/AccountList";
import { StatusMessage } from "../components/molecules/StatusMessage";
import { AccountsTemplate } from "../components/templates/AccountsTemplate";
import { useAccountDetail, useAccounts } from "../hooks/useAccounts";

export function AccountsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const accounts = useAccounts();
  const detail = useAccountDetail(selectedId);

  const list =
    accounts.status === "success" ? (
      <AccountList accounts={accounts.data} selectedId={selectedId} onSelect={setSelectedId} />
    ) : accounts.status === "error" ? (
      <StatusMessage kind="error" message={accounts.message} />
    ) : (
      <StatusMessage kind="loading" />
    );

  return <AccountsTemplate list={list} detail={<AccountDetail state={detail} />} />;
}
