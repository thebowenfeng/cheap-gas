package com.bowenfeng.petrolspyplus.search

import com.bowenfeng.petrolspyplus.search.model.BoundingBox
import com.bowenfeng.petrolspyplus.search.model.GasStation
import com.bowenfeng.petrolspyplus.search.model.StationSearchRequest
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/search")
class SearchController(
    val gasStationStore: GasStationStore
) {
    @PostMapping("/stations")
    suspend fun searchGasStations(@RequestBody searchRequest: StationSearchRequest): List<GasStation> = 
        gasStationStore.getStations(
            BoundingBox(
                topRight = searchRequest.topRight,
                bottomLeft = searchRequest.bottomLeft,
            ),
            previous = null
        )
}