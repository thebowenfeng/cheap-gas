package com.bowenfeng.cheapgas.search

import com.bowenfeng.cheapgas.search.model.BoundingBox
import com.bowenfeng.cheapgas.search.model.GasStation
import org.springframework.stereotype.Repository

@Repository
class GasStationStore {
    fun getStations(current: BoundingBox, previous: BoundingBox): List<GasStation> {}
}
