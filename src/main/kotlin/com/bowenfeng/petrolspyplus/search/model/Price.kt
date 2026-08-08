package com.bowenfeng.petrolspyplus.search.model

enum class FuelType {
    E10,
    U91,
    DIESEL,
    PremDSL,
    U95,
    U98,
    LPG,
    TruckDSL,
    E85,
    BIODIESEL
}

data class Price(
    val type: FuelType,
    val updated: Double,
    val amount: Double,
)
