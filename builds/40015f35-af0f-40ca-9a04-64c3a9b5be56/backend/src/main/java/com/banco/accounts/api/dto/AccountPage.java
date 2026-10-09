package com.banco.accounts.api.dto;

import java.util.List;

public record AccountPage(List<AccountDto> items, int page, int size, long total) {
}
