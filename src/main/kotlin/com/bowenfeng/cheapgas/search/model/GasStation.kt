package com.bowenfeng.cheapgas.search.model

import com.bowenfeng.cheapgas.common.Coordinate

data class GasStation(
    val name: String,
    val location: Coordinate,
    val address: String,
    val tradingHours: List<TradingHour>?,
    val icon: String,
    val prices: List<Price>,
)
