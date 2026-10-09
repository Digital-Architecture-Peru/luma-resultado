import type { Card } from "../types/card";

export const sampleCards: Card[] = [
  {
    id: "aaaaaaaa-0000-4000-8000-000000000001",
    maskedNumber: "**** **** **** 4242",
    brand: "VISA",
    type: "CREDIT",
    status: "ACTIVE",
    creditLimit: 2000000,
    availableBalance: 1350000.5,
    currency: "CLP",
    expiry: "07/28",
  },
  {
    id: "aaaaaaaa-0000-4000-8000-000000000003",
    maskedNumber: "**** **** **** 0007",
    brand: "VISA",
    type: "CREDIT",
    status: "BLOCKED",
    creditLimit: 5000,
    availableBalance: 1200.75,
    currency: "USD",
    expiry: "03/26",
  },
];
