package com.bowenfeng.petrolspyplus.search.model

import com.bowenfeng.petrolspyplus.common.Coordinate

data class GasStation(
    val name: String,
    val location: Coordinate,
    val address: String,
    val tradingHours: List<TradingHour>?,
    val icon: String,
    val prices: List<Price>,
)
