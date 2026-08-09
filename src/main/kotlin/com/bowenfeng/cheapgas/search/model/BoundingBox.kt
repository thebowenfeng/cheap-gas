package com.bowenfeng.cheapgas.search.model

import com.bowenfeng.cheapgas.common.Coordinate

data class BoundingBox(
    val topRight: Coordinate,
    val bottomLeft: Coordinate,
)
