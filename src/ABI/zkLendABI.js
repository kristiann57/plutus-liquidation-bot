const zkLendABI = [
    {
      "name": "IMarketImpl",
      "type": "impl",
      "interface_name": "zklend::interfaces::IMarket"
    },
    {
      "name": "core::bool",
      "type": "enum",
      "variants": [
        {
          "name": "False",
          "type": "()"
        },
        {
          "name": "True",
          "type": "()"
        }
      ]
    },
    {
      "name": "zklend::interfaces::MarketReserveData",
      "type": "struct",
      "members": [
        {
          "name": "enabled",
          "type": "core::bool"
        },
        {
          "name": "decimals",
          "type": "core::felt252"
        },
        {
          "name": "z_token_address",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "interest_rate_model",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "collateral_factor",
          "type": "core::felt252"
        },
        {
          "name": "borrow_factor",
          "type": "core::felt252"
        },
        {
          "name": "reserve_factor",
          "type": "core::felt252"
        },
        {
          "name": "last_update_timestamp",
          "type": "core::felt252"
        },
        {
          "name": "lending_accumulator",
          "type": "core::felt252"
        },
        {
          "name": "debt_accumulator",
          "type": "core::felt252"
        },
        {
          "name": "current_lending_rate",
          "type": "core::felt252"
        },
        {
          "name": "current_borrowing_rate",
          "type": "core::felt252"
        },
        {
          "name": "raw_total_debt",
          "type": "core::felt252"
        },
        {
          "name": "flash_loan_fee",
          "type": "core::felt252"
        },
        {
          "name": "liquidation_bonus",
          "type": "core::felt252"
        },
        {
          "name": "debt_limit",
          "type": "core::felt252"
        }
      ]
    },
    {
      "name": "core::array::Span::<core::felt252>",
      "type": "struct",
      "members": [
        {
          "name": "snapshot",
          "type": "@core::array::Array::<core::felt252>"
        }
      ]
    },
    {
      "name": "zklend::interfaces::IMarket",
      "type": "interface",
      "items": [
        {
          "name": "get_reserve_data",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "zklend::interfaces::MarketReserveData"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_lending_accumulator",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::felt252"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_debt_accumulator",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::felt252"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_pending_treasury_amount",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::felt252"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_total_debt_for_token",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::felt252"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_user_debt_for_token",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::felt252"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_user_flags",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::felt252"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "is_user_undercollateralized",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "apply_borrow_factor",
              "type": "core::bool"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "is_collateral_enabled",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "user_has_debt",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "deposit",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "amount",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "withdraw",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "amount",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "withdraw_all",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "borrow",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "amount",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "repay",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "amount",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "repay_for",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "amount",
              "type": "core::felt252"
            },
            {
              "name": "beneficiary",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "repay_all",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "enable_collateral",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "disable_collateral",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "liquidate",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "debt_token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "amount",
              "type": "core::felt252"
            },
            {
              "name": "collateral_token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "flash_loan",
          "type": "function",
          "inputs": [
            {
              "name": "receiver",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "amount",
              "type": "core::felt252"
            },
            {
              "name": "calldata",
              "type": "core::array::Span::<core::felt252>"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "upgrade",
          "type": "function",
          "inputs": [
            {
              "name": "new_implementation",
              "type": "core::starknet::class_hash::ClassHash"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "add_reserve",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "z_token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "interest_rate_model",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "collateral_factor",
              "type": "core::felt252"
            },
            {
              "name": "borrow_factor",
              "type": "core::felt252"
            },
            {
              "name": "reserve_factor",
              "type": "core::felt252"
            },
            {
              "name": "flash_loan_fee",
              "type": "core::felt252"
            },
            {
              "name": "liquidation_bonus",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "set_treasury",
          "type": "function",
          "inputs": [
            {
              "name": "new_treasury",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "set_interest_rate_model",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "interest_rate_model",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "set_collateral_factor",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "collateral_factor",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "set_borrow_factor",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "borrow_factor",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "set_reserve_factor",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "reserve_factor",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "set_debt_limit",
          "type": "function",
          "inputs": [
            {
              "name": "token",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "limit",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "transfer_ownership",
          "type": "function",
          "inputs": [
            {
              "name": "new_owner",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "renounce_ownership",
          "type": "function",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "name": "constructor",
      "type": "constructor",
      "inputs": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "oracle",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::NewReserve",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "z_token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "decimals",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "interest_rate_model",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "collateral_factor",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "borrow_factor",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "reserve_factor",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "flash_loan_fee",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "liquidation_bonus",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::TreasuryUpdate",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "new_treasury",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::AccumulatorsSync",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "lending_accumulator",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "debt_accumulator",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::InterestRatesSync",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "lending_rate",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "borrowing_rate",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::InterestRateModelUpdate",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "interest_rate_model",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::CollateralFactorUpdate",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "collateral_factor",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::BorrowFactorUpdate",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "borrow_factor",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::ReserveFactorUpdate",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "reserve_factor",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::DebtLimitUpdate",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "limit",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::Deposit",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "face_amount",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::Withdrawal",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "face_amount",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::Borrowing",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "raw_amount",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "face_amount",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::Repayment",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "repayer",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "beneficiary",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "raw_amount",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "face_amount",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::Liquidation",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "liquidator",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "debt_token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "debt_raw_amount",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "debt_face_amount",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "collateral_token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "collateral_amount",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::FlashLoan",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "initiator",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "receiver",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "amount",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "fee",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::CollateralEnabled",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::CollateralDisabled",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::ContractUpgraded",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "new_class_hash",
          "type": "core::starknet::class_hash::ClassHash"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "zklend::market::Market::OwnershipTransferred",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "previous_owner",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "new_owner",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "zklend::market::Market::Event",
      "type": "event",
      "variants": [
        {
          "kind": "nested",
          "name": "NewReserve",
          "type": "zklend::market::Market::NewReserve"
        },
        {
          "kind": "nested",
          "name": "TreasuryUpdate",
          "type": "zklend::market::Market::TreasuryUpdate"
        },
        {
          "kind": "nested",
          "name": "AccumulatorsSync",
          "type": "zklend::market::Market::AccumulatorsSync"
        },
        {
          "kind": "nested",
          "name": "InterestRatesSync",
          "type": "zklend::market::Market::InterestRatesSync"
        },
        {
          "kind": "nested",
          "name": "InterestRateModelUpdate",
          "type": "zklend::market::Market::InterestRateModelUpdate"
        },
        {
          "kind": "nested",
          "name": "CollateralFactorUpdate",
          "type": "zklend::market::Market::CollateralFactorUpdate"
        },
        {
          "kind": "nested",
          "name": "BorrowFactorUpdate",
          "type": "zklend::market::Market::BorrowFactorUpdate"
        },
        {
          "kind": "nested",
          "name": "ReserveFactorUpdate",
          "type": "zklend::market::Market::ReserveFactorUpdate"
        },
        {
          "kind": "nested",
          "name": "DebtLimitUpdate",
          "type": "zklend::market::Market::DebtLimitUpdate"
        },
        {
          "kind": "nested",
          "name": "Deposit",
          "type": "zklend::market::Market::Deposit"
        },
        {
          "kind": "nested",
          "name": "Withdrawal",
          "type": "zklend::market::Market::Withdrawal"
        },
        {
          "kind": "nested",
          "name": "Borrowing",
          "type": "zklend::market::Market::Borrowing"
        },
        {
          "kind": "nested",
          "name": "Repayment",
          "type": "zklend::market::Market::Repayment"
        },
        {
          "kind": "nested",
          "name": "Liquidation",
          "type": "zklend::market::Market::Liquidation"
        },
        {
          "kind": "nested",
          "name": "FlashLoan",
          "type": "zklend::market::Market::FlashLoan"
        },
        {
          "kind": "nested",
          "name": "CollateralEnabled",
          "type": "zklend::market::Market::CollateralEnabled"
        },
        {
          "kind": "nested",
          "name": "CollateralDisabled",
          "type": "zklend::market::Market::CollateralDisabled"
        },
        {
          "kind": "nested",
          "name": "ContractUpgraded",
          "type": "zklend::market::Market::ContractUpgraded"
        },
        {
          "kind": "nested",
          "name": "OwnershipTransferred",
          "type": "zklend::market::Market::OwnershipTransferred"
        }
      ]
    }
  ]

  //export default zkLendABI;
  export default zkLendABI;