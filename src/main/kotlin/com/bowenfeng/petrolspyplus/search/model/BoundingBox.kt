package com.bowenfeng.petrolspyplus.search.model

import com.bowenfeng.petrolspyplus.common.Coordinate

data class BoundingBox(
    val topLeft: Coordinate,
    val bottomRight: Coordinate,
)
