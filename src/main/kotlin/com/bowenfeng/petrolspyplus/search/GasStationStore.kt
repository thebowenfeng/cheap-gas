package com.bowenfeng.petrolspyplus.search

import com.bowenfeng.petrolspyplus.search.model.BoundingBox
import com.bowenfeng.petrolspyplus.search.model.GasStation
import org.springframework.stereotype.Repository

@Repository
class GasStationStore {
    fun getStations(current: BoundingBox, previous: BoundingBox): List<GasStation> {}
}