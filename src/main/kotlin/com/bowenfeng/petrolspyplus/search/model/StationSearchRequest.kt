package com.bowenfeng.petrolspyplus.search.model

import com.bowenfeng.petrolspyplus.common.Coordinate

data class StationSearchRequest(
    val topRight: Coordinate,
    val bottomLeft: Coordinate,
)
